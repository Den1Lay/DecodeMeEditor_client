import {format} from 'date-fns'

const projects = [{
  name: "QWE",  
  description: "QWE",
  lastVersion: 0,
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
              base: [], // сделать красиво
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
        realWorkBranch.base.splice(state.currentHeight, 1);
        state.currentHeight = 'question';
        //обновить вопрос и ответы, а так же ликвидировать ПОД по высоте
      } else if(selectedType === "0" && state.currentHeight === 'question') {
        debugger
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
      console.log("DATA:", payload.data, "TYPE:", payload.selectedType);

        // создание нового элемента и переадресация процесса на него
        let realWorkBranch = state.workBranch.branch;
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
        }]
        let currentHeight = realWorkBranch.base.length-1;

      return {
        ...state,
        currentHeight
      }
    })()

    case "DELETE_POD":
    return (() => {
      return {
        ...state,
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