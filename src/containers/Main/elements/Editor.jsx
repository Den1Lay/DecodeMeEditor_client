import React, {useState} from 'react'

import {Mentions, Button, Input} from '@/components'
import {Dropdown, Menu} from 'antd'

const Editor = () => {
  //const [typesVisible, setTypesVisible] = useState(false)
  const [selectedType, setSelectedType] = useState('0');
  const menu = (
    <div className='editorsMenu'>
      <Menu 
      onSelect={({key}) => {
        console.log('EVE', key)
        setSelectedType(key)
      }}
      defaultSelectedKeys={[selectedType]}>
      <Menu.Item key={'0'}>
        POD
      </Menu.Item>
      <Menu.Item key={'1'}>QUESTION</Menu.Item>
    </Menu>
    </div>
  );
  return (
    <>
      <div className='editor__left'>
        <div style={{display: 'flex'}}>
          <div className='editor__left_dropMenu'>
            <Dropdown overlay={menu}>
              <div>
              <Button >
                TYPE
              </Button>
              </div>
            </Dropdown>
            {/* <Dropdown /> */}
          </div>
          <div className='editor__left_label'>
            <Input placeholder='Label' changeHandler={(ev) => console.log("CHANG_TEST", ev)} />
          </div>
        </div>
        <div className='editor__left_dialog'>
          <Mentions row={10} placeholder='Main part'/>
        </div>
      </div>

      <div className='editor__right'>
        <div style={{display: 'flex'}}>
          <div className='editor__right_space'>
          </div>
          <div className='editor__right_createBtn'>
            <Button >
              CREATE
            </Button>
          </div>
        </div>
        <div className='editor__right_dialog'>
          <Mentions row={10} placeholder={`Art's description`}/>
        </div>
      </div>
    </>
  )
}

export default Editor