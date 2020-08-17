import React from 'react';
import classNames from 'classnames';

import {Input} from 'antd';
import {SearchOutlined} from '@ant-design/icons' //< />

import './Input.scss'

const InputBase = ({width=100, place='main', placeholder, changeHandler, value, disabled}) => {
  return (
    <Input 
      value={value}
      readOnly={disabled}
      style={{width: width+'%'}}
      //disabled={disabled}
      //prefix={<SearchOutlined />}
      onChange={changeHandler}
      placeholder={placeholder}
      className={classNames('input', 'input__'+place)}
      />
  )
}

export default InputBase;