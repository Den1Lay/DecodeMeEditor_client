  // нужно организовать точечную модификацию по высоте и хранилище всех подов..
import React from 'react'
import {connect} from 'react-redux'

import {Pod} from '@/components'

import {addPod, deletePod, choosePod} from '@/actions'

import './Branch.scss'

const Branch = ({workBranch, workPCD, v, addPod, deletePod, choosePod, currentHeight}) => {
  debugger
  // let currentHeight = null;
  // if(workPCD) {
  //   currentHeight = workPCD[workPCD.workVersion].height;
  // }
  console.log("BRANCH_V:",v)
  let resData = workBranch.branch.base
  ? (workBranch.branch.base)
  .concat(workBranch.branch.question ? [workBranch.branch.question] : []) //
  : [];
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
      {realResData.length > 0
      ? <div className='branch__wrapper'>
          {realResData}
        </div>
      : <div className="branch__plug">
          Projects pods...
        </div>
      }
    </div>
  )
}

export default connect(({main: {workBranch, workPCD}})=>({
  workBranch, 
  v: workBranch.v, 
  workPCD, 
  currentHeight: workPCD ? workPCD[workPCD.workVersion].height: null
}), {addPod, deletePod, choosePod})(Branch);