// добавить увеличение размера (height) зоны, при появлении скролл бара. Увеличение до передельной высоты, зетем скролл бар. 
import React, {useRef, useEffect, useState} from 'react'

import './MainTextArea.scss'

const MainTextArea = ({width, height}) => {
  const heightRef = useRef(null)
  const [scrollHeight, setScrollHeight] = useState(null);
  const [heightBoost, setHeightBoost] = useState(0);

  useEffect(() => {
    //debugger
    //console.log("HEIGNT_REF:", heightRef.current.scrollHeight)
    setScrollHeight(heightRef.current.scrollHeight);
  })
  function changeHandl(ev) {
    console.log("HEIGNT_REF:", heightRef.current.scrollHeight)
    let scrollHeightNow = heightRef.current.scrollHeight
    if(scrollHeightNow > scrollHeight) {
      setHeightBoost(heightBoost+1.8);
      setScrollHeight(heightRef.current.scrollHeight)
    } else if(scrollHeightNow < scrollHeight) {
      setHeightBoost(heightBoost-1.8);
      setScrollHeight(heightRef.current.scrollHeight)
    }
  }

  return (
    <textarea 
      onChange={changeHandl}
      ref={heightRef}
      style={{width: width+'vw', height: height+heightBoost+'vh'}}
      className="mainTextArea" />
  )
}

export default MainTextArea