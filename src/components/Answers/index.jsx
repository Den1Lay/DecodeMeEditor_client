import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux';

import { Tabs } from 'antd';
import {Mentions, Input, Button} from '@/components'

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


// Проблема решается через абсолютное отключение от едитора и работой напрямую с ворк бренчем
// Так же в эдиторе все данные будут динамически редактировать ВБ
const Answers = ({value, setAnswers, setActiveKey}) => {
  // const [tabsData, setTabsData] = useState({
  //   activeKey: '0',
  //   panes: [
  //     { content: '', key: '0', closable: false, ref: '' },
  //     { content: '', key: '1', closable: false, ref: '' },
  //   ]
  // });
  // useEffect(() => {
  //   console.log('RE_RENDER_ANSWERS', branch);
  //   if(tabsData.status === 'start') {
  //     setTabsData({...tabsData, 
  //       panes: branch.question ? 
  //       (() => {
  //         let res = [],
  //         count = branch.choseCount;
  //         count-=1;
  //         while(count >= 0) {
  //           const {ans, branch: {ref}} = branch['q'+count]
  //           res.unshift({content: ans, key: count+'', closable: false, ref: ''})
  //         }
  //         return res;
  //       })()
  //       : tabsData.panes,
  //       status: 'work'
  //     })
  //   }
  // })
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
      let newPanes = [...panes].concat({content: "", ref: ""});
      newPanes = this.addProps(newPanes);
      setAnswers({panes: newPanes, activeKey: newPanes.length-1+''})
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
          closable={activeKey === i+'' && pane.closable}>
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