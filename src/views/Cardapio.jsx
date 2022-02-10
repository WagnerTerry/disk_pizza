import React, { useState, useEffect } from "react";
import APIService from "../services/api";
import Loading from "../components/loading/Loading";
import Nav from '../components/Nav'


import "./Cardapio.scss";

export default function Cardapio() {
  const [pizzas, setPizzas] = useState([]);
  const [bebidas, setBebidas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);

  // função auto executável
  useEffect(() => {
    const buscaPizza = async () => {
      const getPizzas = await APIService.getPizzas();
      const getGrupos = await APIService.getGrupos();
      const getBebidas = await APIService.getBebidas();

      setPizzas(getPizzas.pizzas);
      setGrupos(getGrupos.grupos);
      setBebidas(getBebidas.bebidas);
      setLoading((oldState) => !oldState);
    };
    buscaPizza();
  }, []);

  return (
    <div id={"cardapio"}>
      <div className="component-nav">
        <Nav />
      </div>
      <div className="menu">Cardapio</div>
      <div className="cardapio-class">
        {loading ? (
          <div className="loading">
            <Loading size={30}></Loading>
          </div>
        ) : (
          <>
            {grupos.map((grupo, i) => {
              return (
                <div key={i}>
                  <strong>{grupo.nome_grupo}</strong>
                  {pizzas.map((pizza, a) => {
                    return (
                      <div key={a}>
                        {pizza.nome_grupo === grupo.nome_grupo && (
                          <h3>{pizza.ativo === 'sim' && pizza.nome_pizza}</h3>
                        )}
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
            {bebidas.map((bebida) => {
              return (
                <h3 key={bebida.codigo_bebida}>
                  Tamanho : {bebida.tamanho} - {bebida.litro} litros
                </h3>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
