import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'

import { Select } from 'antd';

import './Select.scss';

const {Option} = Select;
const SelectBase = ({changeHandler, isCreate, isSuper, projects, friends, workPCD, superId, nickName}) => { //defData, options}) => { //, options
  debugger
  console.log("SELECT_IS_READY");
  //уметь забивать на структурные баги чужого кода надо уметь.

  // // let options = [];
  // // for (let i = 10; i < 11; i++) {
  // //   const value = `${i.toString(36)}${i}`;
  // //   options.push({
  // //     value,
  // //     disabled: i === 10,
  // //   });
  // // }
  // // let exampleArr = ['Es_ILias'];
 
  // // console.log('%c%s', 'color: red; font-size:25px;','EXAMPLE_ARR:', exampleArr);
  // // 
  // useEffect(() => {
  //   if(state.dataV !== dataV) {
  //     setState({
  //       defData: accessData
  //         .map(({nickName, superId}) => accessedCreators.includes(superId) ? nickName : null)
  //         .filter(el => el !== null),
  //       options: accessData.map(({nickName, disabled}) => ({value: nickName, disabled})),
  //       dataV
  //     })
  //   }
  // });
  let defData;
  let options =  [  ...[{value: 'all', disabled:false}],
    {value: nickName, disabled: true}]
    .concat(friends.map(({userData:{superId, nickName}}) => ({value: nickName, superId, disabled: false})))
  let projectInd;
  for(let i in projects) {
    if(projects[i].superId === workPCD.projectId) {
      projectInd = i;
    }
  };

  if(isCreate) {
    // сделай проверку на повторение никнейма и если она срабатывает, то модифицируй ник (1)
    defData = [nickName];
  } else {
    
    if(isSuper) {
      defData = superIdToNick(projects[projectInd].superAccess);
    } else {
      defData = superIdToNick(projects[projectInd].access);
    }
  }

  function superIdToNick(supers) {
    let nicks = [];
    if(supers.includes('all')) {
      nicks.push('all')
    }
    supers.forEach(sup => {
      [{userData:{superId, nickName}}].concat(friends).forEach(({userData: {superId, nickName}}) => {
        if(sup === superId) {
          nicks.push(nickName)
        }
      })
    });
    return nicks
  }
  //const options = [{value: 'Es_ILias', disabled: true}];
  // let defData = accessData.slice()
  // .map(({superId, nickName}) => accessedCreators.includes(superId) ? nickName : null);
  // let options = accessData.map(({nickName, disabled}) => ({value: nickName, disabled}));

  // const {defData, options} = state;
  console.log('%c%s', 'color: red; font-size:25px;','DEF_DATA:', defData);
  console.log('%c%s', 'color: red; font-size:25px;','OPTIONS:', options);
  // ребилд 
  return (
    <Select
      mode="multiple"
      style={{ width: '100%' }}
      placeholder="Please select"
      defaultValue={defData}
      onChange={changeHandler}
      optionLabelProp="label"
    >
     { options.map(({value, disabled, superId}) => {
       return(
        <Option key={superId} value={value} label={value} disabled={disabled}>
          <div>
            {value}
          </div>
          {/* <div style={{display: 'none'}}>
            {superId}
          </div> */}
       </Option>
       )
     })}
    </Select>
  );
}

export default connect(({main: {projects, friends, workPCD, personObj: {userData: {nickName, superId}}}}) => 
({projects, friends, workPCD, nickName, superId}), {})(SelectBase)

{/* {accessData && accessData.map(({superId, nickName, disabled}) => (
        <Option 
          disabled={disabled}
          label={nickName}
          value={nickName} 
          key={nickName}>
            {nickName}</Option>
      ))} */}