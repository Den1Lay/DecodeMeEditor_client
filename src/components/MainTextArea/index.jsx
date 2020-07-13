// добавить увеличение размера (height) зоны, при появлении скролл бара. Увеличение до передельной высоты, зетем скролл бар. 
import React from 'react'

import './MainTextArea.scss'

const MainTextArea = ({width, height}) => {
  return (
    <textarea 
      style={{width: width+'vw', height: height+'vh'}}
      className="mainTextArea" />
  )
}

export default MainTextArea