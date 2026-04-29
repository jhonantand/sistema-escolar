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

const alunosBase = [
  { id: 1, nome: "adaiton  moreira da silva", turma: "RM1" },
  { id: 2, nome: "Amanda Aires Barbosa", turma: "RM1" },
  { id: 3, nome: "Amanda Emily de Oliveira Alencar", turma: "RM1" },
  { id: 4, nome: "Ana Licia Passos de Oliveira", turma: "RM1" },
  { id: 5, nome: "Anna Sophia dos Santos Rabelo", turma: "RM1" },
  { id: 6, nome: "anna clara  barbosa saraiva", turma: "RM1" },
  { id: 7, nome: "Antonio Alves da Silva Neto", turma: "RM1" },
  { id: 8, nome: "Bárbara Hellen Lima Saraiva", turma: "RM1" },
  { id: 9, nome: "Carolina Oliveira Moreira", turma: "RM1" },
  { id: 10, nome: "Daniel Luca Lemos Sales", turma: "RM1" },

  { id: 41, nome: "Amanda Bernardo Pessoa de Souza", turma: "RM2" },
  { id: 42, nome: "Ana Gabrielly Cavalcante de Souza", turma: "RM2" },
  { id: 43, nome: "Ana Isabelle Lima da Silva Gomes", turma: "RM2" },
  { id: 44, nome: "Ana Luiza Rodrigues de Amorim", turma: "RM2" },
  { id: 45, nome: "Antonio Benicio Santos Fonteles", turma: "RM2" },

  { id: 84, nome: "Eduarda Tayane", turma: "RT" },
  { id: 85, nome: "Enzo Simões", turma: "RT" },
  { id: 86, nome: "Flavio Miguel", turma: "RT" },
  { id: 87, nome: "Isabella Valentina", turma: "RT" },

  { id: 96, nome: "Ana Beatriz Severo De Sousa", turma: "OLI" },
  { id: 97, nome: "Ana Flavia Cavalcante Barreto", turma: "OLI" },
  { id: 98, nome: "Ana Kelly Barrozo Silva", turma: "OLI" },
  { id: 99, nome: "Anabelle Gomes Siqueira", turma: "OLI" },
];

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

  const [registrosQuinzenas, setRegistrosQuinzenas] = useState(() => {
    const dados = localStorage.getItem("registros_quinzenas");
    return dados
      ? JSON.parse(dados)
      : alunosBase.map((aluno, index) => ({
          id: index + 1,
          quinzenaId: 1,
          alunoId: aluno.id,
          nome: aluno.nome,
          turma: aluno.turma,
          status: "aguardando",
          valor: 10,
          dataPagamento: "",
        }));
  });

  useEffect(() => {
    localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
  }, [movimentacoes]);

  useEffect(() => {
    localStorage.setItem("historico_quinzenas", JSON.stringify(historicoQuinzenas));
  }, [historicoQuinzenas]);

  useEffect(() => {
    localStorage.setItem("registros_quinzenas", JSON.stringify(registrosQuinzenas));
  }, [registrosQuinzenas]);

  const quinzenaAtual = useMemo(() => {
    return historicoQuinzenas.find((item) => item.ativa) || historicoQuinzenas[0];
  }, [historicoQuinzenas]);

  const registrosQuinzenaAtual = useMemo(() => {
    if (!quinzenaAtual) return [];
    return registrosQuinzenas.filter((item) => item.quinzenaId === quinzenaAtual.id);
  }, [registrosQuinzenas, quinzenaAtual]);

  const pegarRegistrosDaTurmaAtual = (turma) => {
    return registrosQuinzenaAtual.filter((item) => item.turma === turma);
  };

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

  const marcarStatusAluno = (registroId, novoStatus) => {
    setRegistrosQuinzenas((prev) =>
      prev.map((item) =>
        item.id === registroId
          ? {
              ...item,
              status: novoStatus,
              dataPagamento:
                novoStatus === "pago" ? new Date().toLocaleString("pt-BR") : "",
            }
          : item
      )
    );
  };

  if (!logado) {
    return <Login onLogin={() => setLogado(true)} />;
  }

  const renderizarPagina = () => {
    switch (paginaAtual) {
      case "home":
        return <Home />;

      case "sala":
        return <Sala setPaginaAtual={setPaginaAtual} />;

      case "rm1":
        return (
          <RM1
            quinzenaAtual={quinzenaAtual}
            registros={pegarRegistrosDaTurmaAtual("RM1")}
            onMarcarStatusAluno={marcarStatusAluno}
          />
        );

      case "rm2":
        return (
          <RM2
            quinzenaAtual={quinzenaAtual}
            registros={pegarRegistrosDaTurmaAtual("RM2")}
            onMarcarStatusAluno={marcarStatusAluno}
          />
        );

      case "rt":
        return (
          <RT
            quinzenaAtual={quinzenaAtual}
            registros={pegarRegistrosDaTurmaAtual("RT")}
            onMarcarStatusAluno={marcarStatusAluno}
          />
        );

      case "oli":
        return (
          <OLI
            quinzenaAtual={quinzenaAtual}
            registros={pegarRegistrosDaTurmaAtual("OLI")}
            onMarcarStatusAluno={marcarStatusAluno}
          />
        );

      case "vendas":
        return <Vendas onFinalizarVenda={adicionarVendaNoFinanceiro} />;

      case "financeiro":
        return (
          <Financeiro
            movimentacoes={movimentacoes}
            quinzenaAtual={quinzenaAtual}
            registrosQuinzenaAtual={registrosQuinzenaAtual}
          />
        );

      case "lancamento":
        return (
          <Lancamento
            movimentacoes={movimentacoes}
            onAdicionarMovimentacao={adicionarMovimentacao}
            quinzenaAtual={quinzenaAtual}
            historicoQuinzenas={historicoQuinzenas}
            registrosQuinzenas={registrosQuinzenas}
            onMarcarStatusAluno={marcarStatusAluno}
            setMovimentacoes={setMovimentacoes}
          />
        );

      default:
        return <Home />;
    }
  };

  return (
    <div style={styles.app}>
      <div style={styles.topbar}>
        <button style={styles.menuBtn} onClick={() => setMenuAberto(true)}>
          ☰
        </button>

        <h1 style={styles.topTitle}>Sistema Escolar</h1>
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