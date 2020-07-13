// Добавит поля в форму создания. MetaData. Allowed
import React, {useState} from 'react'
import {connect} from 'react-redux'

import {Cascades, NavbarButton, NavbarInput, MainTextArea, MainButton, MainDataElem} from '@/components'

import {addProject} from '@/actions'

const Navbar_ProjectForm = ({addProject}) => {
  function creatProjectHandl(ev) {
    ev.preventDefault();
    ev.persist();
    console.log("SUBMIT_EV:", ev.target[0].value)
    addProject(ev.target[0].value)
  }

  return ( //32.8
    <form onSubmit={creatProjectHandl} className='projectForm'>
      <MainTextArea width={24.9} height={1.9} /> 
      <MainButton width={7.7} height={2.55} type={'submit'} simbol={"CREATE"}/>
    </form>
  )
}

const Navbar_Main = ({projects, addProject}) => {

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

  function dataPrepare(data) {
    let res = data
      .map((data, i) => <MainDataElem width={32.9} height={2.55} data={data} key={data.date}/>);
      res.unshift( <MainDataElem width={32.9} height={2.55} data={{name: 'Name', date: 'Date'}} key={'Date'}/>);
      console.log('RES:', res)
    return res;
  }
  return (
    <div className='navbar__mainActions'>
      {showProjects
        ? (<>
        <NavbarInput 
          placeholder={'Projects name / projects'} 
          changeHandler={projectsInputHand}
          width={50}/>
          <NavbarButton
            simbol={hideDls ? "Add" : "Data"}
            clickHandler={() => setHideDls(!hideDls)}
            width={5.5}/></>)
        : <NavbarButton
            simbol={"Projects name / projects"}
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
          dls={<Navbar_ProjectForm addProject={addProject} />} 
          top={5.4} 
          left={17}/>}
      <NavbarButton
        simbol={"Saves"}
        clickHandler={savesShowHandl}
        width={25}/>
      <NavbarButton
        simbol={"Map"}
        clickHandler={mapShowHandl}
        width={15}/>
    </div>
  )
}

export default connect(({main: {projects}})=>({projects}), {addProject})(Navbar_Main)