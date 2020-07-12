const defState = {
  initialData: "STRING"
}

export default (state = defState, action) => {
  const {type, payload} = action
  switch(type) {
    case 'INIT':
      return {
        ...state
      }
    default:
      return state;
  }
}