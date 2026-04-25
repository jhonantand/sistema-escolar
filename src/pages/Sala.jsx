function Sala({ setPaginaAtual }) {
  const turmas = [
    { nome: "RM1", pagina: "rm1", descricao: "Turma RM1" },
    { nome: "RM2", pagina: "rm2", descricao: "Turma RM2" },
    { nome: "RT", pagina: "rt", descricao: "Turma RT" },
    { nome: "OLI", pagina: "oli", descricao: "Turma Olímpico" },
  ];

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.titulo}>Sala</h1>
      <p style={styles.subtitulo}>
        Escolha a turma para gerenciar as cotas e alunos.
      </p>

      <div style={styles.grid}>
        {turmas.map((turma) => (
          <div key={turma.nome} style={styles.card}>
            <div>
              <h2 style={styles.nome}>{turma.nome}</h2>
              <p style={styles.descricao}>{turma.descricao}</p>
            </div>

            <button
              style={styles.botao}
              onClick={() => setPaginaAtual(turma.pagina)}
            >
              Entrar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  titulo: {
    fontSize: 34,
    marginBottom: 8,
    color: "#fff",
  },
  subtitulo: {
    color: "#94a3b8",
    marginBottom: 24,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 18,
  },
  card: {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: 20,
    padding: 22,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 180,
    transition: "0.2s",
  },
  nome: {
    color: "#fff",
    margin: 0,
    marginBottom: 8,
    fontSize: 26,
  },
  descricao: {
    color: "#94a3b8",
    margin: 0,
  },
  botao: {
    marginTop: 20,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: 12,
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.2s",
  },
};

export default Sala;