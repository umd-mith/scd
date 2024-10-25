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
      <h1>{frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
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