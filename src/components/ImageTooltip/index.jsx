import React, {useState} from 'react'
import classNames from 'classnames'

import './ImageTooltip.scss'

const ImageTooltip = ({children, imageBlock}) => {
  const [focus, setFocus] = useState(false)

  return (
    <div className='imageTooltip' onMouseEnter={setFocus(true)} onMouseOver={setFocus(false)}>
      {children}
      <div className={classNames('imageTooltip__payload', 'imageTooltip__payload'+(focus ? '-show': '-hide'))}>
        {imageBlock}
      </div>
    </div>
  )
}

export default ImageTooltip;