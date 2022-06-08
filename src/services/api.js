import axios from "axios";

const baseUrl = "http://localhost:3001";
// const api = axios.create({
//   baseURL: "https://disk-california.herokuapp.com/pizza_api",
// });

// const api = axios.create({
//   baseURL: "http://localhost:3001/pizzas",
// });

export default class APIService {
  static getPizzas = async () => {
    const result = await axios.get(`${baseUrl}/pizzas`);
    return result.data;
  };

  static inserirPizza = async (data) => {
    const result = await axios.post(`${baseUrl}/pizzas`, data);
    return result.data;
  };

  static excluirPizza = async (id) => {
    const result = await axios.delete(`${baseUrl}/pizzas/${id}`);
    return result.data;
  };

  static getGrupos = async () => {
    const result = await axios.get(`${baseUrl}/pizzas/grupos`);
    return result.data;
  };

  static cadastrarGrupo = async (dados) => {
    const result = await axios.post(`${baseUrl}/pizzas/grupos`, dados);
    return result.data;
  };

  static excluirGrupo = async (id) => {
    const result = await axios.delete(`${baseUrl}/pizzas/grupos/${id}`);
    return result.data;
  };

  static getBebidas = async () => {
    const result = await axios.get(`${baseUrl}/pizzas/bebidas`);
    return result.data;
  };

  static cadastrarBebida = async (dados) => {
    const result = await axios.post(`${baseUrl}/pizzas/bebidas`, dados);
    return result.data;
  };

  static excluirBebidas = async (id) => {
    const result = await axios.delete(`${baseUrl}/pizzas/bebidas/${id}`);
    return result.data;
  };

  static getClientes = async () => {
    const result = await axios.get(`${baseUrl}/clientes`);
    return result.data;
  };

  static cadastrarCliente = async (dados) => {
    const result = await axios.post(`${baseUrl}/clientes/cadastro`, dados);
    return result.data;
  };

  static atualizarCliente = async (dados) => {
    const payload = {
      codigo_cliente: dados.codigo_cliente,
      nome: dados.nome,
      telefone: dados.telefone,
      cep: dados.cep,
      logradouro: dados.logradouro,
      bairro: dados.bairro,
      cidade: dados.cidade,
      observacoes: dados.observacoes
    }
    const result = await axios.put(`${baseUrl}/clientes`, payload);
    return result.data;
  };

  static excluirCliente = async (id) => {
    const result = await axios.delete(`${baseUrl}/clientes/${id}`);
    return result.data;
  };

  static exibirCaixa = async () => {
    const result = await axios.get(`${baseUrl}/caixa`);
    return result.data;
  };

  static salvarCaixa = async (dados) => {
    const result = await axios.post(`${baseUrl}/caixa`, dados);
    return result.data;
  };

  static excluirRegistro = async (id) => {
    const result = await axios.delete(`${baseUrl}/caixa/${id}`);
    return result.data;
  };

  static excluirTodosRegistros = async () => {
    const result = await axios.delete(`${baseUrl}/caixa/deleteAll`);
    return result.data;
  };
}
