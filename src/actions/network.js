import data from '@/core/data.json'
import {auth} from '@/core/api'
import {socket} from '@/core'
import {openNotification, upFirstSimbol} from '@/utils'


export const setUserData = payload => ({
  type: 'SET_PROJECTS_DATA',
  payload
})

const dataInit = payload => ({
  type: 'INIT',
  payload
})

export const fetchUserData = () => dispatch => {
  debugger
  new Promise((resolve, reject) => {
    try {
     let objData = JSON.parse(data);
     resolve(objData)
     //
    } catch(err) {
      reject(false)
      console.log('Error parse data json')
    }
  })
  .then(data => dispatch(setUserData(data)))
}

const effecter = ({status, token, data, msg}, isTokenLogin = false) => dispatch => {
  if(status === 'success') {
    openNotification({type: status, message: upFirstSimbol(status), description: msg})
    localStorage.token = token;
    socket.emit('JOIN', {token: localStorage.token});
    dispatch(dataInit(data));
  } else {
    openNotification({type: status, message: upFirstSimbol(status), description: msg})
    isTokenLogin && delete localStorage.token // wake up notice 
  }
}

export const userLogin = (data) => dispatch => {
  console.log("STAAART")
  auth.login(data)
    .then((reqData) => {
      console.log('REQ_')
      effecter(reqData.data)(dispatch)
    })
    .catch((err) => {
      console.log('%c%s', 'color: red; font-size: 25px;',"Error login: ", err)
    })
}

export const createUser = data => dispatch => {
  console.log('CREATE_ALIVE')
  auth.register(data)
    .then((reqData) => {
      effecter(reqData.data)(dispatch)
      // const {status, token, data, msg} = reqData.data;

      // if(status === 'success') {
      //   openNotification({type: status, message: upFirstSimbol(status), description: msg})
      //   localStorage.token = token;
      //   socket.emit('JOIN', {token: localStorage.token});
      //   dispatch(dataInit(data));
      // } else {
      //   openNotification({type: status, message: upFirstSimbol(status), description: msg})
      // }
    })
    .catch(err => {
      console.log('%c%s', 'color: red; font-size: 25px;', "Error createUser: ", err)
    })
}

export const autoLoginWithToken = () => dispatch => {
  auth.checkToken()
    .then((reqData) => {
      effecter(reqData.data, true)(dispatch)
      // const {status, msg,  token, data} = reqData.data
      // if(status === 'success') {
      //   openNotification({type: status, message: upFirstSimbol(status), description: msg})
      //   localStorage.token = token;
      //   socket.emit('JOIN', {token: localStorage.token});
      //   dispatch(dataInit(data));
      // } else {
      //   openNotification({type: status, message: upFirstSimbol(status), description: msg})
      //   delete localStorage.token
      // }
    })
    .catch((er) => {
      console.log('%c%s', 'color: red;font-size:33px;', 'AUTO_LOGIN_ERR:', er)
    })
}
