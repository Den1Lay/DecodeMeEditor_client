// данные прилетают из уже существуюего дерева. Оно инициализируется с создание проекта.
// Информирование о пустых полях... Формик?...
import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import classNames from 'classnames'

import {Mentions, Button, Input, Answers} from '@/components'
import {Dropdown, Menu} from 'antd'

import {savePod, changeBranch} from '@/actions'

const Editor = ({savePod, workBranch, currentHeight, changeBranch, fakeBranch, faceCH}) => {
  // проверка на сохранение...
  const [selectedType, setSelectedType] = useState('0'); // 0: POD, 1: QUESTION
  const [data, setData] = useState({
    label: "",
    mainPart: "",
    comment: "",
    artsDesription: "",
    branchDirection: "",
    answers: [],
    activeKey: "0",
  })
  const [checkCoord, setCheckCoord] = useState({checkHeight: null, checkPath: null});
  const [saveState, setSaveState] = useState(null)

useEffect(() => {
  debugger
  let currentPath = workBranch.pos;
  const {checkHeight, checkPath} = checkCoord;
  if(workBranch.branch.base && ((currentHeight !== checkHeight) || (currentPath !== checkPath))) {
    let dataSource = currentHeight !== 'question' ? workBranch.branch.base[currentHeight] : workBranch.branch.question;
      const {label, main, comment, picture: {alt}} = dataSource;  
      let answers = [
        { content: '', key: '0', closable: false, ref: ''},
        { content: '', key: '1', closable: false, ref: ''},
      ];
      
        let realWorkBranch = workBranch.branch;
        let choseCount = realWorkBranch.choseCount;
        if(choseCount) {
          let newAnswers = []
          
          for(let i = 0; i < choseCount; i++) {
            let natKey = 'q'+i
            let {ans, branch: {ref}} = realWorkBranch[natKey]
            newAnswers.push({content: ans, key: i+'', closable: choseCount > 2, ref: ref ? ref : ''})
          }
          answers = newAnswers;
        }
  
      setData({
        label, 
        mainPart: main, 
        comment, 
        artsDesription: alt,
        answers,
        activeKey: "0",
        branchDirection: workBranch.branch.branchDirection})
        setCheckCoord({checkHeight: currentHeight, checkPath: currentPath});
      setSelectedType(currentHeight !== 'question' ? "0" : "1");
      setSaveState(workBranch.v)
  }
})
  
  const menu = (
    <div className='editorsMenu'>
      <Menu 
      onSelect={({key}) => {
        console.log('EVE', key)
        setSelectedType(key)
        //setData({...data, answers: Array(8).fill('').map((el, i) => i)});
      }}
      defaultSelectedKeys={[selectedType]}>
      <Menu.Item key={'0'}>
        POD
      </Menu.Item>
      <Menu.Item key={'1'}>QUESTION</Menu.Item>
    </Menu>
    </div>
  );

  const {label, mainPart, comment, artsDesription, branchDirection, answers, activeKey} = data;
  return (
    <>
      <div className='editor__left'>
        <div style={{display: 'flex'}}>
          <div className='editor__left_dropMenu'>
          <Button clickHandler={() => {
             currentHeight !== null && (workBranch.branch.choseCount === 0 || currentHeight === 'question') && (() => {setSelectedType(selectedType === '0' ? "1" : "0");setSaveState(false)})();
          }}>
            {selectedType === '0' ? "POD" : "QUESTION"}
          </Button>
            {/* <Dropdown overlay={menu}>
              <div>
              <Button clickHandler={() => {
              }}>
                {selectedType === '0' ? "POD" : "QUESTION"}
              </Button>
              </div>
            </Dropdown> */}
            {/* <Dropdown /> */}
          </div>
          <div className='editor__left_label'>
            <Input value={label} placeholder='Label' changeHandler={(ev) => {ev.persist(); setData({...data, label: ev.target.value}); setSaveState(false)}} />
          </div>
        </div>
        <div className='editor__left_dialog'>
          <Mentions value={mainPart} row={10} placeholder='Main part' changeHandler={ev => {setData({...data, mainPart: ev}); setSaveState(false)}}/>
        </div>
        <div className='editor__left_comment'>
          <Mentions value={comment} row={6} placeholder='Comment/analysis' changeHandler={ev => {setData({...data, comment: ev}); setSaveState(false)}}/>
        </div>
        <div className={classNames('editor__left_tabs','editor__left_tabs'+ (selectedType === '1' ? '-show' : '-hide'))}>
          <Answers 
            setAnswers={({activeKey, panes: answers}) => {setData({...data, answers, activeKey}); setSaveState(false)}} 
            setActiveKey={({activeKey}) => setData({...data, activeKey})}  
            value={{panes: answers, activeKey}}/>
          {workBranch.branch['q'+activeKey] && saveState && 
          <div className={classNames('editor__left_tabs_cross')}>
            <Button clickHandler={() => {changeBranch(activeKey)}}>CROSS</Button>
          </div>}
        </div>
      </div>

      <div className='editor__right'>
        <div style={{display: 'flex'}}>
          <div className='editor__right_space'>
          
          </div>
          <div className='editor__right_saveInfo'>{!saveState && <div>*</div>}</div>
          <div className='editor__right_createBtn'>
          
            <Button clickHandler={() => {savePod({selectedType, data}); setSaveState(true)}}>
              SAVE
            </Button>
          </div>
        </div>
        <div className='editor__right_dialog'>
          <Mentions value={artsDesription} row={10} placeholder={`Arts description`} changeHandler={ev => {setData({...data, artsDesription: ev}); setSaveState(false)}}/>
        </div>
        <div className='editor__right_branchDir'>
          <Mentions value={branchDirection} row={6} placeholder={`Branches direction`} changeHandler={ev => {setData({...data, branchDirection: ev}); setSaveState(false)}}/>
        </div>
        <div className={classNames('editor__right_metaData', 'editor__right_metaData'+(selectedType === '1' ? '-show' : '-hide'))}>
          <Mentions disabled={true} row={6} placeholder={`Meta data`}/>
        </div>
      </div>
    </>
  )
}

export default connect(({main: {workBranch, workPCD}}) => ({
  workBranch, 
  v: workBranch.v,
  currentHeight: workPCD ? workPCD[workPCD.workVersion].height : null
}), {savePod, changeBranch})(Editor)