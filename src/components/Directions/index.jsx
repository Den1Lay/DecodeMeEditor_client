import React, {useState} from 'react'

import {Tag, Mentions} from 'antd'

import './Directions.scss';

const { CheckableTag } = Tag

const Directions = ({branchDirection, wayDirection, branchHandler, wayHandler, row}) => {
  const [workPlace, setWorkPlace] = useState('branch')

  function changeHandler(ev) {
    workPlace === 'path'
    ? wayHandler(ev)
    : branchHandler(ev)
  } 

  return (
    <div className='directons'>
      <Mentions 
          value={workPlace === 'path' ? wayDirection : branchDirection}
          rows={row}
          placeholder={workPlace === 'path' ? "Path direction.." : "Branch dir.."}
          changeHandler={changeHandler} />
      <div className='directions__controllers'>
        <CheckableTag
          checked={workPlace === 'branch'}
          onClick={() => workPlace !== 'branch' && setWorkPlace('branch')}
        >
          Branch
        </CheckableTag>
        <CheckableTag
          checked={workPlace === 'path'}
          onClick={() => workPlace !== 'path' && setWorkPlace('path')}
        >
          Way
        </CheckableTag>
      </div>
    </div>
  )
}

export default Directions