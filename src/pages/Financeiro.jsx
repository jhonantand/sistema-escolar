import { useMemo, useState } from "react";

function Financeiro({ movimentacoes, quinzenaAtual, registrosQuinzenaAtual }) {
  const [popupAberto, setPopupAberto] = useState(null);

  const metaCota = useMemo(() => {
    return registrosQuinzenaAtual.length * 10;
  }, [registrosQuinzenaAtual]);

  const arrecadados = useMemo(() => {
    return registrosQuinzenaAtual.filter((item) => item.status === "pago");
  }, [registrosQuinzenaAtual]);

  const aguardando = useMemo(() => {
    return registrosQuinzenaAtual.filter((item) => item.status === "aguardando");
  }, [registrosQuinzenaAtual]);

  const atrasados = useMemo(() => {
    return registrosQuinzenaAtual.filter((item) => item.status === "atrasado");
  }, [registrosQuinzenaAtual]);

  const arrecadadoCota = useMemo(() => {
    return arrecadados.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  }, [arrecadados]);

  const faltaArrecadar = Math.max(metaCota - arrecadadoCota, 0);

  const entradasExtrasLista = useMemo(() => {
    return movimentacoes.filter((item) => item.tipo === "Entrada");
  }, [movimentacoes]);

  const gastosLista = useMemo(() => {
    return movimentacoes.filter((item) => item.tipo === "Saída");
  }, [movimentacoes]);

  const entradasExtras = useMemo(() => {
    return entradasExtrasLista.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  }, [entradasExtrasLista]);

  const gastos = useMemo(() => {
    return gastosLista.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  }, [gastosLista]);

  const saldoAtual = arrecadadoCota + entradasExtras - gastos;

  const percentualMeta =
    metaCota > 0 ? Math.min((arrecadadoCota / metaCota) * 100, 100) : 0;

  const totalAlunos = registrosQuinzenaAtual.length || 1;
  const percPagos = (arrecadados.length / totalAlunos) * 100;
  const percAguardando = (aguardando.length / totalAlunos) * 100;
  const percAtrasados = (atrasados.length / totalAlunos) * 100;

  const pizzaStyle = {
    background: `conic-gradient(
      #22c55e 0% ${percPagos}%,
      #f59e0b ${percPagos}% ${percPagos + percAguardando}%,
      #ef4444 ${percPagos + percAguardando}% 100%
    )`,
  };

  const popupConteudo = () => {
    if (popupAberto === "meta") {
      return {
        titulo: "Meta da cota",
        conteudo: (
          <div style={styles.popupLista}>
            <div style={styles.itemLista}>
              <span>Total de alunos</span>
              <strong>{registrosQuinzenaAtual.length}</strong>
            </div>
            <div style={styles.itemLista}>
              <span>Valor por aluno</span>
              <strong>R$ 10,00</strong>
            </div>
            <div style={styles.itemLista}>
              <span>Meta total</span>
              <strong>R$ {metaCota.toFixed(2)}</strong>
            </div>
          </div>
        ),
      };
    }

    if (popupAberto === "arrecadado") {
      return {
        titulo: "Alunos que pagaram",
        conteudo: (
          <div style={styles.popupLista}>
            {arrecadados.map((item, index) => (
              <div key={index} style={styles.itemLista}>
                <div>
                  <strong>{item.nome}</strong>
                  <p style={styles.textoPequeno}>{item.turma}</p>
                </div>
                <strong style={{ color: "#22c55e" }}>
                  R$ {Number(item.valor || 0).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>
        ),
      };
    }

    if (popupAberto === "falta") {
      const lista = [...aguardando, ...atrasados];
      return {
        titulo: "Quem ainda falta pagar",
        conteudo: (
          <div style={styles.popupLista}>
            {lista.map((item, index) => (
              <div key={index} style={styles.itemLista}>
                <div>
                  <strong>{item.nome}</strong>
                  <p style={styles.textoPequeno}>{item.turma}</p>
                </div>
                <strong
                  style={{
                    color: item.status === "atrasado" ? "#ef4444" : "#f59e0b",
                  }}
                >
                  {item.status}
                </strong>
              </div>
            ))}
          </div>
        ),
      };
    }

    if (popupAberto === "entradas") {
      return {
        titulo: "Entradas extras",
        conteudo: (
          <div style={styles.popupLista}>
            {entradasExtrasLista.map((item) => (
              <div key={item.id} style={styles.itemLista}>
                <div>
                  <strong>{item.descricao}</strong>
                  <p style={styles.textoPequeno}>
                    {item.categoria} • {item.formaPagamento}
                  </p>
                </div>
                <strong style={{ color: "#38bdf8" }}>
                  R$ {Number(item.valor).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>
        ),
      };
    }

    if (popupAberto === "gastos") {
      return {
        titulo: "Gastos",
        conteudo: (
          <div style={styles.popupLista}>
            {gastosLista.map((item) => (
              <div key={item.id} style={styles.itemLista}>
                <div>
                  <strong>{item.descricao}</strong>
                  <p style={styles.textoPequeno}>
                    {item.categoria} • {item.formaPagamento}
                  </p>
                </div>
                <strong style={{ color: "#ef4444" }}>
                  R$ {Number(item.valor).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>
        ),
      };
    }

    if (popupAberto === "saldo") {
      return {
        titulo: "Resumo do saldo",
        conteudo: (
          <div style={styles.popupLista}>
            <div style={styles.itemLista}>
              <span>Arrecadado da cota</span>
              <strong style={{ color: "#22c55e" }}>
                R$ {arrecadadoCota.toFixed(2)}
              </strong>
            </div>
            <div style={styles.itemLista}>
              <span>Entradas extras</span>
              <strong style={{ color: "#38bdf8" }}>
                R$ {entradasExtras.toFixed(2)}
              </strong>
            </div>
            <div style={styles.itemLista}>
              <span>Gastos</span>
              <strong style={{ color: "#ef4444" }}>
                R$ {gastos.toFixed(2)}
              </strong>
            </div>
            <div style={styles.itemLista}>
              <span>Saldo atual</span>
              <strong style={{ color: saldoAtual >= 0 ? "#22c55e" : "#ef4444" }}>
                R$ {saldoAtual.toFixed(2)}
              </strong>
            </div>
          </div>
        ),
      };
    }

    return { titulo: "", conteudo: null };
  };

  const popup = popupConteudo();

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.titulo}>Prestação de Contas</h1>
          <p style={styles.subtitulo}>
            Resumo financeiro da {quinzenaAtual?.nome || "cota atual"}
          </p>
        </div>
      </div>

      <div style={styles.gridCards}>
        <Card
          titulo="Meta da cota"
          valor={`R$ ${metaCota.toFixed(2)}`}
          info="Clique para detalhes"
          onClick={() => setPopupAberto("meta")}
        />

        <Card
          titulo="Arrecadado"
          valor={`R$ ${arrecadadoCota.toFixed(2)}`}
          cor="#22c55e"
          info={`${percentualMeta.toFixed(1)}% da meta`}
          onClick={() => setPopupAberto("arrecadado")}
        />

        <Card
          titulo="Falta arrecadar"
          valor={`R$ ${faltaArrecadar.toFixed(2)}`}
          cor="#f59e0b"
          info="Ver alunos pendentes"
          onClick={() => setPopupAberto("falta")}
        />

        <Card
          titulo="Entradas extras"
          valor={`R$ ${entradasExtras.toFixed(2)}`}
          cor="#38bdf8"
          info="Eventos e outras entradas"
          onClick={() => setPopupAberto("entradas")}
        />

        <Card
          titulo="Gastos"
          valor={`R$ ${gastos.toFixed(2)}`}
          cor="#ef4444"
          info="Saídas registradas"
          onClick={() => setPopupAberto("gastos")}
        />

        <Card
          titulo="Saldo atual"
          valor={`R$ ${saldoAtual.toFixed(2)}`}
          cor={saldoAtual >= 0 ? "#22c55e" : "#ef4444"}
          info="Resumo geral"
          onClick={() => setPopupAberto("saldo")}
        />
      </div>

      <div style={styles.gridBaixo}>
        <div style={styles.box}>
          <h2 style={styles.boxTitle}>Desempenho da arrecadação</h2>

          <div style={styles.barraFundo}>
            <div
              style={{
                ...styles.barraInterna,
                width: `${percentualMeta}%`,
              }}
            />
          </div>

          <p style={styles.metaTexto}>
            {percentualMeta.toFixed(1)}% da meta alcançada
          </p>

          <div style={styles.resumoGrid}>
            <ResumoCard titulo="Pagos" valor={arrecadados.length} cor="#22c55e" />
            <ResumoCard titulo="Aguardando" valor={aguardando.length} cor="#f59e0b" />
            <ResumoCard titulo="Atrasados" valor={atrasados.length} cor="#ef4444" />
          </div>
        </div>

        <div style={styles.box}>
          <h2 style={styles.boxTitle}>Situação dos alunos</h2>

          <div style={styles.pizzaArea}>
            <div
              style={{ ...styles.pizza, ...pizzaStyle }}
              onClick={() => setPopupAberto("falta")}
            >
              <div style={styles.pizzaCentro}>
                <strong>{registrosQuinzenaAtual.length}</strong>
                <span style={styles.textoPequeno}>alunos</span>
              </div>
            </div>

            <div style={styles.legenda}>
              <Legenda cor="#22c55e" texto={`Pagos: ${arrecadados.length}`} />
              <Legenda cor="#f59e0b" texto={`Aguardando: ${aguardando.length}`} />
              <Legenda cor="#ef4444" texto={`Atrasados: ${atrasados.length}`} />
            </div>
          </div>
        </div>
      </div>

      {popupAberto && (
        <div style={styles.overlay} onClick={() => setPopupAberto(null)}>
          <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
            <div style={styles.popupHeader}>
              <h2 style={{ margin: 0 }}>{popup.titulo}</h2>
              <button style={styles.fecharBtn} onClick={() => setPopupAberto(null)}>
                X
              </button>
            </div>

            {popup.conteudo}
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ titulo, valor, cor = "#fff", info, onClick }) {
  return (
    <div style={styles.card} onClick={onClick}>
      <span style={styles.cardTitulo}>{titulo}</span>
      <strong style={{ ...styles.cardValor, color: cor }}>{valor}</strong>
      <small style={styles.cardInfo}>{info}</small>
    </div>
  );
}

function ResumoCard({ titulo, valor, cor }) {
  return (
    <div style={styles.resumoCard}>
      <span style={styles.resumoTitulo}>{titulo}</span>
      <strong style={{ ...styles.resumoValor, color: cor }}>{valor}</strong>
    </div>
  );
}

function Legenda({ cor, texto }) {
  return (
    <div style={styles.legendaItem}>
      <span style={{ ...styles.legendaCor, background: cor }} />
      <span>{texto}</span>
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: 22,
  },
  titulo: {
    fontSize: "34px",
    margin: 0,
    color: "#fff",
  },
  subtitulo: {
    color: "#94a3b8",
    marginTop: 8,
    marginBottom: 0,
  },
  gridCards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginBottom: 22,
  },
  card: {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "18px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
    cursor: "pointer",
  },
  cardTitulo: {
    color: "#cbd5e1",
    fontSize: "14px",
    fontWeight: "bold",
  },
  cardValor: {
    fontSize: "28px",
    fontWeight: "bold",
  },
  cardInfo: {
    color: "#94a3b8",
    fontSize: "12px",
  },
  gridBaixo: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
  },
  box: {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
  },
  boxTitle: {
    margin: 0,
    marginBottom: 16,
    fontSize: "22px",
    color: "#fff",
  },
  barraFundo: {
    width: "100%",
    height: 16,
    background: "#0f172a",
    borderRadius: 999,
    overflow: "hidden",
    border: "1px solid #334155",
  },
  barraInterna: {
    height: "100%",
    background: "linear-gradient(90deg, #2563eb, #38bdf8)",
    borderRadius: 999,
  },
  metaTexto: {
    color: "#cbd5e1",
    marginTop: 10,
    marginBottom: 18,
  },
  resumoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
  },
  resumoCard: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "14px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  resumoTitulo: {
    color: "#cbd5e1",
    fontSize: "14px",
  },
  resumoValor: {
    fontSize: "26px",
    fontWeight: "bold",
  },
  pizzaArea: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    flexWrap: "wrap",
  },
  pizza: {
    width: 210,
    height: 210,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  pizzaCentro: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    background: "#0f172a",
    border: "1px solid #334155",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },
  legenda: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  legendaItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#e5e7eb",
  },
  legendaCor: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    display: "inline-block",
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
  popup: {
    width: "100%",
    maxWidth: 760,
    maxHeight: "85vh",
    overflowY: "auto",
    background: "#111827",
    border: "1px solid #334155",
    borderRadius: "22px",
    padding: 20,
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
  },
  popupHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    gap: 12,
  },
  fecharBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  popupLista: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  itemLista: {
    background: "#1f2937",
    borderRadius: "12px",
    padding: 12,
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  textoPequeno: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 4,
  },
};

export default Financeiro;