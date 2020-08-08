// данные прилетают из уже существуюего дерева. Оно инициализируется с создание проекта.
// Информирование о пустых полях... Формик?...
import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import classNames from 'classnames'
import {v4} from 'uuid'

import {Mentions, Button, Input, Answers, ArtPart} from '@/components'
import {Dropdown, Menu} from 'antd'
import {mineInd} from '@/utils'

import {savePod, changeBranch, changeMaster, setIllustrations} from '@/actions' 

import {axios, socket} from '@/core'

const Editor = (
  {
    savePod, 
    workBranch, 
    currentHeight, 
    changeBranch, v, 
    master, 
    nickName,
    person,
    workPCD,
    changeMaster, 
    illustrations,
    setIllustrations, 
  }) => {
  // проверка на сохранение...
  const [selectedType, setSelectedType] = useState('0'); // 0: POD, 1: QUESTION
  const [data, setData] = useState({
    label: "",
    mainPart: "",
    comment: "",
    artsDesription: "",
    artSrc: null,
    branchDirection: "",
    answers: [],
    activeKey: "0",
  })
  const [checkCoord, setCheckCoord] = useState({checkHeight: null, checkPath: null});
  const [saveState, setSaveState] = useState(null)

useEffect(() => {
  debugger
  let currentPath = workBranch.pos;
  const {checkHeight, checkPath, checkV} = checkCoord;
  if(workBranch.branch.base && ((currentHeight !== checkHeight) || (currentPath !== checkPath) || (v !== checkV))) {
    let dataSource = currentHeight !== 'question' ? workBranch.branch.base[currentHeight] : workBranch.branch.question;
      const {label, main, comment, picture: {src, alt}} = dataSource;  
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
        artSrc: illustrations.includes(src) ? src : null,
        answers,
        activeKey: "0",
        branchDirection: workBranch.branch.branchDirection})
        setCheckCoord({checkHeight: currentHeight, checkPath: currentPath, checkV: v});
      setSelectedType(currentHeight !== 'question' ? "0" : "1");
      setSaveState(workBranch.v)
  }
})
  
  let masterHere = master === nickName;

  function masterHandl() {

  }

  function eventHandl() {
    setSaveState(false);
    !masterHere && changeMaster(true);
  }

  function fileHandler(ev) {
    ev.persist();
    debugger
    let formData = new FormData();
    let workFile = ev.target.files[0];
    let dataType = workFile.name.substring(0).split('.');
    let newName = `${v4()}.${dataType[dataType.length-1]}`;
    formData.append('picture', workFile, workFile.name);
    console.log('PICTURE:', ev.target.files[0])
    axios.post('/image', formData, {
      headers: { 'Content-Type': "multipart/form-data", 'newname': newName}
    }).then(({data: src}) => {
      console.log('RES_DATA:', src)
      socket.emit('SET_ILLUSTRATIONS', {token: localStorage.token, person, workPCD, src, action: 'ADD'})
      setIllustrations({src, action: 'ADD'});
      setData({...data, artSrc: src });
      // добавить знатный денжер о всех последствиях удаления картинки
      //socket.emit отработать после всех тестов нового компонента
    })
  }

  function setArtHandler(pass) {
    setData({...data, artSrc: pass });
    // ev.persist();
    // 
  }
  // const menu = (
  //   <div className='editorsMenu'>
  //     <Menu 
  //     onSelect={({key}) => {
  //       console.log('EVE', key)
  //       setSelectedType(key)
  //       //setData({...data, answers: Array(8).fill('').map((el, i) => i)});
  //     }}
  //     defaultSelectedKeys={[selectedType]}>
  //     <Menu.Item key={'0'}>
  //       POD
  //     </Menu.Item>
  //     <Menu.Item key={'1'}>QUESTION</Menu.Item>
  //   </Menu>
  //   </div>
  // );

  const [image, setImage] = useState(null)

  const {label, mainPart, comment, artsDesription, branchDirection, answers, activeKey, artSrc} = data;
  return (
    <>
      <div className='editor__left'>
        <div style={{display: 'flex'}}>
          <div className='editor__left_dropMenu'>
          <Button clickHandler={() => {
             currentHeight !== null && (workBranch.branch.choseCount === 0 || currentHeight === 'question') && (() => {setSelectedType(selectedType === '0' ? "1" : "0"); eventHandl()})();
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
            <Input value={label} placeholder='Label' changeHandler={(ev) => {ev.persist(); setData({...data, label: ev.target.value}); eventHandl()}} />
          </div>
        </div>
        <div className='editor__left_dialog'>
          <Mentions value={mainPart} row={10} placeholder='Main part' changeHandler={ev => {setData({...data, mainPart: ev}); eventHandl()}}/>
        </div>
        <div className='editor__left_comment'>
          <Mentions value={comment} row={6} placeholder='Comment/analysis' changeHandler={ev => {setData({...data, comment: ev}); eventHandl()}}/>
        </div>
        <div className={classNames('editor__left_tabs','editor__left_tabs'+ (selectedType === '1' ? '-show' : '-hide'))}>
          <Answers 
            setAnswers={({activeKey, panes: answers}) => {setData({...data, answers, activeKey}); eventHandl()}} 
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
          <div className='editor__right_master'>
            <div className='editor__right_master_status'>
              {`M: ${master}`}
            </div>
            <div className='editor__right_master_btn'>
              <Button clickHandler={masterHandl}>
                {master === null 
                ? "Stay master" 
                : master === nickName 
                  ? "Give away right" 
                  : "Request the right"}
              </Button>
            </div>
          </div>
          <div className='editor__right_save'>
            <div className='editor__right_save_info'>{!saveState && <div>*</div>}</div>
            <div className='editor__right_save_btn'>
              <Button clickHandler={() => {savePod({selectedType, data}); setSaveState(true)}}>
                SAVE
              </Button>
            </div>
          </div>  
        </div>
        <div className='editor__right_dialog'>
          <ArtPart 
            artSrc={artSrc}
            value={artsDesription} 
            row={10} 
            mentionsHandler={ev => {setData({...data, artsDesription: ev}); eventHandl()}}
            fileHandler={fileHandler}
            illustrations={illustrations}
            setArtSrc={setArtHandler}
            />
          {/* <Mentions  row={10} placeholder={`Arts description`} changeHandler={}/> */}
        </div>
        <div className='editor__right_branchDir'>
          <Mentions value={branchDirection} row={6} placeholder={`Branches direction`} changeHandler={ev => {setData({...data, branchDirection: ev}); eventHandl()}}/>
        </div>
        <div className={classNames('editor__right_metaData', 'editor__right_metaData'+(selectedType === '1' ? '-show' : '-hide'))}>
          <Mentions disabled={true} row={6} placeholder={`Meta data`}/>
        </div>
      </div>
    </>
  )
}

export default connect(({main: {workBranch, workPCD, projects, personObj, workPerson}}) => {
  let projectInd = [];
  let versionInd = [];
  let master = null;
  if(workPCD !== null) {
    // в мастере будет никнейм 
    mineInd(projects, workPCD.projectId, 'superId', projectInd);    
    mineInd(projects[projectInd[0]].versions, workPCD.workVersion, 'superId', versionInd);
    master = projects[projectInd[0]].versions[versionInd[0]].master
  };
  // я не должен думать, есть ли здесь эти данные.... 
  return {
    master,
    illustrations: projects[projectInd[0]].versions[versionInd[0]].illustrations,
    nickName: personObj.userData.nickName,
    workBranch, 
    v: workBranch.v,
    person: workPerson,
    workPCD,
    currentHeight: workPCD ? workPCD[workPCD.workVersion].height : null,
  }
}, {savePod, changeBranch, changeMaster, setIllustrations})(Editor)