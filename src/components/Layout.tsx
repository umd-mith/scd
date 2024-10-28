import * as React from "react"
import type { PropsWithChildren } from "react"
import Header from "./Header"
import Footer from "./Footer"

const Layout: React.FC<PropsWithChildren> = ({children}) => {
  return (<div>
      <Header/>
      <main style={{minHeight: "calc(100vh - 220px)"}}>{children}</main>
      <Footer/>
  </div>)
}

export default Layout
