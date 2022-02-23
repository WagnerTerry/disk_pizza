import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { toast } from "react-toastify";
import APIService from "../services/api"

import './CadastroBebida.scss'

export default function CadastroBebida() {
    const bebida_schema = yup.object().shape({
        sabor: yup.string().min(1, "campo obrigatório").required(),
    });

    const {
        register,
        handleSubmit,
        reset,
    } = useForm({
        resolver: yupResolver(bebida_schema),
    });

    const [bebidas, setBebidas] = useState([])

    useEffect(() => {
        const showDrinks = async () => {
            const { bebidas } = await APIService.getBebidas()
            setBebidas(bebidas)
        }
        showDrinks()
    }, [])

    async function saveDrink(data) {
        try {
            await APIService.cadastrarBebida(data)
            setBebidas(prevState => [...prevState, data])
            toast.success("Bebida cadastrada com sucesso")
            console.log("bebidas", data)
            reset()

        } catch (e) {
            console.log("Ocorreu um erro ao salvar bebida", e)
            toast.error("Erro ao cadastrar bebida")
        }
    }

    async function deleteDrink(id) {
        try {
            await APIService.excluirBebidas(id)
            setBebidas(bebidas.filter(bebida => bebida.codigo_bebida !== id))
            toast.success("Bebida excluída com sucesso")
        } catch (e) {
            console.log("Ocorreu um erro ao excluir bebida", e)
            toast.error("Erro ao excluir bebida")
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
                            id="valor"
                            name="valor"
                            required
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
                        <label htmlFor="litros">Litros(ml): </label>
                        <input
                            type="number"
                            id="litros"
                            name="litros"
                            required
                            {...register("litros", { required: true })}
                        />
                    </div>

                </div>
                <input type="submit" value="Salvar" />
            </form>

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
                    {bebidas && bebidas.map((bebida, index) => {
                        return (
                            <tbody key={index}>
                                <tr>
                                    <td>{bebida.sabor}</td>
                                    <td>{bebida.valor}</td>
                                    <td>{bebida.tamanho}</td>
                                    <td>{bebida.litro}</td>
                                    <td><button type="button" onClick={() => deleteDrink(bebida.codigo_bebida)}>Excluir</button></td>
                                </tr>
                            </tbody>
                        )
                    })}
                </table>
            </div>
        </div>
    )
}