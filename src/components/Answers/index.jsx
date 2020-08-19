import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux';
import {v4} from 'uuid'

import { Tabs } from 'antd';
import {Mentions, Input, Button} from '@/components'

import './Answers.scss'

const { TabPane } = Tabs;


// Проблема решается через абсолютное отключение от едитора и работой напрямую с ворк бренчем
// Так же в эдиторе все данные будут динамически редактировать ВБ

const Answers = ({value, setAnswers, setActiveKey, readOnly}) => {

  const Events = {
    addProps: function(arr) {
      return arr.map((el, i) => {
        el.closable = arr.length !== 2;
        el.key = i+'';
        return el;
      })
    },
    remove: function(targetKey) {
      const {panes, activeKey} = value;
      let newActiveKey,
      newPanes,
      workInd;
      for(let i in panes) {
        if(targetKey === panes[i].key) {
          workInd = i;
        }
      }
      newActiveKey = panes[workInd-(targetKey === "0" ? 0 : 1)].key
      let firstPart = [...panes].slice(0,+workInd);
      let secondPart = [...panes].slice(+workInd+1);
      newPanes = firstPart.concat(secondPart)

      newPanes = this.addProps(newPanes);
      setAnswers({
        activeKey: newActiveKey,
        panes: newPanes
      })
      //setTabsData()
    },
    add: function () {
      debugger
      let panes = value.panes
      let newPanes = [...panes].concat({content: "", ref: "", wayId: v4(), wayColor: 'pink'});
      newPanes = this.addProps(newPanes);
      setAnswers({panes: newPanes, activeKey: newPanes.length-1+'', })
    }
  }

  function changeHandl(ev) {
    setActiveKey({
      activeKey: ev
    })
  }

  function editHandl(targetKey, action) {
    Events[action](targetKey);
  }

  function questionChangeHandl(ev) {
    let newPanes = value.panes;
    newPanes[value.activeKey].content = ev;
    setAnswers({...value, panes: newPanes})
  }

  function refChangeHandl(ev) {
    ev.persist()

    let refData = ev.target.value;
    let newPanes = value.panes;
    newPanes[value.activeKey].ref = refData;
    setAnswers({...value,panes: newPanes })
  }

  const {panes, activeKey} = value;
  debugger
  return (
    <Tabs
      type={readOnly ? 'card' : "editable-card"}
      onChange={changeHandl}
      activeKey={activeKey}
      onEdit={editHandl}
      className=''
    >
      {panes.map((pane, i) => (
        <TabPane 
          tab={pane.key} 
          key={pane.key} 
          closable={activeKey === i+'' && pane.closable}>
          {<div style={{margin: "1px"}}>
            <Mentions 
              readOnly={readOnly} 
              row={3} 
              placeholder={'Answer..'} 
              value={pane.content} 
              changeHandler={questionChangeHandl}
              />
            <div className='refToPod'>
              <Input 
                readOnly={readOnly} 
                value={pane.ref} 
                placeholder="Ref" 
                changeHandler={refChangeHandl} 
                /> 
            </div>
            </div>}
        </TabPane>
      ))}
    </Tabs>
  )
}

export default Answers