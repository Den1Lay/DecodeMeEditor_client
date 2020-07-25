import data from '@/core/data.json'
import {auth} from '@/core/api'

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
      const {status, token, data} = reqData.data
      if(reqData.data.status === 'success') {
        localStorage.token = token;
        dispatch(dataInit(data));
      } else {
        // wake up notice 
      }

    })
    .catch((err) => {
      console.log("Error login: ", err)
    })
}
