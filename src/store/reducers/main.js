import {format, startOfWeek} from 'date-fns';
import {v4} from 'uuid'
import FastClone from 'fastest-clone'

const projectsCoordData = [
  {
    projectId: 'uuid11',
    workVersion: "uuid12",
    "uuid12": {
      path: "0",
      height: 0
    }
  }
]
// просто манекены..
// обновлять персон обжект здесь или получать новый с сервера... (я беру с сервера..) ..почистить код
const projects = [{
  name: "QWE",  
  description: "QWE",
  superId: 'uuidentificator',
  lastVersion: 0, //proj v || wb v
  versions: [{
  comment: 'Init',
  date: format(new Date(), "yyyy-MM-dd"),
  superId: 'uuid12',
  data: {
    pos: "0",
    branch: {
    branchDirection: '',
    base: [{
      coord: {
        path: "0",
        height: 0
      },
      label: '',
      main: '',
      comment: '',
      picture: {
        src: null,
        alt: ''
      }
    }],
    question: false,
    choseCount: 0,
    }
  }
}]}]

const defState = {
  projectsCoordsData: [], // набор джентельмена
  projects: false,
  workPerson: null,
  workPCD: null,
  workBranch: null,
  // currentBranch: "0",
  // currentProject: 0,
  // currentVersion: 0,
  // currentHeight: 0,
  // workProject: 0,
  users: [], // all exist users
  personObj: null, // Всегда можно найти себя по этому адресу..
  friends: [],
  mainPlace: 'editor', // project save
}
let date = format(new Date(), "yyyy-MM-dd"); 
export default (state = defState, action) => {
  const {type, payload, random} = action;
  function updatPersonObj() {
    if(state.workPerson === state.personObj.userData.superId) {
      state.personObj.projects = state.projects;
      state.personObj.projectsCoordsData = state.projectsCoordsData;
    }
  }
  switch(type) {
  
    case 'ADD_PROJECT': //wb.v
      return (() => {
        debugger
        const {name, description, access, superAccess} = payload
        state.projects.unshift({
          name,  
          description,
          superId: v4(), 
          access,
          superAccess,
          versions: [{
          comment: 'Init',
          date,
          superId: v4(),
          data: {
            pos: "0",
            branch: {
            branchDirection: '',
            base: [{
              coord: {
                path: "0",
                height: "0"
              },
              label: '',
              main: '',
              comment: '',
              picture: {
                src: null,
                alt: ''
              }
            }],
            question: false,
            choseCount: 0,
            }
          }
        }]});
        let firstVSId = state.projects[0].versions[0].superId;
        state.workPCD = {
          projectId: state.projects[0].superId,
          workVersion: firstVSId,
          [firstVSId]: {
            path: "0",
            height: "0"
          }
        };
        state.projectsCoordsData = [state.workPCD].concat(state.projectsCoordsData);
        state.workBranch = state.projects[0].versions[0].data;
        state.personObj.userData.myLastProject = state.projects[0].superId;
        state.mainPlace = 'editor';
        state.workBranch.v = 'n'+random;

        //ТОТ САМЫЙ ОТДЕЛЬНЫЙ ХЕНДЛЕР
        //updatPersonObj()
          return {
            ...state,
          }
      })();
    case 'SETUP_PROJECT':
      debugger
      return (() => {
        console.log(payload)
        const {name, description, access, superAccess} = payload

        let projectInd;
        for(let i in state.projects) {
          if(state.projects[i].superId === state.workPCD.projectId) {
            projectInd = i;
          }
        };
        function checkId(source, target, store) {
          source.forEach(id => {
            if(!target.includes(id)) {
              store.push(id)
            }
          })
        }
        let kicked = [];
        let superKicked = [];
        let newObservers = [];
        let newEditord = [];
        checkId(state.projects[projectInd].access, access, kicked);
        checkId(state.projects[projectInd].superAccess, superAccess, superKicked);
        checkId(access, state.projects[projectInd].access, newObservers);
        checkId(superAccess, state.projects[projectInd].superAccess, newEditord);
       
        state.projects[projectInd] = {...state.projects[projectInd], name, description, access, superAccess};
        state.workBranch.v = 's'+random;
        state.mainPlace = 'editor';

        return {
          ...state,
          kicked,
          superKicked,
          newObservers,
          newEditord
        }
      })()
    case 'OPEN_PLACE': 
      return {
        ...state,
        mainPlace: payload
      }
    // case 'OPEN_PROJECT_CREATOR': 
    //   return {
    //     ...state,
    //     mainPlace: 'project'
    //   }
    // case 'OPEN_VERSIONS_EDITOR':  //openVersionsEditor
    //   return {
    //     ...state,
    //     mainPlace: 'version'
    //   }
    // case 'OPEN_PROJECT_SETUP': 
    //   return {
    //     ...state, 
    //     mainPlace: 'setup'
    //   }
    case 'ADD_VERSION':
    // допилить кода сюда и коммитнуть
    return (() => {
      // пройдись с дебагером тут
      // debugger
      // delete state.workBranch;

      //DEBAG SPACE
      let testObj = {txt: "yes", obj: {insTxt: "insTxt"}, arr: ['super']};
      let cloneFactory = FastClone.factory(testObj);
      let testObjClone = cloneFactory(testObj)
      //DEBAG SPACE

      let projectInd;
      state.projects.forEach(({superId}, i) => {
        if(state.workPCD.projectId === superId) {
          projectInd = i;
        }
      });
      let versionInd;
      state.projects[projectInd].versions.forEach(({superId}, i) => {
        if(state.workPCD.workVersion === superId) {
          versionInd = i
        }
      })
      // DATA EXAMPLE IS LAST VERSION;
      let dataExample = state.projects[projectInd].versions[versionInd].data;

      let DataFactory = FastClone.factory(dataExample);
      let dataClone = new DataFactory(dataExample);
      // debugger
      let newVersionInd = v4();
      state.projects[projectInd].versions.push({
        comment: payload.comment,
        date,
        superId: newVersionInd,
        data: dataClone
      });

      let PCDInd;
      state.projectsCoordsData.forEach(({projectId}, i) => {
        if(state.workPCD.projectId === projectId) {
          PCDInd = i;
        }
      });
      
      let PCDFactory = FastClone.factory(state.workPCD[state.workPCD.workVersion]);
      
      state.projectsCoordsData[PCDInd][newVersionInd] = new PCDFactory(state.workPCD[state.workPCD.workVersion]); // точечное копирование???
      state.projectsCoordsData[PCDInd].workVersion = newVersionInd;
      
      //delete state.workPCD;
      state.workPCD = state.projectsCoordsData[PCDInd];

      let newWorkBranch = state.projects[projectInd].versions[state.projects[projectInd].versions.length-1].data; 
      let path = state.workPCD[state.workPCD.workVersion].path.substring(1);
      while(path.length) {
        newWorkBranch = newWorkBranch.branch['q'+path[0]];
        path = path.substring(1);
      };

      newWorkBranch.v = 'v'+random
      return {
        ...state,
        workBranch: newWorkBranch,
        mainPlace: 'editor'
      }
    })()
    case 'SAVE_POD': //wb.v
   
    return (() => {
      
      console.log('PAYLOD:', payload);
      const {data: {label, mainPart, comment, artsDesription, branchDirection, answers}, selectedType} = payload;
      
      let realWorkBranch = state.workBranch.branch;
      let currentHeight = state.workPCD[state.workPCD.workVersion].height;

      const updatePod = () => {
        realWorkBranch.base[currentHeight] = {
          coord: {
            path: state.workBranch.pos,
            height: currentHeight
          },
          label,
          main: mainPart,
          comment,
          picture: {
            src: null,
            alt: artsDesription
          }
        }
      };

      const updateAnswers = () => {
        debugger
        answers.forEach(({content, key, ref}) => {
          console.log(typeof key)
          realWorkBranch['q'+key] = {
            ans: content,
            pos: state.workBranch.pos+key,
            branch: {
              branchDirection: '',
              base: [
                {
                  coord: {
                    path: state.workBranch.pos+key,
                    height: "0"
                  },
                  label: '',
                  main: '',
                  comment: '',
                  picture: {
                    src: null,
                    alt: ''
                  }
                }
              ], // сделать красиво
              question: false,
              choseCount: 0,
              ref: ref.length === 0 ? false : ref,
              }
          }
        });
        realWorkBranch.choseCount = answers.length;
        realWorkBranch.question = {
          coord: {
            path: state.workBranch.pos,
            height: 'question'
          },
          label,
          main: mainPart,
          comment,
          picture: {
            src: null,
            alt: artsDesription
          }
        };
      }
      
      // первые 3 случая более чем реальны!
      if(selectedType === "0" && currentHeight !== 'question') {
        //обновить ПОД по рабочей высоте
        updatePod()
      } else if(selectedType === "1" && currentHeight === 'question') {
        // обновить вопрос и ответы 
        updateAnswers()
      } else if(selectedType === "1" && currentHeight !== 'question') {
        updateAnswers()
        debugger
        if(currentHeight < (realWorkBranch.base.length-1)) {
          // Добавить уведомления о том, что поды были перемещены по нулевому ответу
          let zeroBase = realWorkBranch.base.splice(currentHeight+1);
          // переписать адресы подов в соответсвтующие
          realWorkBranch['q0'].branch.base = zeroBase.map((el, i) => {
            return {
              ...el,
              coord: {path: el.coord.path+"0", height: i}
            }
          });
        }
        realWorkBranch.base.splice(currentHeight, 1);
        state.workPCD[state.workPCD.workVersion].height = 'question';
        
        //обновить вопрос и ответы, а так же ликвидировать ПОД по высоте
      } else if(selectedType === "0" && currentHeight === 'question') {
        let realWorkBranch = state.workBranch.branch;
        realWorkBranch.base = [...realWorkBranch.base, {
          coord: {
            path: state.workBranch.pos,
            height: realWorkBranch.base.length
          },
          label,
          main: mainPart,
          comment,
          picture: {
            src: null,
            alt: artsDesription,
          }
        }]
        state.workPCD[state.workPCD.workVersion].height = realWorkBranch.base.length-1;
        
        for(let i = 0; i < realWorkBranch.choseCount; i++) {
          delete realWorkBranch['q'+i+''];
        }
        realWorkBranch.choseCount = 0;
        realWorkBranch.question = false;
        //опасный момент. Оставлю на последок.
        //создать ПОД по максимальной высоте и ликвидировать вопрос с ответами.
      }
      state.workBranch.branch.branchDirection = branchDirection;
      state.workBranch.v = 'p'+random; // события по обработчику
      return {
        ...state
      }
    })();

    case 'CHANGE_BRANCH': //wb.v--
    //payload = 0
    
    return (() => {
      if(payload === 'back') {
        let path = state.workPCD[state.workPCD.workVersion].path;
        state.workPCD[state.workPCD.workVersion].path = path.substring(0, path.length-1);
        state.workPCD[state.workPCD.workVersion].height = "question";
        
        let projectInd;
        for(let i in state.projects) {
          if(state.workPCD.projectId === state.projects[i].superId) {
            projectInd = i;
          }
        };
        let versionInd;
        for(let i in state.projects[projectInd].versions) {
          if(state.workPCD.workVersion === state.projects[projectInd].versions[i].superId) {
            versionInd = i;
          }
        }
        state.workBranch = state.projects[projectInd].versions[versionInd].data;
        let workPath = state.workPCD[state.workPCD.workVersion].path.substring(1);
        while(workPath) {
          state.workBranch = state.workBranch.branch['q'+workPath[0]];
          workPath = workPath.substring(1);
        };
        if(state.workBranch.branch.base.length) {
          state.workPCD[state.workPCD.workVersion].height = '0'
        }

      } else {
        state.workBranch = state.workBranch.branch['q'+payload];
        state.workPCD[state.workPCD.workVersion].path = state.workPCD[state.workPCD.workVersion].path+payload;
        state.workPCD[state.workPCD.workVersion].height = "question";
        if(state.workBranch.branch.base.length) {
          state.workPCD[state.workPCD.workVersion].height = "0";
        }
        
      }
      
      state.workBranch.v = 'c'+random;
      return {
        ...state
      }
    })();
    case 'ADD_POD': //wb.v
    return (() => {
      
      console.log(payload)
        // создание нового элемента и переадресация процесса на него
        let realWorkBranch = state.workBranch.branch;
        if(payload !== 'question') {
          let firstPart = realWorkBranch.base.slice(0, +payload+1);
          let secondPart = realWorkBranch.base.slice(+payload+1);
          realWorkBranch.base = [...firstPart, {
            coord: {
              path: state.workBranch.pos,
              height: +payload+1
            },
            label: '',
            main: '',
            comment: '',
            picture: {
              src: null,
              alt: ''
            }
          }].concat(secondPart.map((data) => {
            const {path, height} = data.coord
            return {...data, coord: {path, height: +height+1}}
          }));
          state.workPCD[state.workPCD.workVersion].height = +payload+1;
      } else {
          realWorkBranch.base = [...realWorkBranch.base, {
            coord: {
              path: state.workBranch.pos,
              height: realWorkBranch.base.length
            },
            label: '',
            main: '',
            comment: '',
            picture: {
              src: null,
              alt: ''
            }
          }];
          state.workPCD[state.workPCD.workVersion].height = realWorkBranch.base.length-1;
        }
        
        state.workBranch.v = 'p'+random;
      return {
        ...state
      }
    })()
    case 'CHOOSE_POD': 
    return (() => {
      state.workPCD[state.workPCD.workVersion].height = payload;
      state.mainPlace = 'editor';
      state.workBranch.v = 'c'+random
      return {
        ...state
      }
    })()
    case "DELETE_POD": //wb.v
    return (() => {
      
      console.log(payload)
      let realWorkBranch = state.workBranch.branch;
      let newCurrentHeight;
      if(payload === 'question') {
        for(let i = 0; i < realWorkBranch.choseCount; i++) {
          delete realWorkBranch['q'+i]
        }
        realWorkBranch.choseCount = 0;
        realWorkBranch.question = false;
        newCurrentHeight = realWorkBranch.base.length-1;
      } else {
        realWorkBranch.base.splice(payload, 1);
        realWorkBranch.base = realWorkBranch.base.map((el, i) => ({...el, coord: {...el.coord, height: i}}))
        
        if((realWorkBranch.base.length-1) >= payload) {
          newCurrentHeight = payload;
        } else {
          newCurrentHeight = payload-1;
        }
      }
      state.workPCD[state.workPCD.workVersion].height = newCurrentHeight;
      state.workBranch.v = 'p'+random;
      return {
        ...state
      }
    })()
    case 'SELECT_PROJECT': 
    console.log(payload)
    return (() => {
      if(state.personObj.userData.superId !== state.workPerson) {
        let workFriendInd;
        for(let i in state.personObj.userData.friends) {
          if(state.personObj.userData.friends[i].superId === state.workPerson) {
            workFriendInd = i;
          }
        };
        state.personObj.userData.friends[workFriendInd].lastProject = payload;
      } else {
        state.personObj.userData.myLastProject = payload;
      };

      let PCDInd;
      state.projectsCoordsData.forEach(({projectId}, i) => {
        if(payload === projectId) {
          PCDInd = i;
        }
      });

      let projectInd;
      state.projects.forEach(({superId}, i) => {
        if(payload === superId) {
          projectInd = i;
        }
      })
      if(PCDInd === undefined) { // работает при пике проекта у друга
        // add new project in PCD;
        let firstVersionId = state.projects[projectInd].versions[0].superId;
        let workHeight = state.projects[projectInd].versions[0].data.branch.base.length ? "0" : "question";
        state.projectsCoordsData.push({projectId: payload, workVersion: firstVersionId, [firstVersionId]: {path: "0", height: workHeight}})
        PCDInd = state.projectsCoordsData.length-1;
      }

      state.workPCD = state.projectsCoordsData[PCDInd]; 
      let versionInd;
      for(let i in state.projects[projectInd].versions) {
        if(state.projects[projectInd].versions[i].superId === state.workPCD.workVersion) {
          versionInd = i;
        }
      };
      state.workBranch = state.projects[projectInd].versions[versionInd].data;
  
      let workPath = state.workPCD[state.workPCD.workVersion].path.substring();
      workPath = workPath.substring(1);
      while (workPath.length) {
        state.workBranch = state.workBranch.branch['q'+workPath[0]];
        workPath = workPath.substring(1);
      };
      state.workBranch.v = 'c'+random;
      return {
        ...state,
      }
    })()
    case 'SELECT_VERSION': 
    return (() => {
      console.log('payload');
      state.workPCD.workVersion = payload;

      let projectInd;
      for(let i in state.projects) {
        if(state.projects[i].superId === state.workPCD.projectId) {
          projectInd = i
        }
      }

      let versionInd;
      for(let i in state.projects[projectInd].versions) {
        if(payload === state.projects[projectInd].versions[i].superId) {
          versionInd = i;
        }
      };

      state.workBranch = state.projects[projectInd].versions[versionInd].data;
      let path = state.workPCD[payload].path.substring(1);
      while(path.length) {
        state.workBranch = state.workBranch.branch['q'+path[0]];
        path = path.substring(1);
      }
      state.workBranch.v = 'c'+random
      return {
        ...state
      }
    })();
    case 'NEW_FRIEND_REQUEST': 
    return (() => {
      //payload = user || obj.userData
      state.personObj.userData.addToComrade.push(payload);
      return {
        ...state
      }
    })()
    case 'PREVIEW_PERSON': 
    return (() => {
      console.log("PREVIEW_PERSON: ", payload) 
         // payload = {userData, projects, }
      const {projects, userData} = payload;
      state.projects = projects;
      state.workPerson = userData.superId;
      state.workBranch = projects[0].versions[0].data;
      let versionId = projects[0].versions[0].superId;
      state.workPCD = {
        projectId: projects[0].superId, 
        workVersion: versionId,
        [versionId]: {path: "0", height: "0"}
      }
   
      return state
    })()
    case 'CHOOSE_PERSON':
      // будут ли происходить изменения в друзьях при модифировании 
      return (() => {
        //payload === superId [friend]
        // ОБРАБОТАТЬ ВСЕ ИСКЛЮЧЕНИЯ...
        let friendInd;
        for(let i in state.friends) {
          if(state.friends[i].userData.superId === payload) {
            friendInd = i;
          }
        }
        state.projects = state.friends[friendInd].projects;

        let deepFriendInd;
        for(let i in state.personObj.userData.friends) {
          if(state.personObj.userData.friends[i].superId === payload) {
            deepFriendInd = i;
          }
        }
        // friends last project....
        let lastMyProjectInFriend = state.personObj.userData.friends[deepFriendInd].lastProject;
        if(lastMyProjectInFriend !== null) {
          // чекнуть исключения на удаленный проект
          let PCDInd;
          for(let i in state.projectsCoordsData) {
            if(state.projectsCoordsData[i].projectId === lastMyProjectInFriend) {
              PCDInd = i;
            }
          };

          state.workPCD = state.projectsCoordData[PCDInd];

          let projectInd; 
          for(let i in state.projects) {
            if(state.projects[i].superId === state.workPCD.projectId) {
              projectInd = i;
            }
          };

          let versionInd;
          for(let i in state.projects[projectInd].versions) {
            if(state.projects[projectInd].versions[i] === state.workPCD.workVersion) {
              versionInd = i;
            }
          }
          state.workBranch = state.projects[projectInd].versions[versionInd].data;

        } else {
          state.workPCD = null;
          state.workBranch.branch = {};
          state.mainPlace = 'choose'
        }
        state.workPerson = payload;
        state.workBranch.v = 'f'+random;
        return {
          ...state
        }
      })()
    case 'INIT':
      return (() => {
        // РЕВОРК ! (пробелема с пустыми данными...)
        // РЕФАКТОРИИИНГ  !!!!! !! ! (хотя бы до первого деплоя)
        console.log('%c%s', 'color: pink; font-size: 22px', "DEBUG:", payload)
        const {friends, personObj: {projects, projectsCoordsData, lastProject, lastPerson, userData: {superId}}} = payload;
        state.personObj = payload.personObj
        //state.projects = projects;
        state.projectsCoordsData = state.personObj.projectsCoordsData;
        state.friends = friends
        // Всегда можно найти себя по этому адресу..
        //state.currentProject = lastProject;
        state.workBranch = {};
      
        let projectsCoordInd = null;
          for(let x=0;x<projectsCoordsData.length;x++) {
            if(projectsCoordsData[x].projectId === lastProject) {
              projectsCoordInd = x;
            }
          }

        if(lastPerson === superId) {
          ///
          state.projects = state.personObj.projects
          ///
          let lockInd = null;
          for(let i=0;i<projects.length;i++) {
            if(projects[i].superId === lastProject) {
              lockInd = i;
            }
          }
          if(projectsCoordInd !== null) {
            // Уже есть проект 
            let pcd = projectsCoordsData[projectsCoordInd];
            let version = pcd.workVersion;
            let {path, height} = pcd[version];

            let versionInd;
            for(let i in state.projects[lockInd].versions) {
              if(version === state.projects[lockInd].versions[i].superId) {
                versionInd = i;
              }
            }

            state.workBranch = state.projects[lockInd].versions[versionInd].data;

            path = path.substring(1);
            while(path.length) {
              state.workBranch = state.workBranch.branch['q'+path[0]];
              path = path.substring(1);
            }
            state.workPCD = state.projectsCoordsData[projectsCoordInd];
            //state.workVersion = workVersion;
            state.workPerson = superId;
            //state.currentHeight = height;
          } else {
            // еще нет проектов 
            state.workPCD = null
            state.workBranch.branch = {};
            state.workPerson = superId;
            state.mainPlace = 'beginner'
          }
        } else {
          // поиск проекта и метаданных у другого персонажа
          // можно добавлять в друзья, если есть хотя бы один проект
          // ДОДЕЛАТЬ С ДЕБАГЕРОМ...

          // ЧТО ЕСЛИ У ЧЕЛА НЕТ ПРОЕКТОВ????
          // ЗАСЕЙВИТЬ ГДЕ ТО данные персон обjecta;;
          // все норм, только нужно хендлить пустые проекты 
          state.workPerson = lastPerson; // прокинут ийди человечка

          let friendInd = null;
          friends.forEach(({userData: {superId}}, i) => {
            if(lastPerson === superId) {
              friendInd = i;
            }
          })
          state.projects = state.friends[friendInd]; /// прокинуты проекты

          let projectInd;
          state.projects.forEach(({superId}, i) => {
            if(lastProject === superId) {
              projectInd = i;
            }
          })
          
          // let PCDInd;
          // state.projectsCoordData.forEach(({projectId}, i) => {
          //   if(lastProject === projectId) {
          //     PCDInd = i;
          //   }
          // });

          state.workPCD = state.projectsCoordData[projectsCoordInd]; // прокинуты workPCD

          let versionInd;
          state.projects[projectInd].forEach(({superId}, i) => {
            if(superId === state.workPCD.workVersion) {
              versionInd = i;
            }
          })
          
          state.workBranch = state.projects[projectInd].versions[versionInd].data  // прокинут ворк бренч.
          let path = state.workPCD[state.workPCD.workVersion].path.substring(1);

          while(path.length) {
            state.workBranch = state.workBranch.branch['q'+path[0]];
            path = path.substring(1);
          }
          
          // for(let k=0;k<friends.length;k++) {
          //   if(friends[k])
          // }
        }
        state.workBranch.v = Math.random();
        return {
          ...state
        }
      })()
    default:
      return state;
  }
}