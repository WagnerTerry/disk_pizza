import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { toast } from "react-toastify";
import APIService from "../services/api";

export default function CadastroGrupo() {
    const group_schema = yup.object().shape({
        nome_grupo: yup.string().min(1, "campo obrigatório").required(),
    });

    const {
        register,
        handleSubmit,
    } = useForm({
        resolver: yupResolver(group_schema),
    });

    const [group, setGroup] = useState([])

    useEffect(() => {
        const showGroup = async () => {
            const { grupos } = await APIService.getGrupos()
            setGroup(grupos)
        }
        showGroup()
    }, [])

    async function saveGroup(data) {
        console.log(">>>", data);
        try {
            await APIService.cadastrarGrupo(data);
            toast.success("Grupo cadastrado com sucesso");

        } catch (e) {
            console.log("Ocorreu um erro ao cadastrar grupo", e);
            return toast.error("Erro ao cadastrar grupo");

        }
    }

    return (
        <form onSubmit={handleSubmit(saveGroup)}>
            <div className="form-group">
                <div>
                    <label htmlFor="nome_grupo">Nome_Grupo: </label>
                    <input
                        type="text"
                        id="nome_grupo"
                        name="nome_grupo"
                        required
                        {...register("nome_grupo", { required: true })}
                    />
                </div>
                <div>
                    <label htmlFor="preco_pequena">Preço Pequena: </label>
                    <input
                        type="number"
                        step="any"
                        id="preco_pequena"
                        name="preco_pequena"
                        required
                        {...register("preco_pequena", { required: true })}
                    />
                </div>
                <div>
                    <label htmlFor="preco_grande">Preço Grande: </label>
                    <input
                        type="number"
                        step="any"
                        id="preco_grande"
                        name="preco_grande"
                        required
                        {...register("preco_grande", { required: true })}
                    />
                </div>
                <div>
                    <label htmlFor="preco_familia">Preço Família: </label>
                    <input
                        type="number"
                        step="any"
                        id="preco_familia"
                        name="preco_familia"
                        required
                        {...register("preco_familia", { required: true })}
                    />
                </div>
                <div>
                    <label htmlFor="preco_gigante">Preço Gigante: </label>
                    <input
                        type="number"
                        step="any"
                        id="preco_gigante"
                        name="preco_gigante"
                        required
                        {...register("preco_gigante", { required: true })}
                    />
                </div>
            </div>
            <div className="register-group">
                <input type="submit" value="Cadastrar Grupo" />
            </div>
        </form>
    )
}