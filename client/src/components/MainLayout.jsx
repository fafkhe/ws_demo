import { useState } from 'react'
import { Outlet, NavLink } from "react-router-dom";
// import '../App.css'

function App() {

  return (
    <>
      <div className='header'>
        <NavLink
          to="/"
          className={({isActive, isPending}) => 
            isActive
              ? "header_navigator_active"
              : "header_navigator"  
          }
        > Home </NavLink>
        <NavLink
          to="/currency/create"
          className={({isActive, isPending}) => 
            isActive
              ? "header_navigator_active"
              : "header_navigator"  
          }
        > Create Currency </NavLink>
        <NavLink
          to="/rate/create"
          className={({isActive, isPending}) => 
            isActive
              ? "header_navigator_active"
              : "header_navigator"  
          }
        > Create Rate </NavLink>
      </div>
      <Outlet />
    </>
  )
}

export default App
