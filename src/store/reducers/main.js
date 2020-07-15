import {format} from 'date-fns'

const defState = {
  initialData: "STRING", 
  demo_projects: [
    {name: 'Week in forest', date: '10.07.2020'},
    {name: 'After war', date: '22.04.2020'},
    {name: 'Rade on church', date: '10.11.2019'},],
  projects: [],
  currentBranch: null,
  currentProject: null,
  currentVersion: null,
  mainPlace: 'editor', // project save
}
let date = format(new Date(), "yyyy-MM-dd"); 
export default (state = defState, action) => {
  const {type, payload} = action
  switch(type) {
  
    case 'ADD_PROJECT': 
    const {name, description} = payload
      return {
        ...state,
        projects:
        [{
          name,  
          description,
          lastVersion: 0,
          versions: [{
          comment: 'Init',
          date,
          data: {
            pos: "0",
            branch: {
            base: [],
            question: false,
            choseCount: 0,
            }
          }
        }]}].concat(...state.projects),
      currentBranch: "0",
      currentProject: 0,
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
    const {comment} = payload;
    // допилить кода сюда и коммитнуть
    //debugger
      let originProject = state.projects[state.currentProject];
      originProject.versions = [{
        comment,
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
    case 'SELECT_PROJECT': 
    //debugger
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