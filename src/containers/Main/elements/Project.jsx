import React, {useState, useEffect}  from 'react'
import {connect} from 'react-redux'

import {Mentions, Dropdown, Button, Input, AccessSelect} from '@/components'
import {Select} from 'antd'

import {addProject, setupProject} from '@/actions'

const Project = ({addProject, friends, nickName, personSId, projects, workPCD, isSetup, setupProject}) => {
debugger
const [projectData, setProjectData] = useState({name: '', description: '', access: [], superAccess: []});

  useEffect(() => {
    let {access, superAccess} = projectData;
    if(!access.length || !superAccess.length) {
      if(isSetup) {
        // подъем уже существующих данных
        let projectInd;
        for(let i in projects) {
          if(projects[i].superId === workPCD.projectId) {
            projectInd = i;
          }
        };
        const {access, superAccess, name, description} = projects[projectInd];
        setProjectData({
          name,
          description,
          access,
          superAccess
        })
      } else {
        //инициализация почти пустых аксессов
        setProjectData({
          ...projectData,
          access: [personSId],
          superAccess: [personSId],
        })
      }
    };
  })

  function nameHandl(ev) {
    ev.persist()
    console.log(ev.target.value)
    setProjectData({
      ...projectData,
      name: ev.target.value+'',
    })
  }

  function descriptionHandl(ev) {
    setProjectData({
      ...projectData,
      description: ev+''
    })
  }

  function sumbitHandl() {
    
  }
  // ПОвторяющиеся никнеймы локаются.
  function getSuperId(nicks) {
    let superIdArr = [];
    if(nicks.includes('all')) {
      superIdArr.push('all')
    }
    nicks.forEach(nick => {
      friends.forEach(({userData: {superId, nickName}}) => {
        if(nick === nickName) {
          superIdArr.push(superId)
        }
      })
    });
    return superIdArr
  }

  function createOrSaveHandler() {
    //changeMaster(false)
    isSetup && setupProject(projectData);
    !isSetup && addProject(projectData)
  }

  // let defData = selectData.access.slice()
  //   .map(({superId, nickName}) => projectData.access.includes(superId) ? nickName : null);
  // let options = selectData.access.map(({nickName, disabled}) => ({value: nickName, disabled}));
  return (
    <>
      <div className='project__upPart'>
        <div className='project__upPart_input'>
          <Input placeholder='name' changeHandler={nameHandl} value={projectData.name}/>
        </div>
        <div className='project__upPart_space' />
        <div className='project__upPart_createBtn'>
          <Button clickHandler={createOrSaveHandler}>
            {isSetup ? "SAVE" : "CREATE"}
          </Button>
        </div>
      </div>
      <div className='project__bottomPart'>
        <div className='project__bottomPart_description'>
          <Mentions value={projectData.description} row={2} placeholder='description' changeHandler={descriptionHandl}/>
        </div>
        <div className='project__bottomPart_access'>
          <p>Юзеры, которые могут просматривать проект:</p>
          <AccessSelect 
              isCreate={isSetup === false}
              isSuper={false}
              changeHandler={(nickNames) => setProjectData({...projectData, access: [projectData.access[0]].concat(getSuperId(nickNames))}) } 
            />
        </div>
        <div className='project__bottomPart_access'>
          <p>Юзеры, которые могут создавать новые версии и редактировать другие, при возможности:</p>
          <AccessSelect 
              isCreate={isSetup === false}
              isSuper={true}
              changeHandler={(nickNames) => setProjectData({...projectData, superAccess: [projectData.superAccess[0]].concat(getSuperId(nickNames))})} 
            />
        </div>
      </div>
    </>
  )
}

export default connect(({main: {
  friends, 
  projects,
  workPCD,
  personObj: {
    userData: {
      nickName, 
      superId: personSId}
    }}}) => ({friends, nickName, personSId, projects, workPCD}), {addProject, setupProject})(Project)