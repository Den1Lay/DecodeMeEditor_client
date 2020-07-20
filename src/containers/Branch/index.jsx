  // нужно организовать точечную модификацию по высоте и хранилище всех подов..
import React from 'react'
import {connect} from 'react-redux'

import {Pod} from '@/components'

import {addPod, deletePod, choosePod} from '@/actions'

import './Branch.scss'

const Branch = ({workBranch, currentHeight, v, addPod, deletePod, choosePod}) => {
  //debugger
  console.log("BRANCH_V:",v)
  let resData = (workBranch.branch.base)
  .concat(workBranch.branch.question ? [workBranch.branch.question] : []); //

  // нужно организовать точечную модификацию по высоте и хранилище всех подов..
  let realResData = resData.map(({coord:{height}, label, main}) => {
    return <Pod 
      actived={currentHeight===height} 
      label={label} 
      main={main} 
      height={height} 
      onPlus={addPod}
      onDelete={deletePod}
      onChoose={choosePod}
      showDelete={resData.length > 1}
      />
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

export default connect(({main: {workBranch, currentHeight}})=>({workBranch, currentHeight, v: workBranch.v}), {addPod, deletePod, choosePod})(Branch);