import React from 'react'
import {connect} from 'react-redux'

import './Navbar.scss'

const Navbar = () => {
  return (
    <div className='navbar'>

    </div>
  )
}

const mapState = state => {
  console.log("STATE:", state)
return {
  state
}
},

mapDispatch = dispatch => {
  console.log("DISPATCH", dispatch)
  return {

  }
}
export default connect(mapState, mapDispatch )(Navbar)