import { useState } from "react";

export default function Estoque() {
  const [itens, setItens] = useState([]);

  function add() {
    const nome = prompt("Nome");
    const qtd = prompt("Quantidade");

    setItens([...itens, { nome, qtd }]);
  }

  return (
    <div>
      <h1>Estoque</h1>
      <button onClick={add}>Adicionar</button>

      {itens.map((i,idx)=>(
        <div key={idx}>{i.nome} - {i.qtd}</div>
      ))}
    </div>
  );
}