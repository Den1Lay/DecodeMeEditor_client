const defState = {
  nickname: "Es_ILias",
  avatar: "",
  lastProject: 'none'
}

export default (state = defState, {type, payload}) => {
  switch(type) {
    case "SET_USER": 
    return (() => {
      return {
        ...state
      }
    })();
    default:
    return {
      ...state
    }
  }
}