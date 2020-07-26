// Добавит поля в форму создания. MetaData. Allowed
// Установить поля селектора по дефолту в ноль, и автоматически формироовать список с наиболее используемых
import React, {useState} from 'react'
import {connect} from 'react-redux'
import classNames from 'classnames'

import {Cascades, NavbarButton, Input, MainTextArea, MainButton, MainDataElem, Button} from '@/components'
import {Dropdown,Menu} from 'antd'

import {addProject, opedProjectCreator, selectProject, openVersionsEditor, selectVersion} from '@/actions'

const Navbar_ProjectForm = ({addProject, onAddProject, workPCD}) => {
  function creatProjectHandl(ev) {
    ev.preventDefault();
    ev.persist();
    console.log("SUBMIT_EV:", ev.target[0].value)
    addProject(ev.target[0].value);
    onAddProject()
  }

  return ( //32.8
    <form onSubmit={creatProjectHandl} className='projectForm'>
      <MainTextArea width={24.9} height={1.9} /> 
      <MainButton width={7.7} height={2.55} type={'submit'} simbol={"CREATE"}/>
    </form>
  )
}

const Navbar_Main = ({projects, opedProjectCreator, selectProject, selectVersion, openVersionsEditor, projectId, workVersion}) => {
debugger
  //const {projectId, workVersion} = workPCD || {projectId: null, workVersion: null}
  const [showProjects, setShowProjects] = useState(false);
  const [hideDls, setHideDls] = useState(true);
  function projectsSubmitHandl(ev) {
    ev.persist()
  }
  function projectsPickHandl(ev) {
    ev.persist()
  }
  function projectsInputHand(ev) {
    ev.persist()
    console.log('%c%s', 'color: blue; font-size: 12px;', 'EV:', ev.tarrget.value)
  }
  function projectsShowHandl(ev) {
    ev.persist()
    setShowProjects(!showProjects)
    console.log('%c%s', 'color: blue; font-size: 12px;', 'EV:', ev)
  }
  function savesShowHandl(ev) {
    ev.persist();
    console.log('%c%s', 'color: blue; font-size: 12px;', 'EV:', ev)
  }
  function mapShowHandl(ev) {
    ev.persist();
    console.log('%c%s', 'color: blue; font-size: 12px;', 'EV:', ev)
  }


  function pickAddHandl(ev) {
    opedProjectCreator()
  }

  // function pickElemHandl(ev) {
  //   let key = ev.key;
  //   console.log('Picked project ind: ', key)
  // }

  function onSelectHandl(ev) {
    
    //console.log('ON_SELECT_EVENT', ev)
  }
  

  function makeMenu({data, addHandler, current, selectHandl}) { // ребилдни PCD там должен быть uuid в индикаторе версии
    let itemsArr = data.map(({name, date, superId, comment=false}, i) => {
      return (
        <Menu.Item 
          key={superId+''} 
          className={classNames(superId === current && 'ant-menu-item-selected')}
          >
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <span>{comment ? comment : name}</span>
            <span>{date}</span>
          </div>
        </Menu.Item>)
    })
    let curProjectInd = current+'';
    return (
      <div className="setuper" style={{width: '100%', display: "flex", flexDirection: 'column'}}>
        <div>
          <Button clickHandler={addHandler}>
            ADD NEW
          </Button>
        </div>
        <Menu 
          onSelect={selectHandl}
          //defaultSelectedKeys={[curProjectInd]}
          > 
          {itemsArr}
        </Menu>
      </div>
    );
  }
  //console.log('PROJ_LENGHT:',projects.length)
  let projectInd = null;
  for(let i=0;i<projects.length;i++) {
    if(projects[i].superId === projectId) {
      projectInd = i;
    }
  };
  let versionInd = null;
  if(projectInd !== null) {
    for(let i in projects[projectInd].versions) {
      if(projects[projectInd].versions[i].superId === workVersion) {
        versionInd = i;
      }
    }
  }

  return (
    <div className='navbar__mainActions'>
      <div className='navbar__mainActions_projects'>
        <Dropdown 
          overlay={makeMenu({
            data: projects, 
            addHandler: pickAddHandl, 
            current: projectId,
            selectHandl: (ev) => selectProject(ev.key)})} 
          onVisibleChange={(ev) => console.log('OnVisibleChange', ev)}>
          <div><Input place='navbar' placeholder={projects.length ? projects[projectInd].name : "Let's create some-thing" } /></div>
        </Dropdown>
      </div>
      <div className='navbar__mainActions_saves'>
        {
         projects.length
         ? <Dropdown 
            overlay={makeMenu({
              data:projects[projectInd].versions , 
              addHandler: () => openVersionsEditor(), //ребилд | пока норм..
              current: workVersion,
              selectHandl: (ev) => selectVersion(ev.key)})}>
            <div><Input place='navbar' placeholder={projects[projectInd].versions[versionInd].comment}/></div>
          </Dropdown>
        : <Input place='navbar' placeholder='Nonee'/>
        }
      </div>
      <div className='navbar__mainActions_map'>
        <Button place='navbar'>
          Map
        </Button>
      </div>
    </div>
  )
}
//
export default connect(
  ({main: {demo_projects, projects, workPCD}})=>({
    projects,
    projectId: workPCD ? workPCD.projectId : null,
    workVersion: workPCD ? workPCD.workVersion : null
  }), 
  {addProject, opedProjectCreator, selectProject, openVersionsEditor, selectVersion})(Navbar_Main)