import axios from "axios";

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

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

  static getGrupos = async () => {
    const result = await axios.get(`${baseUrl}/pizzas/grupos`);
    return result.data;
  };

  static getBebidas = async () => {
    const result = await axios.get(`${baseUrl}/pizzas/bebidas`);
    return result.data;
  };

  static cadastrarCliente = async (dados) => {
    const result = await axios.post(`${baseUrl}/clientes/cadastro`, dados);
    return result.data;
  };
}
