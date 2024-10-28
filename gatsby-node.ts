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
            _xxxid
            scd_publish_status
            _xxxcollectionOwnerNamextxt
            _xxxcollectionTitlextxt
            _xxxcollectionDescriptionxtxt
            _xxxcollectionExtentxtxt
            _xcollectionFormatsxtxtxxxcollectionFormatsxtxt
            _xxxcollectionContentTypesxtxtxxxcollectionContentTypesxtxt
            _xxxcollectionGenresxtxtxxxcollectionGenresxtxt
            _xxxcollectionFindingAidUrlxtxt
            _xxxcollectionOwnerLocationCountryxtxt
            _xxxcollectionOwnerLocationStatextxt
            _xxxcollectionCatalogUrlxtxt
            _xxxcollectionInventoryDescriptionxtxtxxxcollectionInventoryDescriptionxtxt
            _xxxcollectionLanguagesxtxtxxxcollectionLanguagesxtxt
            _xxxcollectionNotesxtxt
            _xxxcollectionOwnerLocationCityxtxt
            _xxxcollectionUsageStatementxtxt
            _xxxcollectionWebsiteUrlxtxt
          }
        }
      }
    }
  `)

  const {nodes} = (results.data as Queries.qCollectionsQuery).allAirtableScdItems;

  for (const node of nodes) {
    const collection = node.data
    createPage({
      path: `/collections/${collection?._xxxid}/`,
      component: path.resolve(`./src/templates/collection.tsx`),
      context: {
        ...collection
      }
    })
  }
}
