import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { toast } from "react-toastify";
import APIService from "../services/api";

import "./CadastroPizza.scss";

export default function CadastroPizza() {
  const pizza_schema = yup.object().shape({
    nome_pizza: yup.string().min(1, "campo obrigatório").required(),
  });

  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(pizza_schema),
  });

  const [pizzas, setPizzas] = useState([]);
  const [group, setGroup] = useState([]);

  useEffect(() => {
    const showGroup = async () => {
      const { pizzas } = await APIService.getPizzas();
      const { grupos } = await APIService.getGrupos();
      setPizzas(pizzas);
      setGroup(grupos);
    };
    showGroup();
  }, []);

  async function savePizza(data) {
    try {
      await APIService.inserirPizza(data);
      setPizzas((prevState) => [...prevState, data]);
      toast.success("Pizza cadastrada com sucesso");
      console.log(data);
      reset();
    } catch (e) {
      console.log("Ocorreu um erro ao cadastrar pizza", e);
      return toast.error("Erro ao cadastrar pizza");
    }
  }

  async function deletePizza(id) {
    try {
      await APIService.excluirPizza(id);
      setPizzas(pizzas.filter((pizza) => pizza.codigo_pizza !== id));
      toast.success("Pizza excluída com sucesso");
    } catch (e) {
      console.log("Ocorreu um erro ao excluir pizza", e);
      return toast.error("Erro ao excluir pizza");
    }
  }

  return (
    <div id="pizza">
      <form onSubmit={handleSubmit(savePizza)}>
        <div className="form-pizza">
          <div>
            <label htmlFor="nome_pizza">Nome_Pizza: </label>
            <input
              type="text"
              id="nome_pizza"
              name="nome_pizza"
              required
              {...register("nome_pizza", { required: true })}
            />
          </div>
          <div>
            <label htmlFor="ativo">Ativo: </label>
            <select
              id="ativo"
              name="ativo"
              defaultValue=""
              required
              {...register("ativo", { required: true })}
            >
              <option value="" disabled>
                Selecione
              </option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>
          <div>
            <label htmlFor="codigo_grupo">Grupo: </label>
            <select
              id="codigo_grupo"
              name="codigo_grupo"
              defaultValue=""
              required
              {...register("codigo_grupo", { required: true })}
            >
              <option value="" disabled>
                Selecione
              </option>
              {group &&
                group.map((grupo, idx) => (
                  <option key={idx} value={grupo.codigo_grupo}>
                    {grupo.nome_grupo}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <input type="submit" value="Salvar" />
      </form>

      {pizzas && pizzas.length > 0 ? (
        <div className="pizza_list">
          <table id="table_pizza">
            <thead>
              <tr>
                <th scope="col">Ativo</th>
                <th scope="col">Nome_Pizza</th>
                <th scope="col">Grupo</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            {pizzas &&
              pizzas.map((pizza, index) => {
                return (
                  <tbody key={index}>
                    <tr>
                      <td data-label="Ativo">{pizza.ativo}</td>
                      <td data-label="Nome_Pizza">{pizza.nome_pizza}</td>
                      <td data-label="Grupo">{pizza.nome_grupo}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => deletePizza(pizza.codigo_pizza)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
          </table>
        </div>
      ) : (
        <div className="no_pizzas">Não há pizzas cadastradas.</div>
      )}
    </div>
  );
}
