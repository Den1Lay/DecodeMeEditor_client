import {format} from 'date-fns';

const projectsCoordData = [
  {
    projectId: 'uuid11',
    lastVersion: "1",
    0: {
      path: "0",
      height: 0
    }
  }
]

const projects = [{
  name: "QWE",  
  description: "QWE",
  lastVersion: 0, //proj v || wb v
  versions: [{
  comment: 'Init',
  lastCoords: {
    path: "0",
    height: 0
  },
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
  projectsCoordData,
  initialData: "STRING", 
  demo_projects: [
    {name: 'Week in forest', date: '10.07.2020'},
    {name: 'After war', date: '22.04.2020'},
    {name: 'Rade on church', date: '10.11.2019'},],
  projects,
  currentBranch: "0",
  currentProject: 0,
  currentVersion: 0,
  currentHeight: 0,
  workProject: 0,
  workBranch: projects[0].versions[0].data,
  mainPlace: 'editor', // project save
}
let date = format(new Date(), "yyyy-MM-dd"); 
export default (state = defState, action) => {
  const {type, payload} = action
  switch(type) {
  
    case 'ADD_PROJECT': 
    const {name, description} = payload
    let projects = [{
      name,  
      description,
      lastVersion: 0,
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
    console.log('PROJECT_OBJ:',projects)
      return {
        ...state,
        projects,
      currentBranch: "0",
      currentProject: 0,
      currentVersion: 0,
      currentHeight: 0,
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
      //  debugger
      console.log('PAYLOD:', payload)
      const {data: {label, mainPart, comment, artsDesription, branchDirection, answers}, selectedType} = payload;
      
      let realWorkBranch = state.workBranch.branch;
      const updatePod = () => {
        realWorkBranch.base[state.currentHeight] = {
          coord: {
            path: state.workBranch.pos,
            height: state.currentHeight
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
      if(selectedType === "0" && state.currentHeight !== 'question') {
        //обновить ПОД по рабочей высоте
        updatePod()
      } else if(selectedType === "1" && state.currentHeight === 'question') {
        // обновить вопрос и ответы 
        updateAnswers()
      } else if(selectedType === "1" && state.currentHeight !== 'question') {
        updateAnswers()
        debugger
        if(state.currentHeight < (realWorkBranch.base.length-1)) {
          // Добавить уведомления о том, что поды были перемещены по нулевому ответу
          let zeroBase = realWorkBranch.base.splice(state.currentHeight+1);
          // переписать адресы подов в соответсвтующие
          realWorkBranch[0].branch.base = zeroBase.map((el, i) => {
            return {
              ...el,
              coord: {path: el.coord.path+"0", height: i}
            }
          });
        }
        realWorkBranch.base.splice(state.currentHeight, 1);
        state.currentHeight = 'question';
        
        //обновить вопрос и ответы, а так же ликвидировать ПОД по высоте
      } else if(selectedType === "0" && state.currentHeight === 'question') {
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
        state.currentHeight = realWorkBranch.base.length-1;
        
        for(let i = 0; i < realWorkBranch.choseCount; i++) {
          delete realWorkBranch[i];
        }
        realWorkBranch.choseCount = false;
        realWorkBranch.question = 0;
        //опасный момент. Оставлю на последок.
        //создать ПОД по максимальной высоте и ликвидировать вопрос с ответами.
      }
      state.workBranch.branch.branchDirection = branchDirection;
      state.workBranch.v = Math.random();
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
          state.currentHeight = payload+1
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
          state.currentHeight = realWorkBranch.base.length-1;
        }

        
        state.workBranch.v = Math.random();
      return {
        ...state
      }
    })()
    case 'CHOOSE_POD': 
    return (() => {
      return {
        ...state,
        currentHeight: payload
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
      state.workBranch.v = Math.random();
      return {
        ...state,
        currentHeight: newCurrentHeight,
      }
    })()
    case 'SELECT_PROJECT': 
    debugger
      return {
        ...state,
        currentProject: payload
      }
    case 'INIT':
      return {
        ...state
      }
    default:
      return state;
  }
}