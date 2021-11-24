import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from '../components/modal/Modal'

import { toast } from "react-toastify";
import "./CadastroCliente.scss";
import APIService from "../services/api";

import CadastroPizza from '../components/CadastroPizza'
import CadastroGrupo from '../components/CadastroGrupo'
import Nav from '../components/Nav'

export default function CadastroCliente() {
  const schema = yup.object().shape({
    nome: yup.string().min(1, "campo obrigatório").required(),
  });

  const [clients, setClients] = useState([])

  useEffect(() => {
    const showCustomers = async () => {
      const { clientes } = await APIService.getClientes()
      setClients(clientes)
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
    try {
      const nome_maiusculo = data.nome.toUpperCase()
      const nome_duplicado = clients.filter((cliente) => cliente.nome.toUpperCase() === nome_maiusculo)
      if (nome_duplicado.length > 0) {
        return toast.error("Já existe um cliente com esse nome, por favor coloque um sobrenome para diferenciar");
      }
      console.log(data);
      await APIService.cadastrarCliente(data);
      setClients(prevState => [...prevState, data])
      toast.success("Cliente cadastrado com sucesso");
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
      .then((data) => {
        showData(data);
      });
  }

  // function resetForm() {
  //   reset();
  // }

  // async function editClient(dados) {
  //   console.log("put")
  // }

  async function deleteClient(id) {
    try {
      await APIService.excluirCliente(id)
      setClients(clients.filter(cliente => cliente.codigo_cliente !== id))
      toast.success("Cliente excluido com sucesso");
    } catch (e) {
      console.log("erro ao excluir cliente", e)
      return toast.error("Erro ao excluir cliente")
    }
  }

  return (
    <div id="cadastro-cliente">
      <Nav />
      {/* <Nav name="Cadastrar Cliente" path="cadastrocliente" name2="Cadastrar Pizza" path2="cadastropizza" name3="Cadastrar Grupo" path3="cadastrogrupo" /> */}

      <div>
        <h2>Cadastro de Clientes</h2>
      </div>


      <header>
        {/* <div className={"cod-cliente"}>
          <label htmlFor="cod-cliente">Código do Cliente: </label>
          <input type="text" id="cod-cliente" name="cod-cliente" size="5" />
        </div> */}
        <div className={"menu-options"}>
          <Modal className={'first'} show={"Cadastrar Cliente"} title={"Cadastro de Clientes"}>
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
                  name="obs"
                  cols="50"
                  rows="3"
                  {...register("observacoes")}
                ></textarea>
              </div>
              <input type="submit" value="Salvar" />
            </form>

          </Modal>
          <Modal className={'third'} show={"Cadastrar Pizza"} title={"Cadastro de pizza"}>
            <CadastroPizza />
          </Modal>
          <Modal className={'second'} show={"Cadastrar Grupo"} title={"Cadastro de grupos"}>
            <CadastroGrupo />
          </Modal>
        </div>
      </header >

      <main>
        {/* <div className={"button-options"}>
          {" "}
          <button>Buscar</button>
          <button onClick={resetForm}>Limpar</button>
          <button>Alterar</button>
          <button>Apagar</button>
        </div> */}

        {/* ----------   exemplo de useForm    ------
        handleSubmit "validará suas entradas antes de invocar" onSubmit "
        <form onSubmit={handleSubmit(onSubmit)}>
          registre sua entrada no gancho invocando a função "registrar"
          <input placeholder={"nome"} {...register("nome")} />

          incluem validação com regras de validação HTML exigidas ou outras regras padrão
          <input {...register("exampleRequired", { required: true })} />
          erros retornarão quando a validação de campo falhar
          {errors.exampleRequired && <p>Campo Obrigatório</p>} */}

        <table id="customers">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Cep</th>
              <th>Logradouro</th>
              <th>Bairro</th>
              <th>Cidade</th>
              <th>Excluir</th>
            </tr>
          </thead>
          {clients && clients.map((cliente, index) => {
            return (
              <tbody key={index}>
                <tr >
                  {/* <td><input type="text" value={cliente.nome} /></td> */}
                  <td>{cliente.nome}</td>
                  <td>{cliente.telefone}</td>
                  <td>{cliente.cep}</td>
                  <td>{cliente.logradouro}</td>
                  <td>{cliente.bairro}</td>
                  <td>{cliente.cidade}</td>
                  <td><button type="button" onClick={() => deleteClient(cliente.codigo_cliente)}>Excluir</button></td>
                </tr>
              </tbody>
            )
          })}
        </table>
      </main>
    </div >
  );
}
