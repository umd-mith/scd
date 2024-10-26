import { Link } from "gatsby"
import * as React from "react"

import iLogo from "../images/logo.png"

const Header = () => {
  return (<>
  <header className="relative flex w-full bg-rose-800 py-2 px-4">
    <nav className="w-full max-w-hlg md:flex-nowrap  md:justify-start justify-between items-center px-4 m-auto flex">
      <Link to="/" className="mr-1 flex-logo h-[50px] w-[150px] overflow-hidden">
        <img src={iLogo} alt="SDC Logo" />
        RPTF/ARSC Sound Collections Database
      </Link>
      <ul className="flex basis-auto justify-end grow items-center list-none text-slate-100">
        <li className="p-2 hover:text-slate-300"><Link to="/about">About</Link></li>
        <li className="p-2 hover:text-slate-300"><Link to="#">Recommend a Collection</Link></li>
      </ul>
    </nav>
  </header>
  <div className="h-14">
    {/* This will hold the search bar */}
  </div>
  </>)
}

export default Header
