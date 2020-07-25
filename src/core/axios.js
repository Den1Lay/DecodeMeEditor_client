import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:4040';
axios.defaults.headers.common['token'] = window.token;

window.axios = axios

export default axios