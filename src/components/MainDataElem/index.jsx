// Добавить точки, если строка длинее...
import React from 'react'

import './MainDataElem.scss'
//data = {name, date}
const MainDataElem = ({width, height, data: {name, date}}) => {
  return(
    <div 
      style={{width: width+"vw", height: height+"vh" }} 
      className='mainDataElem'>
      <div className='mainDataElem__name'>{name}</div>
      <div className='mainDataElem__date'>{date}</div>
    </div>
  )
}

export default MainDataElem