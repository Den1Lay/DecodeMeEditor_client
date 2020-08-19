import React, {lazy} from 'react'
import {connect} from 'react-redux'

import {Navbar_Branch, Navbar_Main, Navbar_Social} from './elements'

import './Navbar.scss'

const Navbar = () => {
  
  return (
    <div className='navbar'>
      <Navbar_Branch />
      <Navbar_Main/>
      <Navbar_Social/>
    </div>
  )
}

const mapState = state => {

return {
  state
}
},

mapDispatch = dispatch => {

  return {

  }
}
export default connect(mapState, mapDispatch)(Navbar)