import { useState } from "react";
import logo from "../assets/logo-segundo.png";
import "./login.css";

export default function Login({ onLoginSucesso }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function entrar(e) {
    e.preventDefault();

    const usuarios = [
      { email: "jhonantandias36@gmail.com", senha: "123456" },
      { email: "nicollyamaro06@gmail.3com", senha: "96135414" },

      { email: "admin@site.com", senha: "admin123" },
    ];

    const usuarioValido = usuarios.find(
      (user) => user.email === email && user.senha === senha
    );

    if (usuarioValido) {
      onLoginSucesso();
    } else {
      alert("Email ou senha incorretos!");
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-header">
          <img src={logo} alt="Logo" className="logo" />
          <h1>Sistema Evento</h1>
          <p>Entre na sua conta para continuar</p>
        </div>

        <form className="login-form" onSubmit={entrar}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}