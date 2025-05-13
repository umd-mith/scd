import * as React from "react"
import Layout from "../components/Layout"
import { type HeadFC } from "gatsby"

interface MdPageTemplateProps {
  pageContext: {
    title: string
    html: string
  }
}

export default function MdPageTemplate({pageContext}: MdPageTemplateProps) {
  const { title, html } = pageContext
  return (
    <Layout>
      <div className="w-full max-w-hlg md:flex-nowrap  md:justify-start justify-between items-center px-4 m-auto">
        <h2 className="text-4xl my-4">{title}</h2>
        <div dangerouslySetInnerHTML={{ __html: html }} className="prose mb-4 max-w-fit"/>
      </div>
    </Layout>
  )
}

export const Head: HeadFC = ({pageContext}) => <title>{(pageContext as {title: string}).title} | RPTF/ARSC Sound Collections Database</title>