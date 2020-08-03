import React from 'react'
import classNames from 'classnames'

import {Button} from 'antd'

import './Button.scss'

const ButtonBase = ({children, place='main', clickHandler, isCircle}) => {

  return(
    <Button 
        shape={isCircle ? "circle": null}
        onClick={clickHandler}
        type='primary' 
        className={classNames('button', 'button__'+place)}>
        {children}
      </Button>
  )
}

export default ButtonBase;