import {format} from 'date-fns';
import {v4} from 'uuid'

const projectsCoordData = [
  {
    projectId: 'uuid11',
    workVersion: "0",
    0: {
      path: "0",
      height: 0
    }
  }
]

const projects = [{
  name: "QWE",  
  description: "QWE",
  superId: 'uuidentificator',
  lastVersion: 0, //proj v || wb v
  versions: [{
  comment: 'Init',
  date: format(new Date(), "yyyy-MM-dd"),
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
  projectsCoordsData: false,
  projects: false,
  //currentBranch: "0",
  //currentProject: 0,
  // currentVersion: 0,
  // currentHeight: 0,
  // workProject: 0,
  workPerson: null,
  workPCD: null,
  workBranch: null,
  friends: [],
  mainPlace: 'editor', // project save
}
let date = format(new Date(), "yyyy-MM-dd"); 
export default (state = defState, action) => {
  const {type, payload, random} = action
  switch(type) {
  
    case 'ADD_PROJECT': 
    const {name, description} = payload
    let projects = [{
      name,  
      description,
      superId: v4(), 
      versions: [{
      comment: 'Init',
      date,
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
    }]}].concat(...state.projects);
    state.workPCD = {
      projectId: projects[0].superId,
      workVersion: "0",
      0: {
        path: "0",
        height: 0
      }
    };
    state.projectsCoordsData = [state.workPCD].concat(state.projectsCoordsData);
      return {
        ...state,
        projects,
        workBranch: projects[0].versions[0].data,
        mainPlace: 'editor'
      }
    case 'OPEN_PROJECT_CREATOR': 
      return {
        ...state,
        mainPlace: 'project'
      }
    case 'OPEN_VERSIONS_EDITOR':  //openVersionsEditor
      return {
        ...state,
        mainPlace: 'version'
      }
    case 'ADD_VERSION': 
    // допилить кода сюда и коммитнуть
    //debugger
      let originProject = state.projects[state.currentProject];
      originProject.versions = [{
        comment: payload.comment,
        date,
        data: originProject.versions[0].data
      }].concat(...originProject.versions);
      //originProject.lastVersion = originProject.lastVersion+1;
      //state.projects[state.currentProject] = originProject;
      return {
        ...state,
        projects: state.projects,
        mainPlace: 'editor'
      }
    case 'SAVE_POD': 
   
    return (() => {
      debugger
      console.log('PAYLOD:', payload)
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
      }
      const updateAnswers = () => {
        answers.forEach(({content, key, ref}) => {
          realWorkBranch[key] = {
            ans: content,
            pos: state.workBranch.pos+key,
            branch: {
              branchDirection: '',
              base: [
                
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
          realWorkBranch[0].branch.base = zeroBase.map((el, i) => {
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
          delete realWorkBranch[i];
        }
        realWorkBranch.choseCount = 0;
        realWorkBranch.question = false;
        //опасный момент. Оставлю на последок.
        //создать ПОД по максимальной высоте и ликвидировать вопрос с ответами.
      }
      state.workBranch.branch.branchDirection = branchDirection;
      state.workBranch.v = Math.random(); // события по обработчику
      return {
        ...state
      }
    })()

    case 'ADD_POD': 
    return (() => {
      debugger
      console.log(payload)
        // создание нового элемента и переадресация процесса на него
        let realWorkBranch = state.workBranch.branch;
        if(payload !== 'question') {
          let firstPart = realWorkBranch.base.slice(0, payload+1);
          let secondPart = realWorkBranch.base.slice(payload+1);
          realWorkBranch.base = [...firstPart, {
            coord: {
              path: state.workBranch.pos,
              height: payload+1
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
            return {...data, coord: {path, height: height+1}}
          }));
          state.workPCD[state.workPCD.workVersion].height = payload+1;
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
        
        state.workBranch.v = Math.random();
      return {
        ...state
      }
    })()
    case 'CHOOSE_POD': 
    return (() => {
      state.workPCD[state.workPCD.workVersion].height = payload
      return {
        ...state
      }
    })()
    case "DELETE_POD":
    return (() => {
      debugger
      console.log(payload)
      let realWorkBranch = state.workBranch.branch;
      let newCurrentHeight;
      if(payload === 'question') {
        for(let i = 0; i < realWorkBranch.choseCount; i++) {
          delete realWorkBranch[i]
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
      state.workBranch.v = Math.random();
      return {
        ...state
      }
    })()
    case 'SELECT_PROJECT': 
    debugger
    console.log(payload)
    return (() => {
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

      state.workPCD = state.projectsCoordsData[PCDInd]; 
      state.workBranch = {};
      state.workBranch = state.projects[projectInd].versions[state.workPCD.workVersion].data;
  
      let workPath = state.workPCD[state.workPCD.workVersion].path.substring();
      workPath = workPath.substring(1);
      while (workPath.length) {
        state.workBranch = state.workBranch.branch[workPath[0]];
        workPath = workPath.substring(1);
      };
      state.workBranch.v = random;
      return {
        ...state,
      }
    })()
      
    case 'INIT':
      return (() => {
        debugger
        console.log('%c%s', 'color: pink; font-size: 22px', "DEBUG:", payload)
        const {friends, personObj: {projects, projectsCoordsData, lastProject, lastPerson, userData: {superId}}} = payload;
        state.projects = projects;
        state.projectsCoordsData = projectsCoordsData;
        state.friends = friends;
        //state.currentProject = lastProject;
        state.workBranch = {};
        
        debugger
        let projectsCoordInd = null;
          for(let x=0;x<projectsCoordsData.length;x++) {
            if(projectsCoordsData[x].superId === lastProject) {
              projectsCoordInd = x;
            }
          }

        if(lastPerson === superId) {
          let lockInd = null;
          for(let i=0;i<projects.length;i++) {
            if(projects[i].superId === lastProject) {
              lockInd = i
            }
          }
          if(projectsCoordInd !== null) {
            // Уже есть проект 
            let pcd = projectsCoordsData[projectsCoordInd]
            let version = pcd.lastVersion;
            let {path, height} = pcd[version].coord;

            let workVersion = projects[lockInd].versions[version];
            let workBranch = workVersion.data;

            path = path.substr(1);
            while(path.length) {
              workBranch = workBranch.branch[path[0]];
              path = path.substr(1)
            }
            state.workBranch.branch = workBranch;
            state.workPCD = state.projectsCoordData[projectsCoordInd];
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
          // ДОДЕЛАТЬ С ДЕБАГЕРОМ...
          let friendInd = null;
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