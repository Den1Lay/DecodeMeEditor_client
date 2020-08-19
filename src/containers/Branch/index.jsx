  // нужно организовать точечную модификацию по высоте и хранилище всех подов..
import React from 'react'
import {connect} from 'react-redux'

import {Pod, Button} from '@/components'

import {addPod, deletePod, choosePod, changeBranch, changeMaster} from '@/actions'
import {mineInd} from '@/utils'

import './Branch.scss'

const Branch = (
  {
    workBranch, 
    master,
    workPCD, 
    accessed, v, 
    addPod, 
    deletePod, 
    choosePod, 
    currentHeight, 
    changeBranch, 
    changeMaster
  }) => {

  let resData = workBranch.branch.base
  ? (workBranch.branch.base)
  .concat(workBranch.branch.question ? [workBranch.branch.question] : []) //
  : [];
  // нужно организовать точечную модификацию по высоте и хранилище всех подов..

  let realResData = resData.map(({coord:{height}, label, main}) => {
    return <Pod 
      onAction={podAction}
      readOnly={!accessed} 
      actived={currentHeight==height} 
      label={label} 
      main={main} 
      height={height} 
      onPlus={addPod}
      onDelete={deletePod}
      onChoose={choosePod}
      showDelete={resData.length > 1}
      />
  })
  const noMaster = master === null
  function podAction() {
    noMaster && changeMaster(true);
  }
  //ebugger
  return(
    <div className='branchWrapper'>
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
      {
      workBranch.pos && workBranch.pos.length > 1 &&
      <div className='branch__goBackPlace'>
        <div className='branch__goBackPlace_button'>
          <Button clickHandler={() => changeBranch('back')} place='navbar'>Cross back</Button>
        </div>
      </div>
      }
    </div>
  )
}

export default connect(({main: {workBranch, workPCD, projects, personObj}}) => {
  let accessed = false,
  master = null;
  const nickName = personObj.userData.nickName;
  if(workPCD) {
    let projectInd = [];
    let versionInd = [];
    
    mineInd(projects, workPCD.projectId, 'superId', projectInd);   
    mineInd(projects[projectInd[0]].versions, workPCD.workVersion, 'superId', versionInd);
    master = projects[projectInd[0]].versions[versionInd[0]].master;

    const targetAccess = projects[projectInd[0]].superAccess;
    if(targetAccess.includes(personObj.userData.superId) || targetAccess.includes('all')) {
      if(master === null || master === nickName) {
        accessed = true;
      }
    }
  }

  return {
    workBranch, 
    v: workBranch.v, 
    workPCD, 
    master,
    currentHeight: workPCD ? workPCD[workPCD.workVersion].height: null,
    accessed
  }
}, {addPod, deletePod, choosePod, changeBranch, changeMaster})(Branch);