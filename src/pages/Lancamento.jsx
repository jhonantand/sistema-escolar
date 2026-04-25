import { useMemo, useState } from "react";

function Lancamento({
  movimentacoes,
  onAdicionarMovimentacao,
  quinzenaAtual,
  historicoQuinzenas,
  registrosQuinzenas,
  onMarcarStatusAluno,
  setMovimentacoes,
}) {
  const [tipo, setTipo] = useState("Saída");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("Evento");
  const [valor, setValor] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("Pix");
  const [evento, setEvento] = useState("Páscoa");

  const [popupHistoricoAberto, setPopupHistoricoAberto] = useState(false);
  const [popupMovAberto, setPopupMovAberto] = useState(false);

  const [quinzenaSelecionadaId, setQuinzenaSelecionadaId] = useState(null);

  const [dataInicialCota, setDataInicialCota] = useState("");
  const [dataFinalCota, setDataFinalCota] = useState("");

  const [dataInicialMov, setDataInicialMov] = useState("");
  const [dataFinalMov, setDataFinalMov] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [editDescricao, setEditDescricao] = useState("");
  const [editValor, setEditValor] = useState("");
  const [editCategoria, setEditCategoria] = useState("");
  const [editFormaPagamento, setEditFormaPagamento] = useState("");
  const [editEvento, setEditEvento] = useState("");
  const [editTipo, setEditTipo] = useState("Entrada");

  const registrosAtual = useMemo(() => {
    if (!quinzenaAtual) return [];
    return registrosQuinzenas.filter((item) => item.quinzenaId === quinzenaAtual.id);
  }, [quinzenaAtual, registrosQuinzenas]);

  const pagosAtual = registrosAtual.filter((item) => item.status === "pago");
  const aguardandoAtual = registrosAtual.filter((item) => item.status === "aguardando");
  const atrasadosAtual = registrosAtual.filter((item) => item.status === "atrasado");

  const quinzenaSelecionada = useMemo(() => {
    return historicoQuinzenas.find((item) => item.id === quinzenaSelecionadaId) || null;
  }, [historicoQuinzenas, quinzenaSelecionadaId]);

  function normalizarDataBrOuDate(dataStr) {
    if (!dataStr) return null;

    const soData = String(dataStr).split(" ")[0];

    if (soData.includes("/")) {
      const [dia, mes, ano] = soData.split("/");
      const data = new Date(`${ano}-${mes}-${dia}T00:00:00`);
      return Number.isNaN(data.getTime()) ? null : data;
    }

    const data = new Date(`${soData}T00:00:00`);
    return Number.isNaN(data.getTime()) ? null : data;
  }

  function dentroDoPeriodo(dataStr, inicio, fim) {
    if (!inicio && !fim) return true;

    const data = normalizarDataBrOuDate(dataStr);
    if (!data) return false;

    if (inicio) {
      const dInicio = new Date(`${inicio}T00:00:00`);
      if (data < dInicio) return false;
    }

    if (fim) {
      const dFim = new Date(`${fim}T23:59:59`);
      if (data > dFim) return false;
    }

    return true;
  }

  const historicoQuinzenasFiltrado = useMemo(() => {
    return historicoQuinzenas.filter((q) =>
      dentroDoPeriodo(q.dataCriacao, dataInicialCota, dataFinalCota)
    );
  }, [historicoQuinzenas, dataInicialCota, dataFinalCota]);

  const registrosDaSelecionada = useMemo(() => {
    if (!quinzenaSelecionada) return [];
    return registrosQuinzenas.filter((item) => item.quinzenaId === quinzenaSelecionada.id);
  }, [registrosQuinzenas, quinzenaSelecionada]);

  const movimentacoesFiltradas = useMemo(() => {
    return movimentacoes.filter((item) =>
      dentroDoPeriodo(item.data, dataInicialMov, dataFinalMov)
    );
  }, [movimentacoes, dataInicialMov, dataFinalMov]);

  const totalEntradasPeriodo = movimentacoesFiltradas
    .filter((item) => item.tipo === "Entrada")
    .reduce((acc, item) => acc + Number(item.valor), 0);

  const totalSaidasPeriodo = movimentacoesFiltradas
    .filter((item) => item.tipo === "Saída")
    .reduce((acc, item) => acc + Number(item.valor), 0);

  const saldoPeriodo = totalEntradasPeriodo - totalSaidasPeriodo;

  const totalEntradas = useMemo(() => {
    return movimentacoes
      .filter((item) => item.tipo === "Entrada")
      .reduce((acc, item) => acc + Number(item.valor), 0);
  }, [movimentacoes]);

  const totalSaidas = useMemo(() => {
    return movimentacoes
      .filter((item) => item.tipo === "Saída")
      .reduce((acc, item) => acc + Number(item.valor), 0);
  }, [movimentacoes]);

  const adicionarMovimentacao = () => {
    if (!descricao || !valor) {
      alert("Preencha descrição e valor.");
      return;
    }

    onAdicionarMovimentacao({
      tipo,
      descricao,
      categoria,
      valor,
      formaPagamento,
      evento,
    });

    setTipo("Saída");
    setDescricao("");
    setCategoria("Evento");
    setValor("");
    setFormaPagamento("Pix");
    setEvento("Páscoa");
  };

  const abrirHistorico = () => {
    setPopupHistoricoAberto(true);
    if (!quinzenaSelecionadaId && historicoQuinzenas.length) {
      setQuinzenaSelecionadaId(historicoQuinzenas[historicoQuinzenas.length - 1].id);
    }
  };

  const abrirMovimentacoes = () => {
    setPopupMovAberto(true);
  };

  const fecharHistorico = () => setPopupHistoricoAberto(false);
  const fecharMovimentacoes = () => {
    setPopupMovAberto(false);
    cancelarEdicao();
  };

  const abrirEdicao = (item) => {
    setEditandoId(item.id);
    setEditDescricao(item.descricao);
    setEditValor(String(item.valor));
    setEditCategoria(item.categoria);
    setEditFormaPagamento(item.formaPagamento);
    setEditEvento(item.evento);
    setEditTipo(item.tipo);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditDescricao("");
    setEditValor("");
    setEditCategoria("");
    setEditFormaPagamento("");
    setEditEvento("");
    setEditTipo("Entrada");
  };

  const salvarEdicao = () => {
    if (!editDescricao || !editValor) {
      alert("Preencha descrição e valor.");
      return;
    }

    setMovimentacoes((prev) =>
      prev.map((item) =>
        item.id === editandoId
          ? {
              ...item,
              descricao: editDescricao,
              valor: Number(editValor),
              categoria: editCategoria,
              formaPagamento: editFormaPagamento,
              evento: editEvento,
              tipo: editTipo,
            }
          : item
      )
    );

    cancelarEdicao();
  };

  const apagarMovimentacao = (id) => {
    const confirmar = window.confirm("Tem certeza que deseja apagar esta movimentação?");
    if (!confirmar) return;

    setMovimentacoes((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h1 style={styles.titulo}>Lançamento</h1>
      <p style={styles.subtitulo}>
        Área de lançamentos e visualização da {quinzenaAtual?.nome || "cota atual"}.
      </p>

      <div style={styles.topButtons}>
        <button style={styles.botaoRoxo} onClick={abrirHistorico}>
          Histórico de Quinzena
        </button>

        <button style={styles.botaoAzul} onClick={abrirMovimentacoes}>
          Histórico de Movimentações
        </button>
      </div>

      <div style={styles.cotaAtualBox}>
        <strong>Cota atual:</strong> {quinzenaAtual?.nome || "-"}
      </div>

      <div style={styles.cardsResumo}>
        <div style={styles.cardResumo}>
          <span>Total de entradas</span>
          <strong style={{ color: "#22c55e" }}>
            R$ {totalEntradas.toFixed(2)}
          </strong>
        </div>

        <div style={styles.cardResumo}>
          <span>Total de saídas</span>
          <strong style={{ color: "#ef4444" }}>
            R$ {totalSaidas.toFixed(2)}
          </strong>
        </div>
      </div>

      <div style={styles.layout}>
        <div style={styles.box}>
          <h2>Adicionar movimentação</h2>

          <div style={styles.campo}>
            <label>Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={styles.input}>
              <option value="Entrada">Entrada</option>
              <option value="Saída">Saída</option>
            </select>
          </div>

          <div style={styles.campo}>
            <label>Descrição</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: apoio, transporte, mesa..."
              style={styles.input}
            />
          </div>

          <div style={styles.campo}>
            <label>Categoria</label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.campo}>
            <label>Valor</label>
            <input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0.00"
              style={styles.input}
            />
          </div>

          <div style={styles.campo}>
            <label>Forma de pagamento</label>
            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
              style={styles.input}
            >
              <option value="Pix">Pix</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Cartão de Débito">Cartão de Débito</option>
            </select>
          </div>

          <div style={styles.campo}>
            <label>Evento</label>
            <select value={evento} onChange={(e) => setEvento(e.target.value)} style={styles.input}>
              <option value="Páscoa">Páscoa</option>
              <option value="São João">São João</option>
              <option value="Expo">Expo</option>
              <option value="Feira">Feira</option>
            </select>
          </div>

          <button
            style={tipo === "Entrada" ? styles.botaoVerde : styles.botaoVermelho}
            onClick={adicionarMovimentacao}
          >
            Adicionar {tipo}
          </button>
        </div>

        <div style={styles.box}>
          <h2>Resumo dos alunos</h2>

          <div style={styles.resumoStatus}>
            <div style={styles.statusMiniCard}>
              <span>Pagos</span>
              <strong style={{ color: "#22c55e" }}>{pagosAtual.length}</strong>
            </div>
            <div style={styles.statusMiniCard}>
              <span>Aguardando</span>
              <strong style={{ color: "#f59e0b" }}>{aguardandoAtual.length}</strong>
            </div>
            <div style={styles.statusMiniCard}>
              <span>Atrasados</span>
              <strong style={{ color: "#ef4444" }}>{atrasadosAtual.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {popupHistoricoAberto && (
        <div style={styles.overlay} onClick={fecharHistorico}>
          <div style={styles.popupGrande} onClick={(e) => e.stopPropagation()}>
            <div style={styles.popupHeader}>
              <h2>Histórico de Quinzena</h2>
              <button style={styles.fecharBtn} onClick={fecharHistorico}>
                X
              </button>
            </div>

            <div style={styles.filtrosLinha}>
              <div style={styles.campo}>
                <label>Data inicial</label>
                <input
                  type="date"
                  value={dataInicialCota}
                  onChange={(e) => setDataInicialCota(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.campo}>
                <label>Data final</label>
                <input
                  type="date"
                  value={dataFinalCota}
                  onChange={(e) => setDataFinalCota(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.historicoLayout}>
              <div style={styles.listaQuinzenas}>
                {historicoQuinzenasFiltrado.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setQuinzenaSelecionadaId(q.id)}
                    style={
                      quinzenaSelecionadaId === q.id
                        ? styles.quinzenaBtnAtivo
                        : styles.quinzenaBtn
                    }
                  >
                    {q.nome}
                  </button>
                ))}
              </div>

              <div style={styles.detalheQuinzena}>
                {quinzenaSelecionada ? (
                  <>
                    <h3>{quinzenaSelecionada.nome}</h3>
                    <p style={styles.textoPequeno}>
                      Criada em: {quinzenaSelecionada.dataCriacao}
                    </p>

                    <div style={styles.popupLista}>
                      {registrosDaSelecionada.map((item) => (
                        <div key={item.id} style={styles.popupItem}>
                          <div>
                            <strong>{item.nome}</strong>
                            <p style={styles.textoPequeno}>{item.turma}</p>
                          </div>
                          <span>{item.status}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p style={styles.vazio}>Selecione uma quinzena.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {popupMovAberto && (
        <div style={styles.overlay} onClick={fecharMovimentacoes}>
          <div style={styles.popupGrande} onClick={(e) => e.stopPropagation()}>
            <div style={styles.popupHeader}>
              <h2>Histórico de Movimentações</h2>
              <button style={styles.fecharBtn} onClick={fecharMovimentacoes}>
                X
              </button>
            </div>

            <div style={styles.filtrosLinha}>
              <div style={styles.campo}>
                <label>Data inicial</label>
                <input
                  type="date"
                  value={dataInicialMov}
                  onChange={(e) => setDataInicialMov(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.campo}>
                <label>Data final</label>
                <input
                  type="date"
                  value={dataFinalMov}
                  onChange={(e) => setDataFinalMov(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.cardsResumo}>
              <div style={styles.cardResumo}>
                <span>Entradas no período</span>
                <strong style={{ color: "#22c55e" }}>
                  R$ {totalEntradasPeriodo.toFixed(2)}
                </strong>
              </div>

              <div style={styles.cardResumo}>
                <span>Saídas no período</span>
                <strong style={{ color: "#ef4444" }}>
                  R$ {totalSaidasPeriodo.toFixed(2)}
                </strong>
              </div>

              <div style={styles.cardResumo}>
                <span>Saldo do período</span>
                <strong style={{ color: saldoPeriodo >= 0 ? "#38bdf8" : "#ef4444" }}>
                  R$ {saldoPeriodo.toFixed(2)}
                </strong>
              </div>
            </div>

            <div style={styles.popupLista}>
              {movimentacoesFiltradas.map((item) => (
                <div key={item.id} style={styles.itemMov}>
                  {editandoId === item.id ? (
                    <div style={styles.editArea}>
                      <div style={styles.campo}>
                        <label>Tipo</label>
                        <select value={editTipo} onChange={(e) => setEditTipo(e.target.value)} style={styles.input}>
                          <option value="Entrada">Entrada</option>
                          <option value="Saída">Saída</option>
                        </select>
                      </div>

                      <div style={styles.campo}>
                        <label>Descrição</label>
                        <input
                          type="text"
                          value={editDescricao}
                          onChange={(e) => setEditDescricao(e.target.value)}
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.campo}>
                        <label>Categoria</label>
                        <input
                          type="text"
                          value={editCategoria}
                          onChange={(e) => setEditCategoria(e.target.value)}
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.campo}>
                        <label>Valor</label>
                        <input
                          type="number"
                          value={editValor}
                          onChange={(e) => setEditValor(e.target.value)}
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.campo}>
                        <label>Forma de pagamento</label>
                        <input
                          type="text"
                          value={editFormaPagamento}
                          onChange={(e) => setEditFormaPagamento(e.target.value)}
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.campo}>
                        <label>Evento</label>
                        <input
                          type="text"
                          value={editEvento}
                          onChange={(e) => setEditEvento(e.target.value)}
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.botoesEdit}>
                        <button style={styles.botaoVerde} onClick={salvarEdicao}>
                          Salvar
                        </button>
                        <button style={styles.botaoCinza} onClick={cancelarEdicao}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <strong>{item.descricao}</strong>
                        <p style={styles.textoPequeno}>
                          {item.tipo} • {item.categoria} • {item.formaPagamento}
                        </p>
                        <p style={styles.textoPequeno}>
                          {item.evento} • {item.data}
                        </p>
                      </div>

                      <div style={styles.acoesMov}>
                        <strong
                          style={{
                            color: item.tipo === "Entrada" ? "#22c55e" : "#ef4444",
                          }}
                        >
                          {item.tipo === "Entrada" ? "+" : "-"} R$ {Number(item.valor).toFixed(2)}
                        </strong>

                        <button style={styles.botaoEditar} onClick={() => abrirEdicao(item)}>
                          Editar
                        </button>

                        <button style={styles.botaoApagar} onClick={() => apagarMovimentacao(item.id)}>
                          Apagar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {movimentacoesFiltradas.length === 0 && (
                <p style={styles.vazio}>Nenhuma movimentação encontrada no período.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  titulo: { fontSize: 32, marginBottom: 8 },
  subtitulo: { color: "#94a3b8", marginBottom: 20 },
  topButtons: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  botaoAzul: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  botaoRoxo: {
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  cotaAtualBox: {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  cardsResumo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginBottom: 20,
  },
  cardResumo: {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: 18,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    fontSize: 18,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginBottom: 20,
  },
  box: {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: 20,
    padding: 20,
  },
  campo: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 14,
    flex: 1,
  },
  input: {
    background: "#0f172a",
    color: "#fff",
    border: "1px solid #334155",
    borderRadius: 12,
    padding: 12,
  },
  botaoVermelho: {
    width: "100%",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: 14,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 16,
  },
  botaoVerde: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  botaoCinza: {
    background: "#475569",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  resumoStatus: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
  },
  statusMiniCard: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 14,
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    padding: 20,
  },
  popupGrande: {
    width: "100%",
    maxWidth: 1000,
    maxHeight: "85vh",
    overflowY: "auto",
    background: "#111827",
    border: "1px solid #334155",
    borderRadius: 22,
    padding: 20,
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
  },
  popupHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    gap: 12,
  },
  fecharBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  filtrosLinha: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 20,
  },
  historicoLayout: {
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    gap: 20,
  },
  listaQuinzenas: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  quinzenaBtn: {
    background: "#1f2937",
    color: "#fff",
    border: "1px solid #334155",
    borderRadius: 12,
    padding: "12px",
    cursor: "pointer",
    textAlign: "left",
    fontWeight: "bold",
  },
  quinzenaBtnAtivo: {
    background: "#2563eb",
    color: "#fff",
    border: "1px solid #2563eb",
    borderRadius: 12,
    padding: "12px",
    cursor: "pointer",
    textAlign: "left",
    fontWeight: "bold",
  },
  detalheQuinzena: {
    background: "#0f172a",
    borderRadius: 16,
    padding: 16,
  },
  popupLista: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 16,
  },
  popupItem: {
    background: "#1f2937",
    borderRadius: 12,
    padding: 12,
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
  },
  itemMov: {
    background: "#1f2937",
    borderRadius: 14,
    padding: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  acoesMov: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  botaoEditar: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  botaoApagar: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  editArea: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
  },
  botoesEdit: {
    gridColumn: "1 / -1",
    display: "flex",
    gap: 10,
  },
  textoPequeno: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 4,
  },
  vazio: {
    color: "#94a3b8",
  },
};

export default Lancamento;