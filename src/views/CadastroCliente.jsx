import React, { useState, useEffect, lazy, Suspense } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "../components/modal/Modal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import PeopleIcon from '@mui/icons-material/People';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import LocalBarIcon from '@mui/icons-material/LocalBar';

import { toast } from "react-toastify";
import "./CadastroCliente.scss";
import APIService from "../services/api";

import CadastroPizza from "../components/CadastroPizza";
import CadastroGrupo from "../components/CadastroGrupo";
import Nav from "../components/Nav";
import CadastroBebida from "../components/CadastroBebida";
//import Loading from "../components/loading/Loading";

const Loading = lazy(() => import("../components/loading/Loading"));

export default function CadastroCliente() {
  const schema = yup.object().shape({
    nome: yup.string().min(1, "campo obrigatório").required(),
  });

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [pageWidth, setPageWidth] = useState(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);

  useEffect(() => {
    const showCustomers = async () => {
      const { clientes } = await APIService.getClientes();
      setClients(clientes);
      setLoading((oldState) => !oldState);
    };

    function larguraPagina() {
      window.addEventListener("resize", function () {
        let _pageWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        setTimeout(function () {
        }, 500)
        setPageWidth(_pageWidth)
      })
    }

    showCustomers();
    setTimeout(() => setIsLoading(false), 4000);
    larguraPagina();
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

  async function updateClient(client) {
    // event.preventDefault();
    console.log("put", client);
    try {
      await APIService.atualizarCliente(client);
      setClients((prevState) => [...prevState, client]);
      toast.success("Cliente atualizado com sucesso");
      console.log("cliente editado", client);
      reset();
    } catch (e) {
      console.log("Ocorreu um erro ao editar cliente", e);
      return toast.error("Erro ao editar cliente");
    }
  }

  async function deleteClient(id) {
    try {
      await APIService.excluirCliente(id);
      setClients(clients.filter((cliente) => cliente.codigo_cliente !== id));
      toast.success("Cliente excluido com sucesso");
    } catch (e) {
      console.log("Ocorreu um erro ao excluir cliente", e);
      return toast.error("Erro ao excluir cliente");
    }
  }

  let handleChange = (e, i) => {
    let newFormValues = [...clients];
    newFormValues[i][e.target.name] = e.target.value;
    setClients(newFormValues);
  };



  return (
    <Suspense fallback={<h3>Loading...</h3>}>
      <div id="cadastro-cliente">
        <div className="component-nav">
          <Nav />
        </div>
        {/* <Nav name="Cadastrar Cliente" path="cadastrocliente" name2="Cadastrar Pizza" path2="cadastropizza" name3="Cadastrar Grupo" path3="cadastrogrupo" /> */}

        <div>
          <h2>Cadastro</h2>
        </div>

        <header>
          {/* <div className={"cod-cliente"}>
          <label htmlFor="cod-cliente">Código do Cliente: </label>
          <input type="text" id="cod-cliente" name="cod-cliente" size="5" />
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

          <div className={pageWidth > 530 ? "menu-options" : "menu-mobile"}>
            <Modal
              className={"first"}
              show={pageWidth > 530 ? "Cadastrar Cliente" : <PeopleIcon fontSize="small" />}
              title={"Cadastro de clientes"}
            >
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
            </Modal>
            <Modal
              className={"third"}
              show={pageWidth > 530 ? "Cadastrar Pizza" : <LocalPizzaIcon fontSize="small" />}
              title={"Cadastro de pizza"}
            >
              <CadastroPizza />
            </Modal>
            <Modal
              className={"second"}
              show={pageWidth > 530 ? "Cadastrar Grupo" : <GroupWorkIcon fontSize="small" />}
              title={"Cadastro de grupos"}
            >
              <CadastroGrupo />
            </Modal>
            <Modal
              className={"fourth"}
              show={pageWidth > 530 ? "Cadastrar Bebida" : <LocalBarIcon fontSize="small" />}
              title={"Cadastro de bebidas"}
            >
              <CadastroBebida />
            </Modal>
          </div>
        </header>

        <main>
          {loading ? (
            <div className="loading">
              {isLoading ? (
                <Loading size={30}></Loading>
              ) : (
                <h3>Não há cliente cadastrado ou erro ao conectar ao banco</h3>
              )}
            </div>
          ) : (
            <>
              {clients && clients.length > 0 && (
                <>
                  <strong>Lista de Clientes</strong>
                  <div className="table-scroll">
                    <table className="customers">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Telefone</th>
                          <th>Cep</th>
                          <th>Logradouro</th>
                          <th>Bairro</th>
                          <th>Cidade</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      {clients &&
                        clients.map((cliente, index) => {
                          return (
                            <tbody key={index}>
                              <tr>
                                <td data-label="Nome">{cliente.nome}</td>
                                <td data-label="Telefone">
                                  {cliente.telefone}
                                </td>
                                <td data-label="Cep">{cliente.cep}</td>
                                <td data-label="Logradouro">
                                  {cliente.logradouro}
                                </td>
                                <td data-label="Bairro">{cliente.bairro}</td>
                                <td data-label="Cidade">{cliente.cidade}</td>
                                <td className="button-edit">
                                  <Modal
                                    className={"edit"}
                                    show={<EditIcon fontSize="small" />}
                                    title={"Editar Clientes"}
                                  >
                                    <form
                                      id={"form-customer"}
                                      onSubmit={() => updateClient(cliente)}
                                    >
                                      <div className="form-fields">
                                        <label htmlFor="nome">Nome: </label>
                                        <input
                                          type="text"
                                          id="nome"
                                          name="nome"
                                          value={cliente.nome}
                                          onChange={(e) =>
                                            handleChange(e, index)
                                          }
                                        //{...register("nome", { required: false })}
                                        />

                                        <label htmlFor="telefone">
                                          Telefone:{" "}
                                        </label>
                                        <input
                                          type="number"
                                          id="telefone"
                                          name="telefone"
                                          value={cliente.telefone}
                                          onChange={(e) =>
                                            handleChange(e, index)
                                          }
                                        //{...register("telefone", { required: true })}
                                        />
                                      </div>

                                      <div>
                                        <label htmlFor="cep">Cep: </label>
                                        <input
                                          type="text"
                                          id="cep"
                                          name="cep"
                                          maxLength="9"
                                          value={cliente.cep}
                                          onChange={(e) =>
                                            handleChange(e, index)
                                          }
                                          onBlur={onBlurCep}
                                        />
                                      </div>
                                      <div>
                                        <label htmlFor="logradouro">
                                          Logradouro:{" "}
                                        </label>
                                        <input
                                          type="text"
                                          id="logradouro"
                                          name="logradouro"
                                          size="50"
                                          value={cliente.logradouro}
                                          onChange={(e) =>
                                            handleChange(e, index)
                                          }
                                        />
                                      </div>

                                      <div>
                                        <label htmlFor="bairro">Bairro: </label>
                                        <input
                                          type="text"
                                          id="bairro"
                                          name="bairro"
                                          size="40"
                                          value={cliente.bairro}
                                          onChange={(e) =>
                                            handleChange(e, index)
                                          }
                                        />
                                        <label htmlFor="localidade">
                                          Cidade:{" "}
                                        </label>
                                        <input
                                          type="text"
                                          id="localidade"
                                          name="cidade"
                                          size="40"
                                          value={cliente.cidade}
                                          onChange={(e) =>
                                            handleChange(e, index)
                                          }
                                        />
                                      </div>
                                      <div>
                                        <label htmlFor="observacoes">
                                          Observações:{" "}
                                        </label>
                                        <textarea
                                          name="observacoes"
                                          cols="50"
                                          rows="3"
                                          value={cliente.observacoes}
                                          onChange={(e) =>
                                            handleChange(e, index)
                                          }
                                        ></textarea>
                                      </div>

                                      <input type="submit" value="Salvar" />
                                    </form>
                                  </Modal>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteClient(cliente.codigo_cliente)
                                    }
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          );
                        })}
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </Suspense>
  );
}
