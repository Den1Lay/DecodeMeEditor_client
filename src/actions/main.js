export const addPod = payload => ({
  type: 'ADD_POD',
  payload
})
export const deletePod = payload => ({
  type: 'DELETE_POD',
  payload
})
export const savePod = payload => ({
  type: 'SAVE_POD',
  payload
})
export const choosePod = payload => ({
  type: 'CHOOSE_POD',
  payload
})
export const addProject = payload => ({
  type: 'ADD_PROJECT',
  payload
})
export const opedProjectCreator = () => ({
  type: 'OPEN_PROJECT_CREATOR'
})
export const selectProject = payload => ({
  type: "SELECT_PROJECT",
  payload
})
export const selectVersion = payload => ({
  type: 'SELECT_VERSION',
  payload
})
export const addVersion = payload => ({
  type: 'ADD_VERSION',
  payload
})
export const changeBranch = payload => ({
  type: "CHANGE_BRANCH",
  payload
})
export const openVersionsEditor = () => ({
  type: 'OPEN_VERSIONS_EDITOR'
})
export const loginIn = () => ({
  type: 'LOGIN_IN'
})