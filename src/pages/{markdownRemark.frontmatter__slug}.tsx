import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"

interface MdPageTemplateProps {
  data: {
    markdownRemark: {
      frontmatter: {
        title: string
      },
      html: string
    }
  }
}

export default function MdPageTemplate({data}: MdPageTemplateProps) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  return (
    <Layout>
      <div className="w-full max-w-hlg md:flex-nowrap  md:justify-start justify-between items-center px-4 m-auto">
        <h2 className="text-4xl my-4">{frontmatter.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: html }} className="prose mb-4 max-w-fit"/>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
      }
    }
  }
`