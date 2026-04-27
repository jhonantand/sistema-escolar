import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modo, setModo] = useState("login"); // login | cadastro | recuperar

  // 🔐 LOGIN
  const entrar = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      alert("Email ou senha inválidos");
      return;
    }

    onLogin(data.user);
  };

  // 🆕 CRIAR CONTA
  const criarConta = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (error) {
      alert("Erro ao criar conta");
      return;
    }

    alert("Conta criada! Verifique seu email.");
    setModo("login");
  };

  // 🔁 RECUPERAR SENHA
  const recuperarSenha = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      alert("Erro ao enviar email");
      return;
    }

    alert("Email de recuperação enviado!");
    setModo("login");
  };

  return (
    <div className="login-container">
      <form
        onSubmit={
          modo === "login"
            ? entrar
            : modo === "cadastro"
            ? criarConta
            : recuperarSenha
        }
        className="login-box"
      >
        <h2>
          {modo === "login"
            ? "Entrar"
            : modo === "cadastro"
            ? "Criar conta"
            : "Recuperar senha"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {modo !== "recuperar" && (
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        )}

        <button type="submit">
          {modo === "login"
            ? "Entrar"
            : modo === "cadastro"
            ? "Criar conta"
            : "Enviar email"}
        </button>

        <div className="login-links">
          {modo === "login" && (
            <>
              <p onClick={() => setModo("cadastro")}>
                Não tem conta? Criar conta
              </p>
              <p onClick={() => setModo("recuperar")}>
                Esqueci a senha
              </p>
            </>
          )}

          {modo !== "login" && (
            <p onClick={() => setModo("login")}>
              Já tenho conta
            </p>
          )}
        </div>
      </form>
    </div>
  );
}