import { useState } from "react";
import { supabase } from "../lib/supabase";
import logo from "../assets/logo-segundo.png";
import "./login.css";

export default function Login({ onLogin }) {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function entrar() {
    setErro("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro("Email ou senha inválidos.");
      return;
    }

    if (onLogin) onLogin(data.user);
  }

  async function criarConta() {
    setErro("");

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (error) {
      setErro(error.message);
      return;
    }

    alert("Conta criada com sucesso! Agora clique em 'Já tenho conta' e entre.");
    setModoCadastro(false);
  }

  async function esqueciSenha() {
    setErro("");

    if (!email) {
      setErro("Digite seu email primeiro.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) {
      setErro(error.message);
      return;
    }

    alert("Enviamos um link para trocar a senha no seu email.");
  }

  function enviar(e) {
    e.preventDefault();

    if (modoCadastro) {
      criarConta();
    } else {
      entrar();
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={logo} alt="Logo" className="login-logo" />

        <h1>Sistema Escolar</h1>
        <p>{modoCadastro ? "Criar conta" : "Entrar no sistema"}</p>

        <form onSubmit={enviar}>
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          {erro && <p className="login-error">{erro}</p>}

          <button type="submit" className="login-btn">
            {modoCadastro ? "Criar conta" : "Entrar"}
          </button>

          <button
            type="button"
            className="login-secondary"
            onClick={() => setModoCadastro(!modoCadastro)}
          >
            {modoCadastro ? "Já tenho conta" : "Criar conta"}
          </button>

          {!modoCadastro && (
            <button
              type="button"
              className="login-link"
              onClick={esqueciSenha}
            >
              Esqueci a senha
            </button>
          )}
        </form>
      </div>
    </div>
  );
}