import React, {useState}  from 'react'
import {connect} from 'react-redux'

import {Mentions, Dropdown, Button, Input} from '@/components'

import {addProject} from '@/actions'

const Project = ({addProject}) => {

const [projectData, setProjectData] = useState({name: '', description: ''})

  function nameHandl(ev) {
    ev.persist()
    console.log(ev.target.value)
    setProjectData({
      ...projectData,
      name: ev.target.value+''
    })
  }

  function descriptionHandl(ev) {
    setProjectData({
      ...projectData,
      description: ev+''
    })
  }

  function sumbitHandl() {
    addProject(projectData)
  }

  return (
    <>
      <div className='project__upPart'>
        <div className='project__upPart_input'>
          <Input placeholder='name' changeHandler={nameHandl}/>
        </div>
        <div className='project__upPart_space' />
        <div className='project__upPart_createBtn'>
          <Button clickHandler={sumbitHandl}>
            CREATE
          </Button>
        </div>
      </div>
      <div className='project__bottomPart'>
        <div className='project__bottomPart_description'>
          <Mentions value={projectData.description} row={2} placeholder='description' changeHandler={descriptionHandl}/>
        </div>
      </div>
    </>
  )
}

export default connect(({}) => ({}), {addProject})(Project)