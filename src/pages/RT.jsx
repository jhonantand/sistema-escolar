import { useEffect, useState } from "react";

const STORAGE_KEY = "rt_dados";
const STORAGE_VENCIMENTO_KEY = "rt_vencimento_geral";
const STORAGE_COTA_KEY = "rt_cota";

const alunosRTBase = [
  "Eduarda Tayane",
  "Enzo Simões",
  "Flavio Miguel",
  "Isabella Valentina",
  "Kalil Damasceno Rodrigues",
  "Karolinny Soares",
  "Kission Yarlei",
  "Marcos Filho",
  "Pedro Almeida Fernandes Neto",
  "Phablo Daniel Lacerda",
  "Rafael Silva",
  "Rodrigo Brito",
];

function criarListaInicial() {
  return alunosRTBase.map((nome) => ({
    nome,
    valor: "",
    cota: "",
    dataPagamento: "",
    vencimento: "",
    situacao: "Aguardando",
    observacao: "",
  }));
}

function carregarAlunos() {
  const dadosSalvos = localStorage.getItem(STORAGE_KEY);
  if (dadosSalvos) return JSON.parse(dadosSalvos);
  return criarListaInicial();
}

function carregarVencimentoGeral() {
  return localStorage.getItem(STORAGE_VENCIMENTO_KEY) || "";
}

function carregarCota() {
  return Number(localStorage.getItem(STORAGE_COTA_KEY)) || 1;
}

function converterValorNumero(valor) {
  if (typeof valor === "number") return valor;

  return (
    Number(
      String(valor || "0")
        .replace("R$", "")
        .replace(/\s/g, "")
        .replace(".", "")
        .replace(",", ".")
    ) || 0
  );
}

function somar15Dias(dataString) {
  if (!dataString) return "";

  const data = new Date(dataString + "T00:00:00");
  if (Number.isNaN(data.getTime())) return "";

  data.setDate(data.getDate() + 15);

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function RT() {
  const [alunos, setAlunos] = useState(carregarAlunos);
  const [vencimentoGeral, setVencimentoGeral] = useState(carregarVencimentoGeral);
  const [numeroCota, setNumeroCota] = useState(carregarCota);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alunos));
  }, [alunos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_VENCIMENTO_KEY, vencimentoGeral);
  }, [vencimentoGeral]);

  useEffect(() => {
    localStorage.setItem(STORAGE_COTA_KEY, numeroCota);
  }, [numeroCota]);

  const atualizarCampo = (index, campo, valor) => {
    const novaLista = [...alunos];
    novaLista[index][campo] = valor;

    if (campo === "valor") {
      if (valor.trim() !== "") {
        const hoje = new Date().toLocaleDateString("pt-BR");
        novaLista[index].dataPagamento = hoje;
        novaLista[index].situacao = "Pago";
      } else {
        novaLista[index].dataPagamento = "";

        if (novaLista[index].vencimento) {
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);

          const vencimento = new Date(novaLista[index].vencimento + "T00:00:00");

          if (!Number.isNaN(vencimento.getTime()) && vencimento < hoje) {
            novaLista[index].situacao = "Atrasado";
          } else {
            novaLista[index].situacao = "Aguardando";
          }
        } else {
          novaLista[index].situacao = "Aguardando";
        }
      }
    }

    if (campo === "vencimento" && novaLista[index].valor.trim() === "") {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const vencimento = new Date(valor + "T00:00:00");

      if (!Number.isNaN(vencimento.getTime()) && vencimento < hoje) {
        novaLista[index].situacao = "Atrasado";
      } else {
        novaLista[index].situacao = "Aguardando";
      }
    }

    setAlunos(novaLista);
  };

  const aplicarVencimentoTodos = (data) => {
    setVencimentoGeral(data);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const novaLista = alunos.map((aluno) => {
      let situacao = aluno.situacao;

      if (aluno.valor.trim() === "") {
        const vencimento = new Date(data + "T00:00:00");

        if (!Number.isNaN(vencimento.getTime()) && vencimento < hoje) {
          situacao = "Atrasado";
        } else {
          situacao = "Aguardando";
        }
      }

      return {
        ...aluno,
        vencimento: data,
        situacao,
      };
    });

    setAlunos(novaLista);
  };

  const novaQuinzena = () => {
    const confirmar = window.confirm(
      "Deseja iniciar uma nova quinzena? O sistema vai somar os valores, lançar no financeiro e limpar os pagamentos."
    );

    if (!confirmar) return;

    const totalArrecadado = alunos.reduce((acc, aluno) => {
      return acc + converterValorNumero(aluno.valor);
    }, 0);

    const historico = JSON.parse(localStorage.getItem("relatorio")) || [];

    const novosDadosRelatorio = alunos.map((aluno) => ({
      ...aluno,
      turma: "RT",
      dataRegistro: new Date().toLocaleDateString("pt-BR"),
    }));

    localStorage.setItem(
      "relatorio",
      JSON.stringify([...historico, ...novosDadosRelatorio])
    );

    const financeiroAtual = JSON.parse(localStorage.getItem("financeiro")) || [];

    if (totalArrecadado > 0) {
      financeiroAtual.push({
        tipo: "Entrada",
        categoria: "Cotas",
        descricao: "Arrecadação automática da nova quinzena - RT",
        valor: totalArrecadado,
        data: new Date().toLocaleDateString("pt-BR"),
        turma: "RT",
      });
    }

    localStorage.setItem("financeiro", JSON.stringify(financeiroAtual));

    const novaLista = alunos.map((aluno) => {
      const novoVencimento = somar15Dias(aluno.vencimento || vencimentoGeral);

      return {
        ...aluno,
        valor: "",
        dataPagamento: "",
        vencimento: novoVencimento,
        situacao: "Aguardando",
        observacao: aluno.observacao,
      };
    });

    setAlunos(novaLista);

    const novoVencimentoGeral = somar15Dias(vencimentoGeral);
    setVencimentoGeral(novoVencimentoGeral);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
    localStorage.setItem(STORAGE_VENCIMENTO_KEY, novoVencimentoGeral);

    setNumeroCota((prev) => prev + 1);
  };

  const corSituacao = (situacao) => {
    if (situacao === "Pago") return "#22c55e";
    if (situacao === "Atrasado") return "#ef4444";
    return "#facc15";
  };

  return (
    <div style={{ color: "#fff" }}>
      <h1 style={{ marginBottom: "20px" }}>Turma 2º RT</h1>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <label style={{ fontWeight: "bold" }}>Data de vencimento geral:</label>

        <input
          type="date"
          value={vencimentoGeral}
          onChange={(e) => aplicarVencimentoTodos(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #475569",
            backgroundColor: "#0f172a",
            color: "#fff",
            outline: "none",
          }}
        />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            minWidth: "1200px",
            borderCollapse: "collapse",
            backgroundColor: "#111827",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Nome</th>
              <th style={thStyle}>Valor</th>
              <th style={thStyle}>Cota</th>
              <th style={thStyle}>Data de Pagamento</th>
              <th style={thStyle}>Data de Vencimento</th>
              <th style={thStyle}>Situação</th>
              <th style={thStyle}>Observação</th>
            </tr>
          </thead>

          <tbody>
            {alunos.map((aluno, index) => (
              <tr key={index}>
                <td style={tdStyle}>{aluno.nome}</td>

                <td style={tdStyle}>
                  <input
                    type="text"
                    value={aluno.valor}
                    onChange={(e) => atualizarCampo(index, "valor", e.target.value)}
                    placeholder="R$"
                    style={inputStyle}
                  />
                </td>

                <td style={tdStyle}>
                  <div
                    style={{
                      ...inputStyle,
                      display: "flex",
                      alignItems: "center",
                      minHeight: "38px",
                    }}
                  >
                    Cota {numeroCota}
                  </div>
                </td>

                <td style={tdStyle}>{aluno.dataPagamento || "-"}</td>

                <td style={tdStyle}>
                  <input
                    type="date"
                    value={aluno.vencimento}
                    onChange={(e) =>
                      atualizarCampo(index, "vencimento", e.target.value)
                    }
                    style={inputStyle}
                  />
                </td>

                <td
                  style={{
                    ...tdStyle,
                    color: corSituacao(aluno.situacao),
                    fontWeight: "bold",
                  }}
                >
                  {aluno.situacao}
                </td>

                <td style={tdStyle}>
                  <input
                    type="text"
                    value={aluno.observacao}
                    onChange={(e) =>
                      atualizarCampo(index, "observacao", e.target.value)
                    }
                    placeholder="Observação"
                    style={inputStyle}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={novaQuinzena} style={buttonStyle}>
          Nova Quinzena
        </button>
      </div>
    </div>
  );
}

const thStyle = {
  border: "1px solid #334155",
  padding: "10px",
  backgroundColor: "#1e293b",
  color: "#fff",
  textAlign: "left",
  fontSize: "14px",
};

const tdStyle = {
  border: "1px solid #334155",
  padding: "8px",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #475569",
  backgroundColor: "#0f172a",
  color: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle = {
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "12px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default RT;