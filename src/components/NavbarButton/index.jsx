import React from 'react'

import './NavbarButton.scss'

const NavbarButton = ({simbol, width, clickHandler}) => {
  return(
    <button
    onClick={clickHandler}
    className="navbarButton"
    style={{width: width+'%'}}>
      {simbol}
    </button>
  )
}

export default NavbarButton;