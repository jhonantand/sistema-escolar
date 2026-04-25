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

function App() {
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

  const [alunosBase] = useState(() => {
    return [
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
      { id: 11, nome: "Davi de Souza Bezerra", turma: "RM1" },
      { id: 12, nome: "Davi Henrique de Oliveira Facundo", turma: "RM1" },
      { id: 13, nome: "Elisa Nicoly Saldanha Sousa", turma: "RM1" },
      { id: 14, nome: "Gabriel Mendes Lopes", turma: "RM1" },
      { id: 15, nome: "Gisely Sobrinho Silva", turma: "RM1" },
      { id: 16, nome: "Heytor Araújo de Souza Oliveira", turma: "RM1" },
      { id: 17, nome: "Isabelly da Silva Germano", turma: "RM1" },
      { id: 18, nome: "Jhonantan Dias da Cruz", turma: "RM1" },
      { id: 19, nome: "Joel Silva Mendes", turma: "RM1" },
      { id: 20, nome: "Joyce arrace novata", turma: "RM1" },
      { id: 21, nome: "Karoline Isabele Capistrano Silva", turma: "RM1" },
      { id: 22, nome: "Laura Joyce Sousa Brito", turma: "RM1" },
      { id: 23, nome: "Lorrana Drielly do Nascimento Barroso", turma: "RM1" },
      { id: 24, nome: "Luis Guilherme Felipe Blini", turma: "RM1" },
      { id: 25, nome: "Maria de Fátima Viana", turma: "RM1" },
      { id: 26, nome: "Maria Eliza Ponciano Berisha", turma: "RM1" },
      { id: 27, nome: "Maria Izabele Martins de Castro", turma: "RM1" },
      { id: 28, nome: "Melissa Colares Gamarano", turma: "RM1" },
      { id: 29, nome: "Maria Luiza Marques Accioly", turma: "RM1" },
      { id: 30, nome: "Mariane Firmino Pereira", turma: "RM1" },
      { id: 31, nome: "Moises Ferreira Souto", turma: "RM1" },
      { id: 32, nome: "Nicolle de Sousa Cabral", turma: "RM1" },
      { id: 33, nome: "Naylane Costa Barros", turma: "RM1" },
      { id: 34, nome: "Nicolly Amaro Holanda", turma: "RM1" },
      { id: 35, nome: "Nivia Rodrigues Nobre Menezes", turma: "RM1" },
      { id: 36, nome: "Pedro lucas Oliveira de Queiróz", turma: "RM1" },
      { id: 37, nome: "Petrus José da Costa Evangelista", turma: "RM1" },
      { id: 38, nome: "Riana Thaila Mota Lima", turma: "RM1" },
      { id: 39, nome: "Yasmin da Silva Gomes", turma: "RM1" },
      { id: 40, nome: "Yasmin Rodrigues Feitosa", turma: "RM1" },

      { id: 41, nome: "Amanda Bernardo Pessoa de Souza", turma: "RM2" },
      { id: 42, nome: "Ana Gabrielly Cavalcante de Souza", turma: "RM2" },
      { id: 43, nome: "Ana Isabelle Lima da Silva Gomes", turma: "RM2" },
      { id: 44, nome: "Ana Luiza Rodrigues de Amorim", turma: "RM2" },
      { id: 45, nome: "Antonio Benicio Santos Fonteles", turma: "RM2" },
      { id: 46, nome: "Davi Fernandes de Brito", turma: "RM2" },
      { id: 47, nome: "Eduardo Ribeiro Gomes Neto", turma: "RM2" },
      { id: 48, nome: "Francisco Lincoln de Oli. da Silva", turma: "RM2" },
      { id: 49, nome: "Franklin William de Castro Fujita", turma: "RM2" },
      { id: 50, nome: "Gabrielle Albuquerque Pinheiro", turma: "RM2" },
      { id: 51, nome: "Henry Freitas da Silva", turma: "RM2" },
      { id: 52, nome: "Igor Gabriel Fernandes Tavares", turma: "RM2" },
      { id: 53, nome: "Isabel Lima da Silva", turma: "RM2" },
      { id: 54, nome: "Isabelle Farias Cavalcante Castro", turma: "RM2" },
      { id: 55, nome: "Isabelly Ferreira Bentemiler", turma: "RM2" },
      { id: 56, nome: "Israel Cavalcante Rocha", turma: "RM2" },
      { id: 57, nome: "Ivina Souza de Matos", turma: "RM2" },
      { id: 58, nome: "Jamilli Lima Medeiros", turma: "RM2" },
      { id: 59, nome: "Jander Mourao Rodrigues Filho", turma: "RM2" },
      { id: 60, nome: "Joao Vinicius de Oliveira Reis", turma: "RM2" },
      { id: 61, nome: "Joao William Moreira Dias", turma: "RM2" },
      { id: 62, nome: "Josafa Menezes Cavalcante", turma: "RM2" },
      { id: 63, nome: "Jose Gabriel Marques Cosmo", turma: "RM2" },
      { id: 64, nome: "Jose Klebson Andrade dos Santos", turma: "RM2" },
      { id: 65, nome: "Katarine Piauilino Fogaca", turma: "RM2" },
      { id: 66, nome: "Lavinia de Sousa Sales Viana", turma: "RM2" },
      { id: 67, nome: "Maria Clara Moreira de Castro", turma: "RM2" },
      { id: 68, nome: "Maria Eduarda Uchoa Flor Silva", turma: "RM2" },
      { id: 69, nome: "Maria Jennifer Santana Cruz", turma: "RM2" },
      { id: 70, nome: "Maria Marleide Bernardo da Silva", turma: "RM2" },
      { id: 71, nome: "Maria Vitoria Campos da Silva", turma: "RM2" },
      { id: 72, nome: "Miguel Bispo Batista", turma: "RM2" },
      { id: 73, nome: "Mirella Silva Mendonca", turma: "RM2" },
      { id: 74, nome: "Nicolas Melo Albuquerque", turma: "RM2" },
      { id: 75, nome: "Pedro Igor Moreira Barroso", turma: "RM2" },
      { id: 76, nome: "Ramid de Araujo", turma: "RM2" },
      { id: 77, nome: "Renan Nogueira Vale", turma: "RM2" },
      { id: 78, nome: "Ricardo David Ribeiro D. Alb. Rebouças", turma: "RM2" },
      { id: 79, nome: "Samuel Moreira Fernandes Freitas", turma: "RM2" },
      { id: 80, nome: "Samuel Nata Sa Silva Estevao", turma: "RM2" },
      { id: 81, nome: "Wendelly Damasceno dos Santos", turma: "RM2" },
      { id: 82, nome: "William Oliveira Lima", turma: "RM2" },
      { id: 83, nome: "Thayson Brito", turma: "RM2" },

      { id: 84, nome: "Eduarda Tayane", turma: "RT" },
      { id: 85, nome: "Enzo Simões", turma: "RT" },
      { id: 86, nome: "Flavio Miguel", turma: "RT" },
      { id: 87, nome: "Isabella Valentina", turma: "RT" },
      { id: 88, nome: "Kalil Damasceno Rodrigues", turma: "RT" },
      { id: 89, nome: "Karolinny Soares", turma: "RT" },
      { id: 90, nome: "Kission Yarlei", turma: "RT" },
      { id: 91, nome: "Marcos Filho", turma: "RT" },
      { id: 92, nome: "Pedro Almeida Fernandes Neto", turma: "RT" },
      { id: 93, nome: "Phablo Daniel Lacerda", turma: "RT" },
      { id: 94, nome: "Rafael Silva", turma: "RT" },
      { id: 95, nome: "Rodrigo Brito", turma: "RT" },

      { id: 96, nome: "Ana Beatriz Severo De Sousa", turma: "OLI" },
      { id: 97, nome: "Ana Flavia Cavalcante Barreto", turma: "OLI" },
      { id: 98, nome: "Ana Kelly Barrozo Silva", turma: "OLI" },
      { id: 99, nome: "Anabelle Gomes Siqueira", turma: "OLI" },
      { id: 100, nome: "Anna Vitoria Martins Lima", turma: "OLI" },
      { id: 101, nome: "Arthur Alves Lacerda", turma: "OLI" },
      { id: 102, nome: "Arthur da Silva Moura dos Santos", turma: "OLI" },
      { id: 103, nome: "Arthur Brito Chayn", turma: "OLI" },
      { id: 104, nome: "Daniel Benevenuto Albuquerque", turma: "OLI" },
      { id: 105, nome: "Gabriela Cavalcante Rodrigues", turma: "OLI" },
      { id: 106, nome: "Gabriela Ricardo Da Silva", turma: "OLI" },
      { id: 107, nome: "Heloísa Oliveira Nunes Fiuza", turma: "OLI" },
      { id: 108, nome: "Hildegardo Nojosa de Freitas", turma: "OLI" },
      { id: 109, nome: "Isabelle Rianne Alves Soares", turma: "OLI" },
      { id: 110, nome: "João Nicolas dos Santos Uchôa", turma: "OLI" },
      { id: 111, nome: "João Paulo Santana Nascimento", turma: "OLI" },
      { id: 112, nome: "João Victor Mourão Venâncio", turma: "OLI" },
      { id: 113, nome: "João Vitor Arruda Holanda", turma: "OLI" },
      { id: 114, nome: "Karoline Cavalcante Gomes", turma: "OLI" },
      { id: 115, nome: "Kauã Enzo Lima Fernandes", turma: "OLI" },
      { id: 116, nome: "Laís Oliveira Gomes", turma: "OLI" },
      { id: 117, nome: "Lara Clarisse Teixeira Gomes", turma: "OLI" },
      { id: 118, nome: "Lucas José Gomes Pereira", turma: "OLI" },
      { id: 119, nome: "Luis Felipe Oliveira Lopes", turma: "OLI" },
      { id: 120, nome: "Luiz Guilherme Alcântara", turma: "OLI" },
      { id: 121, nome: "Luiza Ribeiro de Souza", turma: "OLI" },
      { id: 122, nome: "Maria Celeste de Menezes", turma: "OLI" },
      { id: 123, nome: "Maria Clara Uchoa Moita", turma: "OLI" },
      { id: 124, nome: "Marília Aguiar Moreira", turma: "OLI" },
      { id: 125, nome: "Matheus Freitas Texeira", turma: "OLI" },
      { id: 126, nome: "Mikaelly Ximenes do Prado", turma: "OLI" },
      { id: 127, nome: "Milena Rianne Loureiro Gomes", turma: "OLI" },
      { id: 128, nome: "Pedro Manoel Sousa Pinto", turma: "OLI" },
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
                novoStatus === "pago"
                  ? new Date().toLocaleString("pt-BR")
                  : "",
            }
          : item
      )
    );
  };

  const pegarRegistrosDaTurmaAtual = (turma) => {
    return registrosQuinzenaAtual.filter((item) => item.turma === turma);
  };

  if (!logado) {
    return (
      <Login
        onLoginSucesso={() => {
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
        return (
          <RM1
            quinzenaAtual={quinzenaAtual}
            registros={pegarRegistrosDaTurmaAtual("RM1")}
          />
        );

      case "rm2":
        return (
          <RM2
            quinzenaAtual={quinzenaAtual}
            registros={pegarRegistrosDaTurmaAtual("RM2")}
          />
        );

      case "rt":
        return (
          <RT
            quinzenaAtual={quinzenaAtual}
            registros={pegarRegistrosDaTurmaAtual("RT")}
          />
        );

      case "oli":
        return (
          <OLI
            quinzenaAtual={quinzenaAtual}
            registros={pegarRegistrosDaTurmaAtual("OLI")}
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

export default App;