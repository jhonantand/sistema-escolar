import { useEffect, useMemo, useState } from "react";

function Vendas({ onFinalizarVenda }) {
  const [produtos, setProdutos] = useState(() => {
    const salvos = localStorage.getItem("produtos_vendas");
    return salvos
      ? JSON.parse(salvos)
      : [
          {
            id: 1,
            nome: "Pastel",
            preco: 5,
            categoria: "Comida",
            foto: "https://via.placeholder.com/250x140?text=Pastel",
          },
          {
            id: 2,
            nome: "Coca-Cola",
            preco: 4,
            categoria: "Bebida",
            foto: "https://via.placeholder.com/250x140?text=Coca-Cola",
          },
          {
            id: 3,
            nome: "Bolo",
            preco: 6,
            categoria: "Doce",
            foto: "https://via.placeholder.com/250x140?text=Bolo",
          },
        ];
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoPreco, setNovoPreco] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("");
  const [novaFoto, setNovaFoto] = useState("");
  const [previewFoto, setPreviewFoto] = useState("");

  const [sacola, setSacola] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState("Pix");
  const [evento, setEvento] = useState("Páscoa");
  const [observacao, setObservacao] = useState("");

  useEffect(() => {
    localStorage.setItem("produtos_vendas", JSON.stringify(produtos));
  }, [produtos]);

  const adicionarNaSacola = (produto) => {
    setSacola((prev) => {
      const itemExistente = prev.find((item) => item.id === produto.id);

      if (itemExistente) {
        return prev.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...prev, { ...produto, quantidade: 1 }];
    });
  };

  const aumentarQuantidade = (id) => {
    setSacola((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    );
  };

  const diminuirQuantidade = (id) => {
    setSacola((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantidade: item.quantidade - 1 } : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

  const removerItem = (id) => {
    setSacola((prev) => prev.filter((item) => item.id !== id));
  };

  const total = useMemo(() => {
    return sacola.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  }, [sacola]);

  const totalItens = useMemo(() => {
    return sacola.reduce((acc, item) => acc + item.quantidade, 0);
  }, [sacola]);

  const finalizarVenda = () => {
    if (sacola.length === 0) {
      alert("Adicione produtos na sacola primeiro.");
      return;
    }

    const nomesProdutos = sacola
      .map((item) => `${item.nome} x${item.quantidade}`)
      .join(", ");

    onFinalizarVenda({
      descricao: observacao?.trim()
        ? observacao
        : `Venda realizada: ${nomesProdutos}`,
      valor: total,
      formaPagamento,
      evento,
    });

    setSacola([]);
    setFormaPagamento("Pix");
    setEvento("Páscoa");
    setObservacao("");
    alert("Venda finalizada com sucesso.");
  };

  const handleImagemUpload = (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNovaFoto(reader.result);
      setPreviewFoto(reader.result);
    };
    reader.readAsDataURL(arquivo);
  };

  const adicionarProduto = () => {
    if (!novoNome || !novoPreco || !novaCategoria) {
      alert("Preencha nome, preço e categoria.");
      return;
    }

    const novoProduto = {
      id: Date.now(),
      nome: novoNome,
      preco: Number(novoPreco),
      categoria: novaCategoria,
      foto: novaFoto || "https://via.placeholder.com/250x140?text=Produto",
    };

    setProdutos((prev) => [...prev, novoProduto]);

    setNovoNome("");
    setNovoPreco("");
    setNovaCategoria("");
    setNovaFoto("");
    setPreviewFoto("");
    setMostrarFormulario(false);

    alert("Produto adicionado com sucesso.");
  };

  return (
    <div>
      <h1 style={styles.titulo}>Vendas</h1>
      <p style={styles.subtitulo}>
        Cardápio, sacola e pagamento em uma única página.
      </p>

      <div style={styles.topoAcoes}>
        <button
          style={styles.botaoNovoProduto}
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? "Fechar" : "Adicionar produto"}
        </button>
      </div>

      {mostrarFormulario && (
        <div style={styles.box}>
          <h2>Novo produto</h2>

          <div style={styles.formGrid}>
            <div style={styles.campo}>
              <label>Nome do produto</label>
              <input
                type="text"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                placeholder="Ex: Brigadeiro"
                style={styles.input}
              />
            </div>

            <div style={styles.campo}>
              <label>Preço</label>
              <input
                type="number"
                value={novoPreco}
                onChange={(e) => setNovoPreco(e.target.value)}
                placeholder="Ex: 5"
                style={styles.input}
              />
            </div>

            <div style={styles.campo}>
              <label>Categoria</label>
              <input
                type="text"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                placeholder="Ex: Doce"
                style={styles.input}
              />
            </div>

            <div style={styles.campo}>
              <label>Foto do produto</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImagemUpload}
                style={styles.input}
              />
            </div>
          </div>

          {previewFoto && (
            <div style={styles.previewBox}>
              <p style={{ marginBottom: 8 }}>Prévia da foto</p>
              <img src={previewFoto} alt="Prévia" style={styles.previewImagem} />
            </div>
          )}

          <button style={styles.botaoSalvarProduto} onClick={adicionarProduto}>
            Salvar produto
          </button>
        </div>
      )}

      <div style={styles.layout}>
        <div style={styles.colunaEsquerda}>
          <div style={styles.box}>
            <h2>Cardápio</h2>
            <div style={styles.gridProdutos}>
              {produtos.map((produto) => (
                <div key={produto.id} style={styles.cardProduto}>
                  <img
                    src={produto.foto}
                    alt={produto.nome}
                    style={styles.imagemProduto}
                  />
                  <h3>{produto.nome}</h3>
                  <p>{produto.categoria}</p>
                  <strong>R$ {produto.preco.toFixed(2)}</strong>
                  <button
                    style={styles.botaoAzul}
                    onClick={() => adicionarNaSacola(produto)}
                  >
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.colunaDireita}>
          <div style={styles.box}>
            <h2>Sacola</h2>

            {sacola.length === 0 ? (
              <p style={{ color: "#94a3b8" }}>Nenhum item na sacola.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {sacola.map((item) => (
                  <div key={item.id} style={styles.itemSacola}>
                    <div>
                      <strong>{item.nome}</strong>
                      <p style={styles.textoPequeno}>
                        R$ {item.preco.toFixed(2)} cada
                      </p>
                    </div>

                    <div style={styles.controlesQuantidade}>
                      <button
                        style={styles.botaoControle}
                        onClick={() => diminuirQuantidade(item.id)}
                      >
                        -
                      </button>
                      <span>{item.quantidade}</span>
                      <button
                        style={styles.botaoControle}
                        onClick={() => aumentarQuantidade(item.id)}
                      >
                        +
                      </button>
                    </div>

                    <div>
                      <strong>
                        R$ {(item.preco * item.quantidade).toFixed(2)}
                      </strong>
                    </div>

                    <button
                      style={styles.botaoVermelho}
                      onClick={() => removerItem(item.id)}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.box}>
            <h2>Pagamento</h2>

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
              <select
                value={evento}
                onChange={(e) => setEvento(e.target.value)}
                style={styles.input}
              >
                <option value="Páscoa">Páscoa</option>
                <option value="São João">São João</option>
                <option value="Expo">Expo</option>
                <option value="Feira">Feira</option>
              </select>
            </div>

            <div style={styles.campo}>
              <label>Observação</label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex: venda da barraca principal"
                style={{ ...styles.input, minHeight: 80, resize: "none" }}
              />
            </div>

            <div style={styles.resumo}>
              <div style={styles.resumoLinha}>
                <span>Total de itens</span>
                <strong>{totalItens}</strong>
              </div>

              <div style={styles.resumoLinha}>
                <span>Total da venda</span>
                <strong style={{ fontSize: 24 }}>R$ {total.toFixed(2)}</strong>
              </div>
            </div>

            <button style={styles.botaoFinalizar} onClick={finalizarVenda}>
              Finalizar venda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  titulo: { fontSize: 32, marginBottom: 8 },
  subtitulo: { color: "#94a3b8", marginBottom: 20 },
  topoAcoes: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  botaoNovoProduto: {
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 15,
  },
  botaoSalvarProduto: {
    marginTop: 12,
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 15,
  },
  layout: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 },
  colunaEsquerda: { display: "flex", flexDirection: "column", gap: 20 },
  colunaDireita: { display: "flex", flexDirection: "column", gap: 20 },
  box: {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16,
    marginTop: 16,
  },
  gridProdutos: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
    marginTop: 16,
  },
  cardProduto: {
    background: "#1f2937",
    borderRadius: 16,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  imagemProduto: {
    width: "100%",
    height: 140,
    objectFit: "cover",
    borderRadius: 12,
  },
  previewBox: {
    marginTop: 16,
    background: "#1f2937",
    padding: 12,
    borderRadius: 12,
  },
  previewImagem: {
    width: 220,
    height: 140,
    objectFit: "cover",
    borderRadius: 12,
  },
  botaoAzul: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  itemSacola: {
    background: "#1f2937",
    borderRadius: 14,
    padding: 14,
    display: "grid",
    gridTemplateColumns: "1.2fr auto auto auto",
    gap: 12,
    alignItems: "center",
  },
  controlesQuantidade: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  botaoControle: {
    background: "#334155",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    width: 30,
    height: 30,
    cursor: "pointer",
    fontWeight: "bold",
  },
  botaoVermelho: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  campo: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 14,
  },
  input: {
    background: "#0f172a",
    color: "#fff",
    border: "1px solid #334155",
    borderRadius: 12,
    padding: 12,
  },
  resumo: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    marginBottom: 16,
  },
  resumoLinha: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  botaoFinalizar: {
    width: "100%",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: 14,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 16,
  },
  textoPequeno: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 4,
  },
};

export default Vendas;