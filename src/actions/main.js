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
export const setupProject = payload => ({
  type: 'SETUP_PROJECT',
  payload
})
export const selectProject = payload => ({
  type: "SELECT_PROJECT",
  payload
})
export const selectVersion = payload => ({
  type: 'SELECT_VERSION',
  payload
})
export const openPlace = payload => ({
  type: 'OPEN_PLACE',
  payload
})
export const updateUsers = users => ({
  type: "UPDATE_USERS",
  payload: users
})
export const updateApplicantList = payload => ({
  type: 'UPDATE_APPLICANT_LIST',
  payload
})
export const previewPerson = payload => ({
  type: 'PREVIEW_PERSON',
  payload
})
export const cleanApplicantList = payload => ({
  type: 'CLEAN_APPLICANT_LIST',
  payload
})
// export const openProjectSetup = () => ({
//   type: 'OPEN_PROJECT_SETUP'
// })
// export const openVersionsEditor = () => ({
//   type: 'OPEN_VERSIONS_EDITOR'
// })
// export const opedProjectCreator = () => ({
//   type: 'OPEN_PROJECT_CREATOR'
// })
// export const openSocialPanel = () => ({
//   type: ' OPEN_SOCIAL_PANEL'
// })
export const addVersion = payload => ({
  type: 'ADD_VERSION',
  payload
})
export const changeBranch = payload => ({
  type: "CHANGE_BRANCH",
  payload
})

export const loginIn = () => ({
  type: 'LOGIN_IN'
})
export const choosePerson = payload => ({
  type: 'CHOOSE_PERSON',
  payload
})