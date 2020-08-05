import io from 'socket.io-client'
import store from '@/store';
import {updateUsers, updateApplicantList, addFriend, accessControl} from '@/actions'

import {openNotification} from '@/utils'
import operNotification from '../utils/notification';

const socket = io('http://localhost:4040', {
  transports: ['polling']
}); 

socket
  .on('connect', () => {
    console.log('%c%s', 'color: green; font-size: 23px', "REAL_SOCKET_CONNECT")
    //console.log(localStorage.token)
    let realToken = localStorage.token;
    realToken && socket.emit('JOIN', {token: realToken});
    socket.on('FORB', () => {
      console.log('%c%s', 'color: pink; font-size: 18px;', 'FORBIDDEN');
      delete localStorage.token
    })
  })
  // РАБОТКА)))ы
  .on('FORBIDDEN', () => {
    console.log('%c%s', 'color: darkred; font-size: 22px;', 'GET_FORBIDDEN')
  })
  .on('VERSION_UPDATE', (pass) => {
    console.log('GG_WP')
    console.log('%c%s','color: indigo; font-size: 22px;','VERSION_UPDATE_PASS: ', pass)
  })
  .on('NEW_VERSION', pass => {
    console.log('%c%s', 'color: goldenrod; font-size: 22px;', 'NEW_VERSION_YOU_PROJECT', pass)
  })
  // ACCESS ZONE
  // существует критический баг, при изменении all доступа со стороны выбираемой персоны, во время пиков
  // теоретически решается хардкодом. Создание новых обработчиков или добавление аргументов к нижним... 
  .on('NEW_ACCESS', pass => {
    
    store.dispatch(accessControl({event: 'NEW', pass}))
    //console.log('%c%s', 'color: forestgreen; font-size: 22px;', 'GET_SHOW_ACCESS', pass)
  })
  .on('NEW_SUPER_ACCESS', pass => {
    openNotification({type: 'success', message: "New super access", description: `From ${pass.nickName}`})
    store.dispatch(accessControl({event: 'NEW_SUPER', pass}))
    //console.log('%c%s', 'color: forestgreen; font-size: 22px;', 'GET_SUPER_ACCESS', pass)
  })
  .on('KICK', pass => {
    
    store.dispatch(accessControl({event: 'KICK', pass}))
  })
  .on('SUPER_KICK', pass => {

    store.dispatch(accessControl({event: 'SUPER_KICK', pass}))
  })
  // FRIEND EVENTS ZONE
  .on('FRIEND_REQUEST', ({user}) => {
    console.log('%c%s', 'color: aqua; font-size: 22px', 'FRIEND_REQUEST:', user)
    openNotification({type: 'info', message: 'New request to friend'})
    store.dispatch(updateApplicantList(user))
    // openNotification by antd 
  })
  .on('ACCEPT_REQUEST', ({user}) => { // like callback from click in social
    console.log('%c%s', 'color: deeporange; font-size: 22px', 'ACCEPT_REQUEST:', user);
    store.dispatch(addFriend(user))
  })
  .on('NEW_FRIEND', ({user}) => { // response on click "ADD_TO_COMPADRE"
    console.log('%c%s', 'color: navy; font-size: 22px', 'NEW_FRIEND:', user);
    openNotification({type: 'success', message: 'Accept request', description: `New friend: ${user.userData.nickName}`})
    store.dispatch(addFriend(user));
    
  })
let lastV = null;

// if(!localStorage.token && ) {
//   socket.disconnect()
// }
store.subscribe(() => {
  let freshState = store.getState();
  // if(freshState.main.users == false) {
  //   socket.emit('GET_USERS', ({users}) => {
  //     store.dispatch(updateUsers(users));
  //   })
  // }
  if(lastV !== freshState.main.workBranch.v) {
    console.log('%c%s', 'color: royalblue; font-size: 22px;', "DEBUG_STATE: ",freshState );
    let {main:{projectsCoordsData: pcd, workBranch: {v}, workPerson: person, workPCD, projects, personObj}} = freshState
    let token = localStorage.token;
    let project = freshState.main.projects ? freshState.main.projects[0] : null;
    let myLastProject = personObj.userData.myLastProject
    switch(v[0]) {
      case 'c': 
      debugger
      //coord change handl;
      socket.emit('UPDATE_PCD', {
        token, pcd, person, 
        lastProject: workPCD.projectId, 
        myLastProject,
        friends: personObj.userData.friends
      })
      break;
      case 'p':
      // exist project change handl
      socket.emit('UPDATE_PROJECTS', {
        token, pcd, workVersion: (() => {
          debugger
          let {projects, workPCD: {projectId, workVersion}} = freshState.main;

          let projectInd;
          for(let i in projects) {
            if(projects[i].superId === projectId){
              projectInd = i;
            }
          }
          let versionInd;
          for(let i in projects[projectInd].versions) {
            if(projects[projectInd].versions[i].superId === workVersion) {
              versionInd = i;
            }
          }
          return projects[projectInd].versions[versionInd].data;
        })(),
        projectId: workPCD.projectId,
        versionId: workPCD.workVersion,
        person
      })
      break;
      case 'n': 
      // new project handl
      // Доведи дело с access до конца..
      socket.emit('NEW_PROJECT', {
        token, project, pcd, myLastProject
      })
      break;
      case 'v': 
      // new version handl
      (() => {
        let {workVersion, projectId} = workPCD;
        socket.emit('NEW_VERSION', {
          token, pcd, person, 
          projectId,
          versionId: workVersion,
          workVersion: (() => {
            
            let projectInd;
            for(let i in projects) {
              if(projects[i].superId === projectId) {
                projectInd = i;
              }
            }
            // НЕВЕРОЯТНО РЕДКИЙ БАГ МОЖЕТ ОТПРАВИТЬ ЧУЖУЮ ВЕРСИЮ, КАК ТВОЮ...
            let versionInd;
            for(let i in projects[projectInd].versions) {
              if(projects[projectInd].versions[i].superId === workVersion) {
                versionInd = i;
              }
            }

            return projects[projectInd].versions[versionInd];
          })()
        })
      })()
      break;
      case 's':
      //SETUP worker
      (() => {
        const {kicked, superKicked, newObservers, newEditord} = freshState.main;
        let projectInd;
        for(let i in projects) {
          if(projects[i].superId === workPCD.projectId) {
            projectInd = i;
          }
        };
        const {name, description, access, superAccess} = projects[projectInd];
        socket.emit('SETUP_PROJECT', {
          token,
          projectData: {name, description, access, superAccess},
          projectId: workPCD.projectId,
          kicked,
          superKicked,
          newObservers,
          newEditord
        })
      })()
      break;
      case 'f':
      (() => {

      })()
      break;
      default: 
      debugger
      console.log('%c%s', 'color: red; font-size: 33px;', 'UNEXPECTED V:', v)
      //err handl
    }
    lastV = v;
  }
  
})


export default socket
