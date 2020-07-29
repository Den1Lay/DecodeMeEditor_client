import io from 'socket.io-client'
import store from '@/store';

const socket = io('http://localhost:4040', {
});


socket.on('connect', () => {
  console.log('%c%s', 'color: green; font-size: 23px', "REAL_SOCKET_CONNECT")
  //console.log(localStorage.token)
  let realToken = localStorage.token;
  realToken && socket.emit('JOIN', {token: realToken});
  socket.on('FORB', () => {
    console.log('%c%s', 'color: pink; font-size: 18px;', 'FORBIDDEN');
    delete localStorage.token
  })
});

socket.on('FORBIDDEN', () => {
  console.log('%c%s', 'color: darkred; font-size: 22px;', 'GET_FORBIDDEN')
})

let lastV = null;

// if(!localStorage.token && ) {
//   socket.disconnect()
// }
store.subscribe(() => {
  let debagState = store.getState();
  if(lastV !== debagState.main.workBranch.v) {
    console.log('%c%s', 'color: royalblue; font-size: 22px;', "DEBUG_STATE",debagState );
    
    let token = localStorage.token;
    let pcd = debagState.main.projectsCoordsData;
    let v = debagState.main.workBranch.v;
    let person = debagState.main.workPerson;
    let project = debagState.main.projects ? debagState.main.projects[0] : null;
    let workPCD = debagState.main.workPCD
    switch(v[0]) {
      case 'c': 
      //coord change handl;
      socket.emit('UPDATE_PCD', {
        token, pcd, person
      })
      break;
      case 'p':
      // exist project change handl
      socket.emit('UPDATE_PROJECTS', {
        token, pcd, workVersion: (() => {
          let {projects, workBranch: {projectId, workVersion}} = debagState;

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
      socket.emit('NEW_PROJECT', {
        token, project, pcd
      })
      break;
      case 'v': 
      // new version handl
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
