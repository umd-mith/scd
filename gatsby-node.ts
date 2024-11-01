import type { Actions, CreatePagesArgs, GatsbyNode } from "gatsby";
import path from "path";

interface IMakePages {
  createPage: Actions["createPage"]
  graphql: CreatePagesArgs["graphql"]
}

export const createPages: GatsbyNode["createPages"] = async ({ actions: { createPage }, graphql }) => {

  const utils: IMakePages = {createPage, graphql};

  await makeCollectionPages(utils)
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
            collection_holder_name
            collection_title
            collection_description
            collection_extent
            collectionFormats
            content_types
            collection_finding_aid_url
            collection_holder_country
            collection_holder_state
            collection_holder_city
            collection_catalog_url
            inventory_description
            languages
            collection_notes
            collection_usage_statement
            collection_website_url
          }
        }
      }
    }
  `)

  const {nodes} = (results.data as Queries.qCollectionsQuery).allAirtableScdItems;

  for (const node of nodes) {
    const collection = node.data
    createPage({
      path: `/collections/${collection?.collection_id}/`,
      component: path.resolve(`./src/templates/collection.tsx`),
      context: {
        ...collection
      }
    })
  }
}
