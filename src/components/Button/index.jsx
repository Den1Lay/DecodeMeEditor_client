import React from 'react'
import classNames from 'classnames'

import {Button} from 'antd'

import './Button.scss'

const ButtonBase = ({children, place='main', clickHandler}) => {

  return(
    <div >
      <Button 
        onClick={clickHandler}
        type='primary' 
        className={classNames('button', 'button__'+place)}>
        {children}
      </Button>
    </div>
  )
}

export default ButtonBase;