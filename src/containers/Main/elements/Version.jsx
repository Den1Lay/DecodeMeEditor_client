import React, {useState}  from 'react'
import {connect} from 'react-redux'

import {Mentions, Dropdown, Button, Input} from '@/components'

import {addVersion} from '@/actions'

const Version = ({addVersion}) => {

const [projectData, setProjectData] = useState({comment: '', description: ''})

  function nameHandl(ev) {
    ev.persist()
    console.log(ev.target.value)
    setProjectData({
      ...projectData,
      comment: ev.target.value+''
    })
  }

  function descriptionHandl(ev) {
    setProjectData({
      ...projectData,
      description: ev+''
    })
  }

  function sumbitHandl() {
    addVersion(projectData)
  }

  return (
    <>
      <div className='version__input'>
        <Input placeholder='comment' changeHandler={nameHandl}/>
      </div>
      <div className='version__space' ></div>
      <div className='version__createBtn'>
        <Button clickHandler={sumbitHandl}>
          CREATE
        </Button>
      </div>
    </>
  )
}

export default connect(({}) => ({}), {addVersion})(Version)