import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { toast } from "react-toastify";
import APIService from "../services/api";

import './CadastroPizza.scss'

export default function CadastroPizza() {
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

    const [pizzas, setPizzas] = useState([])

    useEffect(() => {
        const showGroup = async () => {
            const { pizzas } = await APIService.getPizzas()
            setPizzas(pizzas)
        }
        showGroup()
    }, [])

    async function savePizza(data) {
        try {
            await APIService.inserirPizza(data)
            setPizzas(prevState => [...prevState, data])
            toast.success("Pizza cadastrada com sucesso");
            console.log(data);
            reset()

        } catch (e) {
            console.log("Ocorreu um erro ao cadastrar pizza", e);
            return toast.error("Erro ao cadastrar pizza");
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
                            required
                            {...register("ativo", { required: true })}
                        >
                            <option value="sim">Sim</option>
                            <option value="nao">Não</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="nome_pizza">Grupo:  </label>
                        <select
                            id="nome_pizza"
                            name="nome_pizza"
                            onChange={e => e.target.value}
                            required
                            {...register("nome_pizza", { required: true })}
                        >
                            {pizzas.map((pizza, index) => (
                                <option key={index} value={pizza.codigo_grupo}>{pizza.nome_grupo}</option>
                            ))}
                        </select>
                    </div>
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
                    {pizzas.map((pizza, index) => {
                        return (
                            <tbody key={index}>
                                <tr >
                                    <td>{pizza.ativo}</td>
                                    <td>{pizza.nome}</td>
                                    <td>{pizza.nome_grupo}</td>
                                    <td><button type="button" onClick={() => console.log("a")}>Excluir</button></td>
                                </tr>
                            </tbody>
                        )
                    })}
                </table>
            </div>
        </div>
    )
}

