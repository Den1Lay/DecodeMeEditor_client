import React, {useState} from 'react'

import {Mentions, CheckTags} from '@/components';

import './Directions.scss';

const Directions = ({branchDirection, wayDirection, branchHandler, wayHandler, row, readOnly}) => {
  const [workPlace, setWorkPlace] = useState('branch')

  function changeHandler(ev) {

    workPlace === 'path'
    ? wayHandler(ev)
    : branchHandler(ev)
  } 
  let checkTagsProps = {
    firstVal: 'Branch',  
    firstHandler: () => setWorkPlace('branch'), 
    secondVal: 'Way', 
    secondHandler:() => setWorkPlace('path'), 
    checkData: workPlace === 'branch'
  }

  return (
    <div className='directons'>
      <Mentions 
          disabled={workPlace === 'path'}
          readOnly={readOnly}
          value={workPlace === 'path' ? wayDirection : branchDirection}
          row={row}
          placeholder={workPlace === 'path' ? "Way (SOON)" : "Branch dir.."}
          changeHandler={changeHandler} />
        <CheckTags {...checkTagsProps} />
    </div>
  )
}

export default Directions