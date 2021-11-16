import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { toast } from "react-toastify";
import APIService from "../services/api";

import './CadastroGrupo.scss'

export default function CadastroGrupo() {
    const group_schema = yup.object().shape({
        nome_grupo: yup.string().min(1, "campo obrigatório").required(),
    });

    const {
        register,
        handleSubmit,
        reset,
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
        console.log(data);
        try {
            const nome_grupo_maiusculo = data.nome_grupo.toUpperCase()
            const grupo_duplicado = group.filter((grupo) => grupo.nome_grupo.toUpperCase() === nome_grupo_maiusculo)
            if (grupo_duplicado.length > 0) {
                return toast.error("Existe um grupo com esse nome");

            }
            await APIService.cadastrarGrupo(data);
            setGroup(prevState => [...prevState, data])
            toast.success("Grupo cadastrado com sucesso");
            reset()

        } catch (e) {
            console.log("Ocorreu um erro ao cadastrar grupo", e);
            return toast.error("Erro ao cadastrar grupo");
        }
    }

    async function deleteGroup(id) {
        try {
            await APIService.excluirGrupo(id);
            setGroup(group.filter(grupo => grupo.codigo_grupo !== id))
            toast.success("Grupo excluido com sucesso");

        } catch (e) {
            console.log("Ocorreu um erro ao cadastrar grupo", e)
            return toast.error("Erro ao excluir grupo");
        }
    }

    return (
        <div>
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

            <div className="list_group">
                <table id="groups">
                    <thead>
                        <tr>
                            <th>Nome_Grupo</th>
                            <th>Preço Pequena</th>
                            <th>Preço Grande</th>
                            <th>Preço Família</th>
                            <th>Preço Gigante</th>
                            <th>Excluir</th>

                        </tr>
                    </thead>
                    {group && group.map((grupo, index) => {
                        return (
                            <tbody key={index}>
                                <tr >
                                    <td>{grupo.nome_grupo}</td>
                                    <td>{grupo.preco_pequena}</td>
                                    <td>{grupo.preco_grande}</td>
                                    <td>{grupo.preco_gigante}</td>
                                    <td>{grupo.preco_familia}</td>
                                    <td><button type="button" onClick={() => deleteGroup(grupo.codigo_grupo)}>Excluir</button></td>

                                </tr>
                            </tbody>
                        )
                    })}
                </table>
            </div>
        </div>
    )
}