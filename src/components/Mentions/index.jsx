import React from 'react'
import {Mentions} from 'antd'

import './Mentions.scss'

const MentionsBase = ({row, placeholder='', changeHandler, value, readOnly=false, disabled}) => {
  return (
    <Mentions 
      disabled={disabled}
      readOnly={readOnly}
      value={value}
      onChange={(ev) => {changeHandler(ev); console.log('WTF')}}
      rows={row}
      placeholder={placeholder}
      className='realMentions'
      //disabled={disabled}
      >
  </Mentions>
  )
}

export default MentionsBase

