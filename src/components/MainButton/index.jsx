import React from 'react'

import './MainButton.scss'

const MainButton = ({type='button', simbol, width, height, clickHandler=()=>{}}) => {
  return (
    <button 
      onClick={clickHandler}
      type={type}
      className='mainButton'
      style={{width: width+'vw', height: height+'vh'}}>
      {simbol}
    </button>
  )
}

export default MainButton;