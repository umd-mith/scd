import * as React from "react"
import type { PropsWithChildren } from "react"
import Header from "./Header"
import Footer from "./Footer"

const Layout: React.FC<PropsWithChildren> = ({children}) => {
  return (<>
      <Header/>
      <main>{children}</main>
      <Footer/>
  </>)
}

export default Layout
