import axios from "axios";

// const api = axios.create({
//   baseURL: "https://disk-california.herokuapp.com/pizza_api",
// });

const api = axios.create({
  baseURL: "http://localhost:3001/pizzas",
});

export default api;
