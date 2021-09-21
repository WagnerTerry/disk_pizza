import axios from 'axios'

const api = axios.create({
    baseURL: 'https://disk-california.herokuapp.com/pizza_api'
})

export default api