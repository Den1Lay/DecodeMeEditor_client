import {format} from 'date-fns'

const defState = {
  initialData: "STRING", 
  demo_projects: [
    {name: 'Week in forest', date: '10.07.2020'},
    {name: 'After war', date: '22.04.2020'},
    {name: 'Rade on church', date: '10.11.2019'},],
  projects: [],
  currentBranch: "",
}

export default (state = defState, action) => {
  const {type, payload} = action
  switch(type) {
    case 'ADD_PROJECT': 
   
    let date = format(new Date(), "yyyy-MM-dd")
    debugger
      return {
        ...state,
        projects: [...state.projects, {name:payload, date, versies: [{
          pos: "0",
          branch: {
            base: [],
            question: false,
            choseCount: 0,
          }
        }]}]
      }
    case 'INIT':
      return {
        ...state
      }
    default:
      return state;
  }
}