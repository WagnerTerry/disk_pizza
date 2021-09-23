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

  function onBlurCep(e, setFieldValue) {
    const { value } = e.target;

    const cep = value?.replace(/[^0-9]/g, "");

    if (cep?.length !== 8) {
      return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        setFieldValue("logradouro", data.logradouro);
        setFieldValue("bairro", data.bairro);
        setFieldValue("cidade", data.localidade);
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
              placeholder="Nome"
              id="nome"
              name="nome"
              {...register("nome", { required: true, maxLength: 30 })}
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
                onBlur={onBlurCep}
                // onChange={() => console.log(">>>", onBlurCep())}
                // onBlur={(e) => this.onBlurCep(e, setFieldValue)}

                {...register("cep")}
                // value={values.cep || ""}
                // onBlur={(e) => this.onBlurCep(e, setFieldValue)}
                // onChange={handleChange}
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
                // value={setFieldValue.logradouro || ""}
                // onChange={handleChange}
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
                // value={values.bairro || ""}
                // onChange={handleChange}
              />
              <label htmlFor="cidade">Cidade: </label>
              <input
                type="text"
                id="localidade"
                name="cidade"
                size="40"
                {...register("cidade")}
                // value={values.cidade || ""}
                // onChange={handleChange}
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
