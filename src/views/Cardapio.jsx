import React, { useState, useEffect } from "react";
import api from "../services/api";
import Loading from "../components/loading/Loading";

import "./Cardapio.scss";

export default function Cardapio() {
  // const [diskPizza, setDiskPizza] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [refrigerantes, setRefrigerantes] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);

  // função auto executável
  useEffect(() => {
    const buscaPizza = async () => {
      const response = await api.get("");

      // setDiskPizza(response.data);
      setPizzas(response.data.pizzas);
      setGrupos(response.data.grupos);
      setRefrigerantes(response.data.refrigerantes);
      setLoading((oldState) => !oldState);
    };
    buscaPizza();
  }, []);

  return (
    <div id={"cardapio"}>
      {loading ? (
        <div className="loading">
          <Loading size={30}></Loading>
        </div>
      ) : (
        <>
          <h2>Pizzas</h2>
          {grupos.map((grupo, i) => {
            return (
              <div key={i}>
                <strong>{grupo.grupo}</strong>
                {pizzas.map((pizza, a) => {
                  return (
                    <div key={a}>
                      {pizza.grupo === grupo.grupo && <h3>{pizza.nome}</h3>}
                    </div>
                  );
                })}
                <h4>
                  Pequena R$ {grupo.preco_pequena} | Grande R${" "}
                  {grupo.preco_grande} | Família R$ {grupo.preco_familia}{" "}
                  {grupo.preco_gigante && `| Gigante R$ ${grupo.preco_gigante}`}
                </h4>
              </div>
            );
          })}

          <strong>REFRIGERANTE GRÁTIS</strong>
          {refrigerantes.map((refri) => {
            return (
              <h3 key={refri.codigo_refri}>
                Tamanho : {refri.tamanho} - {refri.litro} litros
              </h3>
            );
          })}
        </>
      )}
    </div>
  );
}
