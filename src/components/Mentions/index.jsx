import React from 'react'
import {Mentions} from 'antd'

import './Mentions.scss'

const MentionsBase = ({row, placeholder='', changeHandler, value, disabled=false}) => {
  return (
    <Mentions 

      value={value}
      onChange={changeHandler}
      rows={row}
      placeholder={placeholder}
      className='realMentions'
      disabled={disabled}>
  </Mentions>
  )
}

export default MentionsBase

