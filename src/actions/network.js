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

export const userLogin = (data) => dispatch => {
  auth.login(data)
    .then((reqData) => {
      //debugger
      console.log(reqData)
      const {status, token, data, msg} = reqData.data;
      

      if(reqData.data.status === 'success') {
        openNotification({type: status, message: upFirstSimbol(status), description: msg})
        localStorage.token = token;
        socket.emit('JOIN', {token: localStorage.token});
        dispatch(dataInit(data));
      } else {
        openNotification({type: status, message: upFirstSimbol(status), description: msg})
        // wake up notice 
      }

    })
    .catch((err) => {
      console.log("Error login: ", err)
    })
}

export const autoLoginWithToken = () => dispatch => {
  auth.checkToken()
    .then((reqData) => {
      const {status, msg,  token, data} = reqData.data
      if(status === 'success') {
        openNotification({type: status, message: upFirstSimbol(status), description: msg})
        localStorage.token = token;
        socket.emit('JOIN', {token: localStorage.token});
        dispatch(dataInit(data));
      } else {
        openNotification({type: status, message: upFirstSimbol(status), description: msg})
        delete localStorage.token
      }
    })
    .catch((er) => {
      console.log('%c%s', 'color: red;font-size:33px;', 'AUTO_LOGIN_ERR:', er)
    })
}
