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

  static getGrupos = async () => {
    const result = await axios.get(`${baseUrl}/pizzas/grupos`);
    return result.data;
  };

  static getBebidas = async () => {
    const result = await axios.get(`${baseUrl}/pizzas/bebidas`);
    return result.data;
  };
}
