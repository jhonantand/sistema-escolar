import { useState } from "react";

export default function Equipes() {
  const [lista, setLista] = useState([]);

  function add() {
    const nome = prompt("Nome do aluno");
    setLista([...lista, nome]);
  }

  return (
    <div>
      <h1>Equipes</h1>
      <button onClick={add}>Adicionar</button>

      {lista.map((n,i)=>(
        <div key={i}>{n}</div>
      ))}
    </div>
  );
}