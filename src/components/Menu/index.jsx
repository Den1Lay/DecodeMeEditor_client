import React from 'react'

import {Menu} from 'antd';
import {Button} from '@/components'

import './Menu.scss'

const MenuBase = ({currentProject}) => {
  return (
    <div style={{width: '70%', marginTop: '1%', display: "flex", flexDirection: 'column'}}>
      <div>
        <Button>
          ADD NEW
        </Button>
      </div>
      <Menu defaultSelectedKeys={[currentProject+'']}>
        <Menu.Item key={'0'}>
          Push
        </Menu.Item>
        <Menu.Item key={'1'}>
            2nd menu ite
        </Menu.Item>
        <Menu.Item key={'2'}>
            3rd menu item
        </Menu.Item>
      </Menu>
    </div>
  )
}

export default MenuBase

// (
  // <div style={{width: '70%', marginTop: '1%'}}>
  //     <Menu>
  //       <Menu.Item key={'1'}>
  //         Push
  //       </Menu.Item>
  //       <Menu.Item key={'2'}>
  //         <a target="_blank" rel="noopener noreferrer">
  //           2nd menu item
  //         </a>
  //       </Menu.Item>
  //       <Menu.Item key={'3'}>
  //         <a target="_blank" rel="noopener noreferrer">
  //           3rd menu item
  //         </a>
  //       </Menu.Item>
  //     </Menu>
  // </div>
//  