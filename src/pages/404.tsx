import * as React from "react"
import type { HeadFC } from "gatsby"
import Layout from "../components/Layout"

const NotFoundPage = () => {
  return (
    <Layout>
      <h2 className="text-[2rem] mb-2 leading-tight">404 Not Found.</h2>
    </Layout>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => <title>Not found</title>
