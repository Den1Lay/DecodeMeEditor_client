// данные прилетают из уже существуюего дерева. Оно инициализируется с созданием проекта.
// Информирование о пустых полях... Формик?...

// Компонент отвечает за вывод и ввод данных о текущем поде или вопросе. Позволяет переключаться 
// Между этими состояниями, а так же переключатся во вложенность вопроса. 
// Так же при работе с изображениями все акшены вынесены в тело этого компонента.

// Возможно это должно быть не здесь, но путь как целостная вещь наследуется по нулевому 
// вопросу и базируется на уровне версии.
import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import classNames from 'classnames'
import {v4} from 'uuid'

import {Mentions, Button, Input, Answers, ArtPart, Directions} from '@/components'
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
    wayObj,
    ways,
    setIllustrations, 
  }) => {
    debugger
  // проверка на сохранение...
  const [selectedType, setSelectedType] = useState('0'); // 0: POD, 1: QUESTION
  const [data, setData] = useState({ // главное хранилище рабочих данных 
    label: "",
    mainPart: "",
    comment: "",
    artsDesription: "",
    artSrc: null,
    branchDirection: "",
    answers: [],
    activeKey: "0",
  })
  const [checkCoord, setCheckCoord] = useState({checkHeight: null, checkPath: null}); // основые маркеры сравнения
  const [saveState, setSaveState] = useState(null) // отвечает за том можно ли переместиться внутрь ответа или нет.
  // Если данные не сохранены появлется не определенность в существовании ответа и баги. В будущем будут автосохранения
  // С подтверждениями критических действий (удалить ответ, ВОПРОС)

useEffect(() => {

  // здесь просходит основная магия ресборки. Сначала проверка на новые данные 
  let currentPath = workBranch.pos;
  const {checkHeight, checkPath, checkV} = checkCoord; 
  
  // надо добавить марке сравнения по проектам, хотя с этой работой справляется V
  // последним звеном в проверке является фильтрация на V диспатч с изменением мастера, смотри описание eventHandl

  if(workBranch.branch.base && ((currentHeight !== checkHeight) || (currentPath !== checkPath) || (v !== checkV && v[0] !== 'a'))) {
    
    // возможно некоторые проверки (чек данные ) рудиментарны..
    // выбор источника данных (вопрос или база) на основе данных PCD данных (чекни коннект)
    
    let dataSource = currentHeight !== 'question' ? workBranch.branch.base[currentHeight] : workBranch.branch.question;
    debugger  
    const {label, main, comment, picture: {src, alt}} = dataSource;  

      // стандарный, пустой пак вопрос, который подставляется, если под не вопрос
      // по факту просто заглушка для того, что бы было что подставить
      // при переключении на вопрос

      let answers = [ 
        { content: '', key: '0', closable: false, ref: '' }, // wayId: wayObj.wayId, wayColor: wayObj.color
        { content: '', key: '1', closable: false, ref: '' }, // wayId: v4(), wayColor: 'grey'
      ];
      
        // объявлены просто что бы было удобней вытаскивать
        let realWorkBranch = workBranch.branch; 
        let choseCount = realWorkBranch.choseCount;

        // если все такие есть вопросы, значит есть и ответы, которые нужно вытащить и закинуть в рабочую область
        if(choseCount) { 

          let newAnswers = []

          // формирование правильного ключа и создание нового массива ответов
          for(let i = 0; i < choseCount; i++) {

            let natKey = 'q'+i
            let {ans, branch: {ref, wayId}} = realWorkBranch[natKey];

            // let wayInd=[];
            // mineInd(ways,wayId,'wayId',wayInd)

            newAnswers.push({content: ans, key: i+'', closable: choseCount > 2, ref: ref ? ref : ''}) // wayId, color: ways[wayInd[0]].color
          }
          answers = newAnswers;
        }
      // подстановка существующих данных
      setData({
        label, 
        mainPart: main, 
        comment, 
        artsDesription: alt,

        // проверка на удаленную картинку => при следующем сохранении данные будут перезаписаны.
        artSrc: illustrations.some(({src: baseSrc}) => baseSrc === src) ? src : null,
        answers,
        activeKey: "0",
        branchDirection: workBranch.branch.branchDirection,
        // wayDirection: wayObj.wayDirection
      });
      setCheckCoord({checkHeight: currentHeight, checkPath: currentPath, checkV: v});
      setSelectedType(currentHeight !== 'question' ? "0" : "1");
      setSaveState(workBranch.v)
  }
})

  let noMaster = master === null;

  function masterHandl() {

    // работой с переменной мастера, установка, отдача и запрос права у владельца права в комнате.
    debugger
    noMaster && changeMaster(true);
    if(master === nickName) {
      changeMaster(false)
    } else {
      // masterRequst   
      socket.emit('REQUEST_RIGHT', {token: localStorage.token, person})
    }
    
  }

  function eventHandl(cb = null) {
    
    // мидл, который отлавливает действия для автоматического включения мастера и десейва.

    // при включении мастера происходит диспатч с сайд эффектом от V, который улетает 
    // в виде сокет запроса на сервер и информирует всех, кто в комнате о изменении мастера на каком - либо
    // проекте. Здесь при изменении мастера я локально сетую его и игнорю изменения связанные с мастером, тем самым не
    // перерисовываю данные. Делается это для того что бы первый клик был услышан и сохранился в виде данных в основном 
    // хранилище, а иначе оно просто перерисуется с пустыми или старыми данными. 

    // можно чекать те данные которые уже имеются, но тогда нужно интегрировать проверки.. 
    // которые улетят на ребилд с полным переосмыслением рабочего процесса и архитектуры.
    debugger
    setSaveState(false);
    noMaster && changeMaster(true);
    cb && cb()
  }

  function fileHandler(ev) {

    // работа с картинкой, которая прилетает из вне. Как только это происходит она автоматически назначается как рабочая
    // и сохраняется на яндекс диске 

    ev.persist();
    debugger
    let formData = new FormData();
    let workFile = ev.target.files[0];
    let dataType = workFile.name.substring(0).split('.');
    let newName = `${v4()}.${dataType[dataType.length-1]}`;

    formData.append('picture', workFile, workFile.name);

    // отправка форм даты с соотвествующим контент тайпом

    axios.post('/image', formData, {
      headers: { 'Content-Type': "multipart/form-data", 'newname': newName}
    }).then(({data: src}) => {

      // пример рабочей бездиспатчевой логики 

      let newIllustration = {name: ev.target.files[0].name, src}
      socket.emit('SET_ILLUSTRATIONS', {token: localStorage.token, person, workPCD, newIllustration, action: 'ADD'})
      setData({...data, artSrc: src });

      //!!! добавить знатный денжер о всех последствиях удаления картинки

    })
  }

  function setIllust(src = null) {

    // работа с тем, что будет или небудет показано

    setData({...data, artSrc: src})
  }

  function removeIllust(src) { //!!!--- Еще одно исключение??? РЕбилдни логику на съедание сендер эвента
    
    // удаление картинки, как из пакета иллюстраций так и с яндекс диска
    
    setData({...data, artSrc: null});
    let workIllust;
    for(let picture of illustrations) {
      if(picture.src === src) {
        workIllust = picture
      }
    }
    socket.emit('SET_ILLUSTRATIONS', {token: localStorage.token, person, workPCD, newIllustration: workIllust, action: 'REMOVE'})
  }

  function typeBtnHandler() {

    // смотри описание эвент хендлера ( eventHandl )

    eventHandl(setSelectedType(selectedType === "0" ? "1" : "0"));
    
  }

  const {label, mainPart, comment, artsDesription, branchDirection, wayDirection: cWayDirection, answers, activeKey, artSrc} = data;
  return (
    <>
      <div className='editor__left'>
        <div style={{display: 'flex'}}>
          <div className='editor__left_dropMenu'>
          <Button clickHandler={() => {
             currentHeight !== null && (workBranch.branch.choseCount === 0 || currentHeight === 'question') && typeBtnHandler();
          }}>
            {selectedType === '0' ? "POD" : "QUESTION"}
          </Button>
            
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
            <Button clickHandler={() => {changeBranch(+activeKey)}}>CROSS</Button>
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
                {noMaster 
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
            unsetIllust={setIllust}
            setIllust={setIllust}
            removeIllust={removeIllust}
            />
          {/* <Mentions  row={10} placeholder={`Arts description`} changeHandler={}/> */}
        </div>
        <div className='editor__right_branchDir'>
          <Directions 
            row={7}
            wayHandler={() => ({})}
            branchHandler={ev => { setData({...data, wayDirection: ev}); eventHandl();}}
            wayDirection={cWayDirection}
            branchDirection={branchDirection}/>
          {/* <Mentions 
            value={branchDirection} 
            row={7} 
            placeholder={`Branches direction`} 
            changeHandler={ev => {; eventHandl()}}/> */}
        </div>
        <div className={classNames('editor__right_metaData', 'editor__right_metaData'+(selectedType === '1' ? '-show' : '-hide'))}>
          <Mentions disabled={true} row={6} placeholder={"Meta data"}/>
        </div>
      </div>
    </>
  )
}

export default connect(({main: {workBranch, workPCD, projects, personObj, workPerson}}) => {

  // мастер дата - информация о присутствии какого - либо чела за работой над версией. Используется для того
  // Что бы локать возможность редачить дригим персонажам, которые сейчас просматривают проект, а иначе нужно буфферить
  // То что воводит один, отправляет другой. В общем исключаются другие источники истины, кроме рабочего чела.

  let projectInd = [];
  let versionInd = [];
  let master = null;
  let wayObj = null; // EXP режим, исправить на '';
  if(workPCD !== null) {
    // в мастере будет никнейм 
    mineInd(projects, workPCD.projectId, 'superId', projectInd);    
    mineInd(projects[projectInd[0]].versions, workPCD.workVersion, 'superId', versionInd);
    master = projects[projectInd[0]].versions[versionInd[0]].master
  };

  //let wayInd = [];
  //mineInd(projects[projectInd[0]].versions[versionInd[0]].ways, workBranch.wayId, 'wayId', wayInd);
  //wayObj = projects[projectInd[0]].versions[versionInd[0]].ways[wayInd[0]];
  // я не должен думать, есть ли здесь эти данные.... 
  return {
    master,
    illustrations:workPCD ? projects[projectInd[0]].versions[versionInd[0]].illustrations : [],
    nickName: personObj.userData.nickName,
    //wayObj, 
    v: workBranch.v,
    workBranch,
    person: workPerson,
    workPCD,
    //ways: projects[projectInd[0]].versions[versionInd[0]].ways[wayInd[0]],
    paths:workPCD ? projects[projectInd[0]].versions[versionInd[0]].paths : [],
    currentHeight: workPCD ? workPCD[workPCD.workVersion].height : null, // обертка для поддержания первичной логики
  }
}, {savePod, changeBranch, changeMaster, setIllustrations})(Editor)