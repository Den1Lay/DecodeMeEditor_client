import React, {useRef, useEffect, useState} from 'react'

import './NavbarInput.scss';
//Input выносится так как их 3 шт
const NavbarInput = ({placeholder, changeHandler, width}) => {
  const ref = useRef(null);
  const [state, setstate] = useState(-3);

  useEffect(() => {
    //setstate(100)
  })

  return (
    <input 
      style={{width: width+'%'}}
      type="text"
      placeholder={placeholder}
      className='navbarInput'
      onChange={changeHandler}/>
  )
}

export default NavbarInput;