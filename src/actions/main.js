export const addPod = payload => ({
  type: 'ADD_POD',
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
export const addVersion = payload => ({
  type: 'ADD_VERSION',
  payload
})
export const openVersionsEditor = () => ({
  type: 'OPEN_VERSIONS_EDITOR'
})