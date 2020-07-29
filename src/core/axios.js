import axios from 'axios'
import store from '../store'

axios.defaults.baseURL = 'http://localhost:4040';
axios.defaults.headers.common['token'] = window.token;

window.axios = axios;



export default axios