import React from 'react'
import {connect} from 'react-redux'

import {Pod} from '@/components'

import './Branch.scss'

const Branch = ({workBranch, currentHeight, v}) => {
  //debugger
  console.log("BRANCH_V:",v)
  let resData = (workBranch.branch.question ? [workBranch.branch.question] : [])
  .concat(workBranch.branch.base);

  let realResData = resData.map(({coord:{height}, label, main}) => {
    return <Pod actived={currentHeight===height} label={label} main={main} height={height}/>
  })
  //ebugger
  return(
    <div className='branch' >
      <div className='branch__wrapper'>
        {realResData}
      </div>
    </div>
  )
}

export default connect(({main: {workBranch, currentHeight}})=>({workBranch, currentHeight, v: workBranch.v}), {})(Branch);