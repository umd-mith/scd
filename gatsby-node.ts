import type { Actions, CreatePagesArgs, GatsbyNode } from "gatsby";
import path from "path";

interface IMakePages {
  createPage: Actions["createPage"]
  graphql: CreatePagesArgs["graphql"]
}

export const createPages: GatsbyNode["createPages"] = async ({ actions: { createPage }, graphql }) => {

  const utils: IMakePages = {createPage, graphql};

  await makeCollectionPages(utils)
  await makeContentPages(utils)
}

async function makeContentPages({createPage, graphql}: IMakePages) {
  const results = await graphql(`
    query content {
      allMarkdownRemark {
        nodes {
          html
          frontmatter {
            slug
            title
          }
        }
      }
    }`)

    const r = results.data as Queries.contentQuery;
    const {nodes} = r.allMarkdownRemark;

    for (const content of nodes) {
      createPage({
        path: content?.frontmatter?.slug || "/err",
        component: path.resolve(`./src/templates/content.tsx`),
        context: {
          title: content?.frontmatter?.title,
          html: content?.html
        }
      })
    }
}

async function makeCollectionPages({createPage, graphql}: IMakePages) {
  const results = await graphql(`
      query qCollections {
      allAirtableScdItems(
        filter: {data: {scd_publish_status: {nin: ["duplicate-record-do-not-display", "do-not-display"]}}}
      ) {
        nodes {
          data {
            collection_id
            scd_publish_status
            record_type
            collection_content_category
            collection_title
            collection_description
            collection_holder_category
            collection_holder_name
            collection_holder_city
            collection_holder_state
            collection_holder_country
            content_types
            dates
            extent
            historical_relevance
            physical_formats
            access_statement
            finding_aid_url
            collection_catalog_url
            supporting_documentation
            languages
            inventory_description
            ssp_status
            subjects_all
            creators
            website_url
          }
        }
      }
      allAirtableScdFields {
        nodes {
          data {
            Fields
            scd_field_label_revised
          }
        }
      }
    }
  `)

  const r = results.data as Queries.qCollectionsQuery;
  const {nodes} = r.allAirtableScdItems;
  const fields = r.allAirtableScdFields.nodes;

  for (const node of nodes) {
    const collection = node.data
    createPage({
      path: `/collections/${collection?.collection_id}/`,
      component: path.resolve(`./src/templates/collection.tsx`),
      context: {
        collection: {...collection},
        fields
      }
    })
  }
}
