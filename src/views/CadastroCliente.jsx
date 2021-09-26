import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import "./CadastroCliente.scss";

export default function CadastroCliente() {
  const schema = yup.object().shape({
    nome: yup.string().min(1, "campo obrigatório").required(),
  });

  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => console.log(data);
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

  return (
    <div id="cadastro-cliente">
      <h2>Cadastro de Clientes</h2>

      <header>
        <div className={"cod-cliente"}>
          <label htmlFor="cod-cliente">Código do Cliente: </label>
          <input type="text" id="cod-cliente" name="cod-cliente" size="5" />
        </div>
        <div className={"button-options"}>
          {" "}
          <button>Buscar</button>
          <button>Limpar</button>
          <button>Salvar</button>
          <button>Alterar</button>
          <button>Apagar</button>
        </div>
        <div></div>
      </header>

      <main>
        {/* ----------   exemplo de useForm    ------
        handleSubmit "validará suas entradas antes de invocar" onSubmit "
        <form onSubmit={handleSubmit(onSubmit)}>
          registre sua entrada no gancho invocando a função "registrar"
          <input placeholder={"nome"} {...register("nome")} />

          incluem validação com regras de validação HTML exigidas ou outras regras padrão
          <input {...register("exampleRequired", { required: true })} />
          erros retornarão quando a validação de campo falhar
          {errors.exampleRequired && <p>Campo Obrigatório</p>} */}

        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="nome">Nome: </label>
            <input
              type="text"
              id="nome"
              name="nome"
              {...register("nome", { required: true })}
            />
            {errors.nome && <p>Campo Obrigatório</p>}

            <label htmlFor="telefone">Telefone: </label>
            <input
              type="number"
              id="telefone"
              name="telefone"
              {...register("telefone", { required: true })}
            />

            <div>
              <label htmlFor="cep">Cep: </label>
              <input
                type="text"
                id="cep"
                name="cep"
                maxLength="9"
                {...register("cep")}
                onBlur={onBlurCep}
              />
            </div>
            <div>
              <label htmlFor="logradouro">Logradouro: </label>
              <input
                type="text"
                id="logradouro"
                name="logradouro"
                size="50"
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
                {...register("bairro")}
              />
              <label htmlFor="cidade">Cidade: </label>
              <input
                type="text"
                id="localidade"
                name="localidade"
                size="40"
                {...register("localidade")}
              />
            </div>
            <div>
              <label htmlFor="obs">Observações: </label>
              <textarea
                name="obs"
                cols="50"
                rows="3"
                {...register("obs")}
              ></textarea>
            </div>
            <input type="submit" />
          </form>
        </div>
      </main>
    </div>
  );
}
