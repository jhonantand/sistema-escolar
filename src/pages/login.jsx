import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import logo from "../assets/logo-segundo.png";
import "./login.css";

export default function Login({ onLogin }) {
  const [modo, setModo] = useState("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setModo("trocarSenha");
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  async function entrar(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

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

  async function criarConta(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (error) {
      setErro(error.message);
      return;
    }

    setMensagem("Conta criada! Agora clique em Entrar.");
    setModo("entrar");
  }

  async function enviarRecuperacao(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

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

    setMensagem("Enviamos um link para trocar sua senha no email.");
  }

  async function trocarSenha(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (!novaSenha || novaSenha.length < 6) {
      setErro("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: novaSenha,
    });

    if (error) {
      setErro(error.message);
      return;
    }

    setMensagem("Senha alterada com sucesso! Agora faça login.");
    setModo("entrar");
    setNovaSenha("");
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <img src={logo} alt="Logo" className="login-logo" />

        <h1>Sistema Escolar</h1>

        {modo === "entrar" && (
          <form onSubmit={entrar}>
            <p>Entrar no sistema</p>

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
            {mensagem && <p className="login-success">{mensagem}</p>}

            <button className="login-btn" type="submit">Entrar</button>

            <button type="button" className="login-secondary" onClick={() => setModo("criar")}>
              Criar conta
            </button>

            <button type="button" className="login-link" onClick={() => setModo("esqueci")}>
              Esqueci a senha
            </button>
          </form>
        )}

        {modo === "criar" && (
          <form onSubmit={criarConta}>
            <p>Criar conta</p>

            <input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Crie uma senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            {erro && <p className="login-error">{erro}</p>}
            {mensagem && <p className="login-success">{mensagem}</p>}

            <button className="login-btn" type="submit">Criar conta</button>

            <button type="button" className="login-secondary" onClick={() => setModo("entrar")}>
              Já tenho conta
            </button>
          </form>
        )}

        {modo === "esqueci" && (
          <form onSubmit={enviarRecuperacao}>
            <p>Recuperar senha</p>

            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {erro && <p className="login-error">{erro}</p>}
            {mensagem && <p className="login-success">{mensagem}</p>}

            <button className="login-btn" type="submit">Enviar link</button>

            <button type="button" className="login-secondary" onClick={() => setModo("entrar")}>
              Voltar
            </button>
          </form>
        )}

        {modo === "trocarSenha" && (
          <form onSubmit={trocarSenha}>
            <p>Trocar senha</p>

            <input
              type="password"
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />

            {erro && <p className="login-error">{erro}</p>}
            {mensagem && <p className="login-success">{mensagem}</p>}

            <button className="login-btn" type="submit">Salvar nova senha</button>
          </form>
        )}
      </div>
    </div>
  );
}