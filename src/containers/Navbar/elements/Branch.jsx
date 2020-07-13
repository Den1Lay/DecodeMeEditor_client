import React from 'react'

import {NavbarInput, NavbarButton} from '@/components'

const Navbar_Branch = () => {
  function branchInputHandl(ev) {
    ev.persist()
    console.log('%c%s', 'color: blue; font-size: 12px;', 'EV:', ev)
  }
  function branchSaveHandl(ev) {
    ev.persist();
    console.log('%c%s', 'color: blue; font-size: 12px;', 'EV:', ev)
  }
  function branchShowHandl(ev) {
    ev.persist();
    console.log('%c%s', 'color: blue; font-size: 12px;', 'EV:', ev)
  }
  return(
    <div className='navbar__branch'>
      <NavbarInput 
        placeholder={'Pods height'} 
        changeHandler={branchInputHandl}
        width={65}/>
      <NavbarButton 
        simbol={"Add"}
        clickHandler={branchSaveHandl}
        width={20}/>
      <NavbarButton
        simbol={"|"}
        clickHandler={branchShowHandl}
        width={5}/>
    </div>
  )
}

export default Navbar_Branch;