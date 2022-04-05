import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { toast } from "react-toastify";
import APIService from "../services/api";

import "./CadastroCliente.scss";

export default function CadastroCliente({ dispatch }) {
    const schema = yup.object().shape({
        nome: yup.string().min(1, "campo obrigatório").required(),
    });

    const [clients, setClients] = useState([]);

    useEffect(() => {
        const showCustomers = async () => {
            const { clientes } = await APIService.getClientes();
            setClients(clientes);

        };

        showCustomers();
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        // watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    async function save(data) {
        try {
            const nome_maiusculo = data.nome.toUpperCase();
            const nome_duplicado = clients.filter(
                (cliente) => cliente.nome.toUpperCase() === nome_maiusculo
            );
            if (nome_duplicado.length > 0) {
                return toast.error(
                    "Já existe um cliente com esse nome, por favor coloque um sobrenome para diferenciar"
                );
            }
            await APIService.cadastrarCliente(data);
            setClients((prevState) => [...prevState, data]);
            toast.success("Cliente cadastrado com sucesso");
            console.log(data);
            dispatch(oldState => [...oldState, data])
            reset();
        } catch (e) {
            console.log("Ocorreu um erro ao salvar cliente", e);
            return toast.error("Erro ao salvar cliente");
        }
    }

    const showData = (result) => {
        for (const campo in result) {
            // # como se fosse um getElementById
            if (document.querySelector("#" + campo)) {
                document.querySelector("#" + campo).value = result[campo];
            }
            document.getElementById("bairro").focus();
            document.getElementById("localidade").focus();
            document.getElementById("logradouro").focus();
        }
    };

    function onBlurCep(e) {
        const { value } = e.target;

        const cep = value?.replace(/[^0-9]/g, "");

        if (cep?.length !== 8) {
            return;
        }

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then((res) => res.json())
            .catch((err) => err)
            .then((data) => {
                showData(data);
            })
            .catch((error) => error);
    }

    return (
        <form id={"form-customer"} onSubmit={handleSubmit(save)}>
            <div className="form-fields">
                <label htmlFor="nome">Nome: </label>
                <input
                    type="text"
                    id="nome"
                    name="nome"
                    required
                    {...register("nome", { required: true })}
                />
                {errors.nome && <p>Campo Obrigatório</p>}

                <label htmlFor="telefone">Telefone: </label>
                <input
                    type="number"
                    id="telefone"
                    name="telefone"
                    required
                    {...register("telefone", { required: true })}
                />
            </div>

            <div>
                <label htmlFor="cep">Cep: </label>
                <input
                    type="text"
                    id="cep"
                    name="cep"
                    maxLength="9"
                    {...register("cep")}
                    onBlur={onBlurCep}
                    required
                />
            </div>
            <div>
                <label htmlFor="logradouro">Logradouro: </label>
                <input
                    type="text"
                    id="logradouro"
                    name="logradouro"
                    size="50"
                    required
                    {...register("logradouro")}
                />
            </div>

            <div>
                <label htmlFor="bairro">Bairro: </label>
                <input
                    type="text"
                    id="bairro"
                    name="bairro"
                    size="40"
                    required
                    {...register("bairro")}
                />
                <label htmlFor="localidade">Cidade: </label>
                <input
                    type="text"
                    id="localidade"
                    name="localidade"
                    size="40"
                    required
                    {...register("cidade")}
                />
            </div>
            <div>
                <label htmlFor="observacoes">Observações: </label>
                <textarea
                    name="observacoes"
                    cols="50"
                    rows="3"
                    {...register("observacoes")}
                ></textarea>
            </div>
            <input type="submit" className="save-customer" value="Salvar" />
        </form>
    )
}