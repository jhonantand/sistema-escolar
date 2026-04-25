function Sidebar({
  menuAberto,
  setMenuAberto,
  setPaginaAtual,
  paginaAtual,
  onLogout,
}) {
  const trocarPagina = (pagina) => {
    setPaginaAtual(pagina);
    setMenuAberto(false);
  };

  return (
    <>
      {menuAberto && (
        <div style={styles.overlay} onClick={() => setMenuAberto(false)} />
      )}

      <aside
        style={{
          ...styles.sidebar,
          left: menuAberto ? 0 : "-320px",
        }}
      >
        <div>
          <div style={styles.topo}>
            <h2 style={styles.logo}>Sistema</h2>
            <button
              style={styles.fechar}
              onClick={() => setMenuAberto(false)}
            >
              ✕
            </button>
          </div>

          <div style={styles.menu}>
            <Botao
              texto="Home"
              ativo={paginaAtual === "home"}
              onClick={() => trocarPagina("home")}
            />

            <Botao
              texto="Sala"
              ativo={
                paginaAtual === "sala" ||
                paginaAtual === "rm1" ||
                paginaAtual === "rm2" ||
                paginaAtual === "rt" ||
                paginaAtual === "oli"
              }
              onClick={() => trocarPagina("sala")}
            />

            <Botao
              texto="Vendas"
              ativo={paginaAtual === "vendas"}
              onClick={() => trocarPagina("vendas")}
            />

            <Botao
              texto="Financeiro"
              ativo={paginaAtual === "financeiro"}
              onClick={() => trocarPagina("financeiro")}
            />

            <Botao
              texto="Lançamento"
              ativo={paginaAtual === "lancamento"}
              onClick={() => trocarPagina("lancamento")}
            />
          </div>
        </div>

        <button style={styles.logout} onClick={onLogout}>
          Sair
        </button>
      </aside>
    </>
  );
}

function Botao({ texto, onClick, ativo }) {
  return (
    <button
      style={{
        ...styles.botao,
        ...(ativo ? styles.botaoAtivo : {}),
      }}
      onClick={onClick}
    >
      {texto}
    </button>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    zIndex: 998,
  },
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: 280,
    height: "100vh",
    background: "#020617",
    borderRight: "1px solid #1e293b",
    padding: 20,
    zIndex: 999,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "left 0.28s ease",
    boxShadow: "0 0 30px rgba(0,0,0,0.35)",
  },
  topo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  logo: {
    color: "#38bdf8",
    margin: 0,
    fontSize: 24,
  },
  fechar: {
    background: "#0f172a",
    color: "#fff",
    border: "1px solid #1e293b",
    width: 38,
    height: 38,
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 18,
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  botao: {
    background: "#0f172a",
    color: "#fff",
    border: "1px solid #1e293b",
    padding: 12,
    borderRadius: 12,
    cursor: "pointer",
    textAlign: "left",
    fontSize: 15,
    fontWeight: "bold",
  },
  botaoAtivo: {
    background: "#2563eb",
    border: "1px solid #2563eb",
  },
  logout: {
    marginTop: 20,
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: 12,
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Sidebar;