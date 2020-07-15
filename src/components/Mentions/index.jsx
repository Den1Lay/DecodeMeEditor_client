import React from 'react'
import {Mentions} from 'antd'

import './Mentions.scss'

const MentionsBase = ({row, placeholder='', changeHandler}) => {
  return (
    <Mentions 
      onChange={changeHandler}
      rows={row}
      placeholder={placeholder}
      className='realMentions'>
  </Mentions>
  )
}

export default MentionsBase

