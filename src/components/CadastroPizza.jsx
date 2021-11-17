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

    const [pizza, setPizza] = useState([])
    const [group, setGroup] = useState([])



    useEffect(() => {
        const showGroup = async () => {
            const { grupos } = await APIService.getGrupos()
            setGroup(grupos)
        }
        showGroup()
    }, [])

    return (
        <div id="pizza">
            <form onSubmit={handleSubmit}>
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
                            <option value="sim">Não</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="grupo_pizza">Grupo: </label>
                        {console.log("oi", group)}
                        <select
                            id="grupo_pizza"
                            name="grupo_pizza"
                            onChange={e => e.target.value}
                            required
                            {...register("grupo_pizza", { required: true })}
                        >
                            {group.map((grupo, index) => (
                                <option key={index} value={grupo.codigo_grupo}>{grupo.nome_grupo}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <input type="submit" value="Salvar" />
            </form>
        </div>
    )
}

