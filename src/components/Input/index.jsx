import React from 'react';
import classNames from 'classnames';

import {Input} from 'antd';
import {SearchOutlined} from '@ant-design/icons' //< />

import './Input.scss'

const InputBase = (
  {
    width=100, 
    place='main', 
    placeholder, 
    changeHandler=()=>{}, 
    value, 
    readOnly, 
    isPassword=false
  }) => {
  
  const props = {
    value,
    readOnly,
    style: {width: width+'%'},
    onChange: (ev) => changeHandler(ev),
    placeholder,
    className: classNames('input', 'input__'+place)
  }
  return isPassword ? <Input.Password {...props} /> : <Input {...props}  />
    
  
}

export default InputBase;