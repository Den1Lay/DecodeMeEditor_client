import React, {useState} from 'react'
import classNames from 'classnames'

import './Cascades.scss'

const Cascades = ({width, height, data, dls, left, dlsStatus, closeEvent, onSubmitForm, onPickData}) => {
  console.log("DATA_INSIDE_CASCADES:", data)
  return (
    <div 
      style={{width: width+"vw", height: height+"vh" }}
      className={classNames('cascades', left ? 'cascades-left' : 'cascades-right')}>
      {dls && 
        <>
          <div 
              onClick={closeEvent}
              className='cascades__plus'>x</div>
          <div className={classNames('cascades__dls', dlsStatus
          ? 'cascades__dls-hide'
          : 'cascades__dls-show')}>{dls}</div>
        </>
      }
      
      <div className={classNames('cascades__data', dlsStatus 
      ? 'cascades__data-show'
      : 'cascades__data-hide')}>
        {data ? data : "Let's add some"}
      </div>
    </div>
  )
}

export default Cascades