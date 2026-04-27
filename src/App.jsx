import { useEffect, useMemo, useState } from "react";
import Login from "./pages/login";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Sala from "./pages/Sala";
import RM1 from "./pages/RM1";
import RM2 from "./pages/RM2";
import RT from "./pages/RT";
import OLI from "./pages/OLI";
import Vendas from "./pages/Vendas";
import Financeiro from "./pages/Financeiro";
import Lancamento from "./pages/Lancamento";

export default function App() {
  const [logado, setLogado] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState("home");
  const [menuAberto, setMenuAberto] = useState(false);

  const [movimentacoes, setMovimentacoes] = useState(() => {
    const dados = localStorage.getItem("movimentacoes");
    return dados
      ? JSON.parse(dados)
      : [
          {
            id: 1,
            tipo: "Saída",
            descricao: "Aluguel da mesa",
            categoria: "Evento",
            valor: 150,
            formaPagamento: "Pix",
            evento: "Páscoa",
            data: new Date().toLocaleString("pt-BR"),
          },
        ];
  });

  const [historicoQuinzenas, setHistoricoQuinzenas] = useState(() => {
    const dados = localStorage.getItem("historico_quinzenas");
    return dados
      ? JSON.parse(dados)
      : [
          {
            id: 1,
            nome: "Cota 1",
            ativa: true,
            valorCota: 10,
            dataCriacao: new Date().toLocaleString("pt-BR"),
          },
        ];
  });

  const [registrosQuinzenas, setRegistrosQuinzenas] = useState([]);

  useEffect(() => {
    localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
  }, [movimentacoes]);

  useEffect(() => {
    localStorage.setItem(
      "historico_quinzenas",
      JSON.stringify(historicoQuinzenas)
    );
  }, [historicoQuinzenas]);

  useEffect(() => {
    localStorage.setItem(
      "registros_quinzenas",
      JSON.stringify(registrosQuinzenas)
    );
  }, [registrosQuinzenas]);

  const quinzenaAtual = useMemo(() => {
    return (
      historicoQuinzenas.find((item) => item.ativa) ||
      historicoQuinzenas[0]
    );
  }, [historicoQuinzenas]);

  const adicionarVendaNoFinanceiro = (venda) => {
    const novaMovimentacao = {
      id: Date.now(),
      tipo: "Entrada",
      descricao: venda.descricao,
      categoria: "Venda",
      valor: Number(venda.valor),
      formaPagamento: venda.formaPagamento,
      evento: venda.evento,
      data: new Date().toLocaleString("pt-BR"),
    };

    setMovimentacoes((prev) => [novaMovimentacao, ...prev]);
    setPaginaAtual("lancamento");
  };

  const adicionarMovimentacao = (mov) => {
    const novaMovimentacao = {
      id: Date.now(),
      tipo: mov.tipo,
      descricao: mov.descricao,
      categoria: mov.categoria,
      valor: Number(mov.valor),
      formaPagamento: mov.formaPagamento,
      evento: mov.evento,
      data: new Date().toLocaleString("pt-BR"),
    };

    setMovimentacoes((prev) => [novaMovimentacao, ...prev]);
  };

  if (!logado) {
    return (
      <Login
        onLogin={() => {
          setLogado(true);
        }}
      />
    );
  }

  const renderizarPagina = () => {
    switch (paginaAtual) {
      case "home":
        return <Home />;

      case "sala":
        return <Sala setPaginaAtual={setPaginaAtual} />;

      case "rm1":
        return <RM1 />;

      case "rm2":
        return <RM2 />;

      case "rt":
        return <RT />;

      case "oli":
        return <OLI />;

      case "vendas":
        return <Vendas onFinalizarVenda={adicionarVendaNoFinanceiro} />;

      case "financeiro":
        return <Financeiro movimentacoes={movimentacoes} />;

      case "lancamento":
        return (
          <Lancamento
            movimentacoes={movimentacoes}
            onAdicionarMovimentacao={adicionarMovimentacao}
          />
        );

      default:
        return <Home />;
    }
  };

  return (
    <div style={styles.app}>
      <div style={styles.topbar}>
        <button
          style={styles.menuBtn}
          onClick={() => setMenuAberto(true)}
        >
          ☰
        </button>

        <h1 style={styles.topTitle}>Sistema</h1>
      </div>

      <Sidebar
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
        setPaginaAtual={setPaginaAtual}
        paginaAtual={paginaAtual}
        onLogout={() => {
          setLogado(false);
          setMenuAberto(false);
        }}
      />

      <div style={styles.conteudo}>{renderizarPagina()}</div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#fff",
  },
  topbar: {
    height: 70,
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "0 20px",
    borderBottom: "1px solid #1e293b",
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "#0f172a",
  },
  menuBtn: {
    background: "#111827",
    color: "#fff",
    border: "1px solid #1e293b",
    borderRadius: 12,
    width: 46,
    height: 46,
    cursor: "pointer",
    fontSize: 24,
  },
  topTitle: {
    margin: 0,
    fontSize: 24,
    color: "#38bdf8",
  },
  conteudo: {
    padding: "20px",
  },
};