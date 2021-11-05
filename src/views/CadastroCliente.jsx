import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from '../components/modal/Modal'

import { toast } from "react-toastify";
import "./CadastroCliente.scss";
import APIService from "../services/api";

export default function CadastroCliente() {
  const schema = yup.object().shape({
    nome: yup.string().min(1, "campo obrigatório").required(),
  });

  const [clientes, setClientes] = useState([])

  useEffect(() => {
    const showCustomers = async () => {
      let _clientes = await APIService.getClientes()
      setClientes(_clientes)
    }
    showCustomers()
  }, [])

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
    console.log(data);
    try {
      await APIService.cadastrarCliente(data);
      toast.success("Cliente cadastrado com sucesso");
      reset();
    } catch (e) {
      console.log("Ocorreu um erro ao salvar cliente", e);
      return toast.error("Erro ao salvar cliente");
    }
  }
  // console.log(watch("nome"));

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
      .then((data) => {
        showData(data);
      });
  }

  function resetForm() {
    reset();
  }

  // async function showCustomers() {

  //   console.log("teste", clientes)

  // }

  return (
    <div id="cadastro-cliente">
      <div>
        <h2>Cadastro de Clientes</h2>
      </div>

      <header>
        {/* <div className={"cod-cliente"}>
          <label htmlFor="cod-cliente">Código do Cliente: </label>
          <input type="text" id="cod-cliente" name="cod-cliente" size="5" />
        </div> */}
        <div className={"menu-options"}>
          <Modal className={'second'} show={"Ver Clientes"} title={"Lista de Clientes"}>
            ai deu bom
          </Modal>
          <Modal className={'first'} show={"Cadastrar Produto"} title={"Cadastro de produto"}>
            produtos
          </Modal>
          {/* <div onClick={() => console.log(clientes)}>Ver Clientes</div>
          <div>Cadastrar Produto</div> */}
        </div>
      </header>

      <main>
        <div className={"button-options"}>
          {" "}
          <button>Buscar</button>
          <button onClick={resetForm}>Limpar</button>
          <button>Alterar</button>
          <button>Apagar</button>
        </div>
        {/* ----------   exemplo de useForm    ------
        handleSubmit "validará suas entradas antes de invocar" onSubmit "
        <form onSubmit={handleSubmit(onSubmit)}>
          registre sua entrada no gancho invocando a função "registrar"
          <input placeholder={"nome"} {...register("nome")} />

          incluem validação com regras de validação HTML exigidas ou outras regras padrão
          <input {...register("exampleRequired", { required: true })} />
          erros retornarão quando a validação de campo falhar
          {errors.exampleRequired && <p>Campo Obrigatório</p>} */}

        <form onSubmit={handleSubmit(save)}>
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
              name="obs"
              cols="50"
              rows="3"
              {...register("observacoes")}
            ></textarea>
          </div>
          <input className="test" type="submit" value="Salvar" />
        </form>
      </main>
    </div>
  );
}
