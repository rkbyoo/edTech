// import React from 'react'

import { Link } from "react-router-dom"

//here active is boolean which shows that the button is yellow or black and children is inner text and linkto is the route it will navigate to 
function CTAButton({linkto,children,active}) {
  return (
    <Link to={linkto}>
        <div className={`text-center text-[13px] px-6 py-3 rounded-md font-bold ${active?"bg-yellow-500 text-black":"bg-richblack-800"} hover:scale-95 transition-all duration-200`}>
            {children}
        </div>
    </Link>
  )
}

export default CTAButton
