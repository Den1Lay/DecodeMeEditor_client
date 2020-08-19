import React from 'react'

import {Input} from '@/components'

const Navbar_Branch = () => {
  function branchInputHandl(ev) {
    ev.persist()
    //console.log('%c%s', 'color: blue; font-size: 12px;', 'EV:', ev)
  }
  // function branchSaveHandl(ev) {
  //   ev.persist();
  //   console.log('%c%s', 'color: blue; font-size: 12px;', 'EV:', ev)
  // }
  // function branchShowHandl(ev) {
  //   ev.persist();
  //   console.log('%c%s', 'color: blue; font-size: 12px;', 'EV:', ev)
  // }
  return(
    <div className='navbar__branch'>
      <div className='navbar__branch_podsInput'>
        <Input 
          place="navbar"
          placeholder={'Pods height (SOON)'} 
          changeHandler={branchInputHandl}/>
      </div>
      {/* <div className='navbar__branch_saveBtn' >
        <Button place="navbar">Add</Button>
      </div> */}
      {/* <NavbarButton 
        simbol={"Add"}
        clickHandler={branchSaveHandl}
        width={20}/> */}
      {/* <div className='navbar__branch_showBtn'>
        <Button place="navbar">|</Button>
      </div> */}
      {/* <NavbarButton
        simbol={""}
        clickHandler={branchShowHandl}
        width={5}/> */}
    </div>
  )
}

export default Navbar_Branch;