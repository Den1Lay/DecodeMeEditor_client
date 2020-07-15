import React from 'react'

import {Menu, Dropdown} from 'antd'
import {Input} from '@/components'

import './Dropdown.scss'

const DropdownBase = () => {
  const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
          2nd menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
          3rd menu item
        </a>
      </Menu.Item>
    </Menu>
  );

  return(
    <Dropdown overlay={menu} placement="bottomLeft"  >
      <div style={{width: "100%"}}><Input  placeholder="place"/></div>
    </Dropdown>
  )
}



export default DropdownBase;