// Добавит поля в форму создания. MetaData. Allowed
// Установить поля селектора по дефолту в ноль, и автоматически формироовать список с наиболее используемых

// БАГ. Не обновляется состояние выбранного проекта, после выброса. Лечится рестартом... Причина скорее
// всего в том, что компоненты не до конца управляемы. Хранят старые состояния...
import React, {useState, useEffect} from 'react'
import {connect, batch} from 'react-redux'
import classNames from 'classnames'

import {Input, Button} from '@/components'
import {Dropdown,Menu} from 'antd'

import {addProject, openPlace, selectProject, selectVersion, changeMaster} from '@/actions'

const Navbar_Main = (
  {
    projects, 
    selectProject, 
    selectVersion, 
    projectId, 
    workVersion,
    openPlace,
    changeMaster
  }) => {
debugger //changeMaster(false)
  //const {projectId, workVersion} = workPCD || {projectId: null, workVersion: null}
  //const [projectsDrop, setProjectsDrop] = useState(null)
  //const [checkData, setCheckData] = useState({cpId: null, cpL: null})
  //const [currentProject, setCurrentProject] = useState(null)
  const [showProjects, setShowProjects] = useState(false);
  
  const [hideDls, setHideDls] = useState(true);
  // function projectsSubmitHandl(ev) {
  //   ev.persist()
  // }
  // function projectsPickHandl(ev) {
  //   ev.persist()
  // }
  // function projectsInputHand(ev) {
  //   ev.persist()
  //   console.log('%c%s', 'color: blue; font-size: 12px;', 'EV:', ev.tarrget.value)
  // }
  // function projectsShowHandl(ev) {
  //   ev.persist()
  //   setShowProjects(!showProjects)
  //   console.log('%c%s', 'color: blue; font-size: 12px;', 'EV:', ev)
  // }
  // function savesShowHandl(ev) {
  //   ev.persist();
  //   console.log('%c%s', 'color: blue; font-size: 12px;', 'EV:', ev)
  // }
  // function mapShowHandl(ev) {
  //   ev.persist();
  //   console.log('%c%s', 'color: blue; font-size: 12px;', 'EV:', ev)
  // }


  // function pickElemHandl(ev) {
  //   let key = ev.key;
  //   console.log('Picked project ind: ', key)
  // }

  debugger
  let projectInd = undefined;
  for(let i=0;i<projects.length;i++) {
    if(projects[i].superId === projectId) {
      projectInd = i;
    }
  };
  let versionInd = undefined;
  if(projectInd !== undefined) {
    for(let i in projects[projectInd].versions) {
      if(projects[projectInd].versions[i].superId === workVersion) {
        versionInd = i;
      }
    }
  }
  // const {cpId, cpL} = checkData; 
  // useEffect(() => {
  //   if(projectsDrop === null || cpId !== projectId || cpL !== projects.length) {
  //     const drop = 
  //     ;

  //   batch(() => {
  //     setProjectsDrop(drop);
  //     setCheckData({cpId: projectId, cpL: projects.length})
  //   })
  //   }
  // })
  

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
  
  return (
    <div className='navbar__mainActions'>
      <div className='navbar__mainActions_projects'>
        <Dropdown 
          overlay={makeMenu({
            data: projects, 
            addHandler: () => {openPlace('project')}, 
            current: projectId,
            selectHandl: (ev) => {selectProject(ev.key); changeMaster(false)}})} 
          onVisibleChange={(ev) => console.log('OnVisibleChange', ev)}>
          <div><Input place='navbar' placeholder={(projects.length && projectInd !== undefined) 
              ? projects[projectInd].name 
              : projects.length
                ? "Choose some-thing"
                : "Let's create some-thing" } /></div>
        </Dropdown>
      </div>
      <div className='navbar__mainActions_saves'>
        {
         (projects.length && projectInd !== undefined)
         ? <Dropdown 
            overlay={makeMenu({
              data:projects[projectInd].versions , 
              addHandler: () => {openPlace('version')}, //ребилд | пока норм..
              current: workVersion,
              selectHandl: (ev) => {selectVersion(ev.key); changeMaster(false)}})}>
            <div><Input place='navbar' placeholder={projects[projectInd].versions[versionInd].comment}/></div>
          </Dropdown>
        : <Input place='navbar' placeholder='Nonee'/>
        }
      </div>
      {
        projectId && 
        <>
          <div className='navbar__mainActions_secure'>
            <Button place='navbar' clickHandler={() => openPlace('setup')}>
              Setup
            </Button>
          </div>
          <div className='navbar__mainActions_map'>
            <Button place='navbar' clickHandler={() => openPlace('map')}>
                Map
            </Button> 
          </div>
        </>
      }
      
      
    </div>
  )
}
//
export default connect(
  ({main: {demo_projects, projects, workPCD, workBranch}})=>({
    projects,
    projectId: workPCD ? workPCD.projectId : null,
    workVersion: workPCD ? workPCD.workVersion : null,
    v: workBranch.v
  }), 
  {addProject, openPlace, selectProject, selectVersion, changeMaster})(Navbar_Main)