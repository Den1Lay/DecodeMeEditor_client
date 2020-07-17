import React, {useState} from 'react'

import { Tabs } from 'antd';
import {Mentions, Input} from '@/components'

import './Answers.scss'

const { TabPane } = Tabs;

// const initialPanes = [
//   { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
//   { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
//   {
//     title: 'Tab 3',
//     content: 'Content of Tab 3',
//     key: '3',
//     closable: true,
//   },
// ];

// class TabsBase extends React.Component {
//   newTabIndex = 0;

//   state = {
//     activeKey: initialPanes[0].key,
//     panes: initialPanes,
//   };

//   onChange = activeKey => {
//     this.setState({ activeKey });
//   };

//   onEdit = (targetKey, action) => {
//     console.log(`action: ${action}, targetKey:`, targetKey)
//     this[action](targetKey);
//   };

//   add = () => {
//     const { panes } = this.state;
//     const activeKey = `newTab${this.newTabIndex++}`;
//     const newPanes = [...panes];
//     newPanes.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey });
//     this.setState({
//       panes: newPanes,
//       activeKey,
//     });
//   };

//   remove = targetKey => {
//     console.log("REMOVE:", targetKey)
//     const { panes, activeKey } = this.state;
//     let newActiveKey = activeKey;
//     let lastIndex;
//     panes.forEach((pane, i) => {
//       if (pane.key === targetKey) {
//         lastIndex = i - 1;
//       }
//     });
//     const newPanes = panes.filter(pane => pane.key !== targetKey);
//     if (newPanes.length && newActiveKey === targetKey) {
//       if (lastIndex >= 0) {
//         newActiveKey = newPanes[lastIndex].key;
//       } else {
//         newActiveKey = newPanes[0].key;
//       }
//     }
//     this.setState({
//       panes: newPanes,
//       activeKey: newActiveKey,
//     });
//   };

//   render() {
//     const { panes, activeKey } = this.state;
//     return (
//       <Tabs
//         type="editable-card"
//         onChange={this.onChange}
//         activeKey={activeKey}
//         onEdit={this.onEdit}
//       >
//         {panes.map(pane => (
//           <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
//             {pane.content}
//           </TabPane>
//         ))}
//       </Tabs>
//     );
//   }
// }

const Answers = ({onNewAnswers}) => {
  const [tabsData, setTabsData] = useState({
    activeKey: '0',
    panes: [
      { content: '', key: '0', closable: false, ref: '' },
      { content: '', key: '1', closable: false, ref: '' },
    ]
  })
  const Events = {
    addProps: function(arr) {
      return arr.map((el, i) => {
        el.closable = arr.length !== 2;
        el.key = i+'';
        return el;
      })
    },
    remove: function(targetKey) {
      const {panes, activeKey} = tabsData;
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
      
      setTabsData({
        activeKey: newActiveKey,
        panes: newPanes
      })
    },
    add: function () {
      let newPanes = [...panes].concat({content: "", ref: ""});
      newPanes = this.addProps(newPanes);
      setTabsData({panes: newPanes, activeKey: newPanes.length-1+''})
    }
  }

  function changeHandl(ev) {
    setTabsData({
      ...tabsData,
      activeKey: ev
    })
  }

  function editHandl(targetKey, action) {
    Events[action](targetKey);
  }

  function questionChangeHandl(ev) {
    let newPanes = tabsData.panes;
    newPanes[tabsData.activeKey].content = ev;
    onNewAnswers(newPanes)
    setTabsData({...tabsData, panes: newPanes})
  }

  function refChangeHandl(ev) {
    ev.persist()

    let refData = ev.target.value;
    let newPanes = tabsData.panes;
    newPanes[tabsData.activeKey].ref = refData;
    setTabsData({...tabsData, panes: newPanes})
  }

  const {panes, activeKey} = tabsData;
  return (
    <Tabs
      type="editable-card"
      onChange={changeHandl}
      activeKey={activeKey}
      onEdit={editHandl}
      className=''
    >
      {panes.map((pane, i) => (
        <TabPane 
          tab={pane.key} 
          key={pane.key} 
          closable={tabsData.activeKey === i+'' && pane.closable}>
          {<div style={{margin: "1px"}}>
            <Mentions row={3} placeholder={'Answer..'} value={pane.content} changeHandler={questionChangeHandl}/>
            <div className='refToPod'>
              <Input value={pane.ref} placeholder="Ref" changeHandler={refChangeHandl} /> 
            </div>
            </div>}
        </TabPane>
      ))}
    </Tabs>
  )
}

export default Answers