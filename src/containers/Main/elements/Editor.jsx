// данные прилетают из уже существуюего дерева. Оно инициализируется с создание проекта.
// Информирование о пустых полях... Формик?...
import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import classNames from 'classnames'

import {Mentions, Button, Input, Answers} from '@/components'
import {Dropdown, Menu} from 'antd'

import {savePod} from '@/actions'

const Editor = ({savePod, workBranch, currentHeight}) => {
  //const [typesVisible, setTypesVisible] = useState(false)
  const [selectedType, setSelectedType] = useState('0'); // 0: POD, 1: QUESTION
  const [data, setData] = useState({
    label: "",
    mainPart: "",
    comment: "",
    artsDesription: "",
    branchDirection: "",
    answers: [],
  })
  const [checkHeight, setCheckHeight] = useState(null);

useEffect(() => {
  debugger
  if(currentHeight !== checkHeight) {
    let dataSource = currentHeight !== 'question' ? workBranch.branch.base[currentHeight] : workBranch.branch.question;
      const {label, main, comment, picture: {alt}} = dataSource;
      let answers = [
        { content: '', key: '0', closable: false, ref: ''},
        { content: '', key: '1', closable: false, ref: ''},
      ];
      
        let realWorkBranch = workBranch.branch;
        if(realWorkBranch.choseCount) {
          let newAnswers = []
          
          for(let i = 0; i < realWorkBranch.choseCount; i++) {
            let {ans, branch: {ref}} = realWorkBranch[i]
            newAnswers.push({content: ans, key: i+'', closable: false, ref: ref ? ref : ''})
          }
          answers = newAnswers;
        }
  
      setData({
        label, 
        mainPart: main, 
        comment, 
        artsDesription: alt,
        answers,
        branchDirection: workBranch.branch.branchDirection})
      setCheckHeight(currentHeight);
      setSelectedType(currentHeight !== 'question' ? "0" : "1")
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

  const {label, mainPart, comment, artsDesription, branchDirection} = data;
  return (
    <>
      <div className='editor__left'>
        <div style={{display: 'flex'}}>
          <div className='editor__left_dropMenu'>
          <Button clickHandler={() => {
            (workBranch.branch.choseCount === 0 || currentHeight === 'question') && setSelectedType(selectedType === '0' ? "1" : "0");
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
            <Input value={label} placeholder='Label' changeHandler={(ev) => {ev.persist(); setData({...data, label: ev.target.value})}} />
          </div>
        </div>
        <div className='editor__left_dialog'>
          <Mentions value={mainPart} row={10} placeholder='Main part' changeHandler={ev => setData({...data, mainPart: ev})}/>
        </div>
        <div className='editor__left_comment'>
          <Mentions value={comment} row={6} placeholder='Comment/analysis' changeHandler={ev => setData({...data, comment: ev})}/>
        </div>
        <div className={classNames('editor__left_tabs','editor__left_tabs'+ (selectedType === '1' ? '-show' : '-hide'))}>
          <Answers onNewAnswers={(pass) => setData({...data, answers: pass})} />
        </div>
      </div>

      <div className='editor__right'>
        <div style={{display: 'flex'}}>
          <div className='editor__right_space'>
          </div>
          <div className='editor__right_createBtn'>
            <Button clickHandler={() => savePod({selectedType, data})}>
              SAVE
            </Button>
          </div>
        </div>
        <div className='editor__right_dialog'>
          <Mentions value={artsDesription} row={10} placeholder={`Arts description`} changeHandler={ev => setData({...data, artsDesription: ev})}/>
        </div>
        <div className='editor__right_branchDir'>
          <Mentions value={branchDirection} row={6} placeholder={`Branches direction`} changeHandler={ev => setData({...data, branchDirection: ev})}/>
        </div>
        <div className={classNames('editor__right_metaData', 'editor__right_metaData'+(selectedType === '1' ? '-show' : '-hide'))}>
          <Mentions disabled={true} row={6} placeholder={`Meta data`}/>
        </div>
      </div>
    </>
  )
}

export default connect(({main: {workBranch, currentHeight}}) => ({workBranch, currentHeight, v: workBranch.v}), {savePod})(Editor)