import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { toast } from "react-toastify";
import APIService from "../services/api"

import './CadastroBebida.scss'

export default function CadastroBebida() {
    const pizza_schema = yup.object().shape({
        nome_pizza: yup.string().min(1, "campo obrigatório").required(),
    });

    const {
        register,
        handleSubmit,
        reset,
    } = useForm({
        resolver: yupResolver(pizza_schema),
    });

    const [bebidas, setBebidas] = useState([])

    useEffect(() => {
        console.log("a")
    }, [])

    return (
        <div id="bebidas">
            <form onSubmit={handleSubmit(console.log("a"))}>
                <div className="form-bebida">
                    <div>
                        <label htmlFor="nome_bebida">Sabor: </label>
                        <input
                            type="text"
                            id="nome_pizza"
                            name="nome_pizza"
                            required
                            {...register("nome_pizza", { required: true })}
                        />
                    </div>
                    <div>
                        <label htmlFor="nome_bebida">Valor: </label>
                        <input
                            type="text"
                            id="nome_pizza"
                            name="nome_pizza"
                            required
                            {...register("nome_pizza", { required: true })}
                        />
                    </div>
                    <div>
                        <label htmlFor="nome_bebida">Tamanho: </label>
                        <input
                            type="text"
                            id="nome_pizza"
                            name="nome_pizza"
                            required
                            {...register("nome_pizza", { required: true })}
                        />
                    </div>
                    <div>
                        <label htmlFor="nome_bebida">Litros(ml): </label>
                        <input
                            type="text"
                            id="nome_pizza"
                            name="nome_pizza"
                            required
                            {...register("nome_pizza", { required: true })}
                        />
                    </div>
                    {/* <div>
                        <label htmlFor="ativo">Valor: </label>
                        <select
                            id="ativo"
                            name="ativo"
                            defaultValue=""
                            required
                            {...register("ativo", { required: true })}
                        >
                            <option value="" disabled>Selecione</option>
                            <option value="sim">Sim</option>
                            <option value="nao">Não</option>
                        </select>
                    </div> */}
                    {/* <div>
                        <label htmlFor="codigo_grupo">Grupo:  </label>
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
                            {group && group.map((grupo, idx) => (
                                <option key={idx} value={grupo.codigo_grupo}>{grupo.nome_grupo}</option>
                            ))}
                        </select>
                    </div> */}
                </div>
                <input type="submit" value="Salvar" />
            </form>

            <div className="pizza_list">
                <table id="table_pizza">
                    <thead>
                        <tr>
                            <th>Ativo</th>
                            <th>Nome_Pizza</th>
                            <th>Grupo</th>
                            <th>Excluir</th>
                        </tr>
                    </thead>
                    {/* {pizzas && pizzas.map((pizza, index) => {
                        return (
                            <tbody key={index}>
                                <tr>
                                    <td>{pizza.ativo}</td>
                                    <td>{pizza.nome_pizza}</td>
                                    <td>{pizza.nome_grupo}</td>
                                    <td><button type="button" onClick={() => deletePizza(pizza.codigo_pizza)}>Excluir</button></td>
                                </tr>
                            </tbody>
                        )
                    })} */}
                </table>
            </div>
        </div>
    )
}