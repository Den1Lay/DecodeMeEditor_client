import React from 'react'

import {Tag} from 'antd'

import './CheckTags.scss'

const { CheckableTag } = Tag;
const CheckTags = ({firstVal,  firstHandler, secondVal, secondHandler, checkData}) => {
  return (
    <div className='checkTags'>
        <div style={{flex: '5'}}>
          <CheckableTag
            checked={checkData}
            onClick={() => !checkData && firstHandler()}
          >
            {firstVal}
          </CheckableTag>
        </div>
        <div style={{flex: '5'}} >
          <CheckableTag
            checked={!checkData}
            onClick={() => checkData && secondHandler()}
          >
            {secondVal}
          </CheckableTag>
        </div>
    </div>
  )
}

export default CheckTags