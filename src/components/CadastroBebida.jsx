import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { toast } from "react-toastify";
import APIService from "../services/api";

import "./CadastroBebida.scss";

export default function CadastroBebida() {
  const bebida_schema = yup.object().shape({
    sabor: yup.string().min(1, "campo obrigatório").required(),
  });

  const { register, handleSubmit, reset } = useForm({
    resolver: yupResolver(bebida_schema),
  });

  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    const showDrinks = async () => {
      const { bebidas } = await APIService.getBebidas();
      setDrinks(bebidas);
    };
    showDrinks();
  }, []);

  async function saveDrink(data) {
    try {
      await APIService.cadastrarBebida(data);
      setDrinks((prevState) => [...prevState, data]);
      toast.success("Bebida cadastrada com sucesso");
      console.log("bebidas", data);
      reset();
    } catch (e) {
      console.log("Ocorreu um erro ao salvar bebida", e);
      toast.error("Erro ao cadastrar bebida");
    }
  }

  async function deleteDrink(id) {
    try {
      await APIService.excluirBebidas(id);
      setDrinks(drinks.filter((bebida) => bebida.codigo_bebida !== id));
      toast.success("Bebida excluída com sucesso");
    } catch (e) {
      console.log("Ocorreu um erro ao excluir bebida", e);
      toast.error("Erro ao excluir bebida");
    }
  }

  return (
    <div id="bebidas">
      <form onSubmit={handleSubmit(saveDrink)}>
        <div className="form-bebida">
          <div>
            <label htmlFor="sabor">Sabor: </label>
            <input
              type="text"
              id="sabor"
              name="sabor"
              required
              {...register("sabor", { required: true })}
            />
          </div>
          <div>
            <label htmlFor="valor">Valor: </label>
            <input
              type="text"
              step="0.010"
              name="valor"
              required
              min={0}
              max={1000}
              {...register("valor", { required: true })}
            />
          </div>
          <div>
            <label htmlFor="tamanho">Tamanho: </label>
            <input
              type="text"
              id="tamanho"
              name="tamanho"
              required
              {...register("tamanho", { required: true })}
            />
          </div>
          <div>
            <label htmlFor="litro">Litros(ml): </label>
            <input
              type="number"
              id="litro"
              name="litro"
              required
              {...register("litro", { required: true })}
            />
          </div>
        </div>
        <input type="submit" value="Salvar" />
      </form>

      <h4>Lista de Bebidas</h4>

      {drinks && drinks.length > 0 ? (
        <div className="bebida_list">
          <table id="table_bebida">
            <thead>
              <tr>
                <th>Sabor</th>
                <th>Valor</th>
                <th>Tamanho</th>
                <th>Litros(ml)</th>
                <th>Excluir</th>
              </tr>
            </thead>
            {drinks &&
              drinks.map((bebida, index) => {
                return (
                  <tbody key={index}>
                    <tr>
                      <td data-label="Sabor">{bebida.sabor}</td>
                      <td data-label="Valor">{bebida.valor}</td>
                      <td data-label="Tamanho">{bebida.tamanho}</td>
                      <td data-label="Litro">{bebida.litro}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => deleteDrink(bebida.codigo_bebida)}
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
        <div className="no_drinks">Não há bebidas cadastradas.</div>
      )}
    </div>
  );
}
