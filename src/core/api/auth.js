import axios from '../axios'

export default {
  login: (data) => axios.post('/auth/login', data),
  register: (data) => axios.post('/auth/register', data),
  checkToken: () => axios.post('/auth/check')
}
