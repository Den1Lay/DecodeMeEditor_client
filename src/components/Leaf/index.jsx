import React from 'react';
import classNames from 'classnames'

import {Tooltip} from 'antd'

import './Leaf.scss'

const Leaf = ({data, current, clickHandler}) => {

  function getConnects() {
    debugger
    let connects = [];
    let originBoost = data.branch.boost;
    let i = 0;
    while(i < data.branch.choseCount) {
      let neighbourBoost = data.branch['q'+i].branch.boost;
      if(neighbourBoost > originBoost) {
        connects.push(<div 
          style={{bottom: '1.25vh', height: (neighbourBoost-originBoost)*3.5+'vh'}} 
          className='leaf__main_connect'></div>)
      } else if(neighbourBoost < originBoost) {
        connects.push(<div 
          style={{top: '1.25vh', height: (originBoost-neighbourBoost)*3.5+'vh'}} 
          className='leaf__main_connect'></div>)
      }
      i++;
    };
    return connects
  };
 
  return <div className='leaf'>
      {
      data && <div className='leaf__tail'></div>
    }
    {
      data ?
      <Tooltip placement="bottom" title={`${data.branch.branchDirection} dir`}>
        <div onClick={clickHandler}  className={classNames('leaf__main', current && 'leaf__main-current')}>
        {data && getConnects()}
        <div className='leaf__main_pods'>
          {data.branch.base.length}
        </div>
        {data.branch.question && 
          <Tooltip title={`${data.branch.question.main} Q`}><div className={classNames('leaf__boll', 'leaf__boll-right')}></div></Tooltip>}
        {data.hasOwnProperty('ans') &&
           <Tooltip title={`${data.ans} ANS`}  ><div className={classNames('leaf__boll', 'leaf__boll-left')}></div></Tooltip>}
      </div>
      </Tooltip> 
      : null
    }
  
  </div>
}

export default Leaf;