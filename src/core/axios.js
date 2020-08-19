import axios from 'axios'
import store from '../store'

axios.defaults.baseURL = 'http://localhost:4040';
axios.defaults.headers.common['token'] = localStorage.token;

window.axios = axios;

window.sendErrors = (message) => {
  axios.post('/error', {message, data: window.reduxHistory, token: localStorage.token})
    .then(() => console.log(
      '%c%s', 
      'color: mediumseagreen; font-size: 20px;', 
      'Спасибо, что помогаете улучшить софт. Если после перезагрузки ошибка не пройдет, то пишите мне личку'
      ))
  //console.log('SEND_ERROR!')
}
  
export default axios