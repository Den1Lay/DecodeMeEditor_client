// Добавит поля в форму создания. MetaData. Allowed
// Установить поля селектора по дефолту в ноль, и автоматически формироовать список с наиболее используемых
import React, {useState} from 'react'
import {connect} from 'react-redux'
import classNames from 'classnames'

import {Cascades, NavbarButton, Input, MainTextArea, MainButton, MainDataElem, Button} from '@/components'
import {Dropdown,Menu} from 'antd'

import {addProject, opedProjectCreator, selectProject, openVersionsEditor} from '@/actions'

const Navbar_ProjectForm = ({addProject, onAddProject}) => {
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

const Navbar_Main = ({projects, currentProject, opedProjectCreator, selectProject, openVersionsEditor}) => {

  const [showProjects, setShowProjects] = useState(false)
  const [hideDls, setHideDls] = useState(true)
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
    selectProject(ev.key)
    //console.log('ON_SELECT_EVENT', ev)
  }
  

  function makeMenu({data, addHandler, current}) {
    let itemsArr = data.map(({name, date}, i) => {
      return (
        <Menu.Item 
          key={i+''} 
          className={classNames(i === currentProject && 'ant-menu-item-selected')}
          >
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <span>{name}</span>
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
          onSelect={onSelectHandl}
          defaultSelectedKeys={[curProjectInd]}> 
          {itemsArr}
        </Menu>
      </div>
    );
  }
  console.log('PROJ_LENGHT:',projects.length)

  return (
    <div className='navbar__mainActions'>
      {/* {showProjects
        ? (<>
        <Input
          placeholder={'Projects name / projects'} 
          changeHandler={projectsInputHand}
          width={50}/>
          <NavbarButton
            simbol={hideDls ? "Add" : "Data"}
            clickHandler={() => setHideDls(!hideDls)}
            width={5.5}/></>)
        : <NavbarButton
            simbol={currentProject ? currentProject : "Projects name / projects"}
            clickHandler={projectsShowHandl}
            width={57}/>}
        {showProjects && <Cascades 
          dlsStatus={hideDls}
          closeEvent={() => setShowProjects(!showProjects)}
          onSubmitForm={projectsSubmitHandl}
          onPickData={projectsPickHandl}
          width={32.8} 
          height={30} 
          data={dataPrepare(projects)} 
          dls={<Navbar_ProjectForm addProject={addProject} onAddProject={addProjectHandl} />} 
          top={5.4} 
          left={17}/>} */}
      <div className='navbar__mainActions_projects'>
        <Dropdown 
          overlay={makeMenu({
            data: projects, 
            addHandler: pickAddHandl, 
            current: currentProject})} 
          //visible={}
          //trigger={['click']} 
          onVisibleChange={(ev) => console.log('OnVisibleChange', ev)}>
          <div><Input place='navbar' placeholder={currentProject === null ? "Let's create some-thing" : projects[currentProject].name } /></div>
        </Dropdown>
      </div>
      <div className='navbar__mainActions_saves'>
        {
         projects.length
         ? <Dropdown 
            overlay={makeMenu({
              data:projects[currentProject].versions , 
              addHandler: () => openVersionsEditor(), 
              current: projects[currentProject].lastVersion})}>
            <div><Input place='navbar' placeholder={projects[currentProject].versions[projects[currentProject].lastVersion].comment}/></div>
          </Dropdown>
        : <Input place='navbar' placeholder='Nonee'/>
        }
      </div>
      <div className='navbar__mainActions_map'>
        <Button place='navbar'>
          Map
        </Button>
      </div>
      {/* <NavbarButton
        simbol={"Saves"}
        clickHandler={savesShowHandl}
        width={25}/>
      <NavbarButton
        simbol={"Map"}
        clickHandler={mapShowHandl}
        width={15}/> */}
    </div>
  )
}
//
export default connect(
  ({main: {demo_projects, projects, currentProject}})=>({projects, currentProject, versions: projects.length ?  projects[currentProject].versions : []}), 
  {addProject, opedProjectCreator, selectProject, openVersionsEditor})(Navbar_Main)