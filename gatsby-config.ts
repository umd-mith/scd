import type { GatsbyConfig } from "gatsby";

const baseId = process.env.AIRTABLE_SCD_BASE_ID;
const basePath = process.env.BASEPATH

const config: GatsbyConfig = {
  pathPrefix: basePath,
  siteMetadata: {
    title: `scd`,
    siteUrl: `https://www.yourdomain.tld`
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-postcss",
    "gatsby-plugin-image",
    "gatsby-transformer-remark",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "images",
        "path": "./src/images/"
      },
      __key: "images"
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "pages",
        "path": "./src/pages/"
      },
      __key: "pages"
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "mdpages",
        "path": "./src/content/"
      },
      __key: "mdpages"
    }, 
    {
      resolve: `gatsby-source-airtable`,
      options: {
        apiKey: process.env.AIRTABLE_TOKEN,
        concurrency: 5,
        tables: [
          {
            baseId,
            tableName: `Collections-NEW`,
            tableView: `RPTF SCD: All Records/Fields`,
            queryName: `ScdItems`,
            separateNodeType: true
          },
          {
            baseId,
            tableName: `Metadata Dictionary NEW`,
            tableView: `SCD Fields - Public Facets`,
            queryName: `ScdFacets`,
            separateNodeType: true
          },
          {
            baseId,
            tableName: `Metadata Dictionary NEW`,
            tableView: `SCD Fields - Public Portal (Revised)`,
            queryName: `ScdFields`,
            separateNodeType: true
          },
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-local-search',
      options: {
        // A unique name for the search index. This should be descriptive of
        // what the index contains. This is required.
        name: 'collections',

        // Set the search engine to create the index. This is required.
        // The following engines are supported: flexsearch, lunr
        engine: 'flexsearch',

        // Provide options to the engine. This is optional and only recommended
        // for advanced users.
        //
        // Note: Only the flexsearch engine supports options.
        engineOptions: 'speed',

        // GraphQL query used to fetch all data for the search index. This is
        // required.
        query: `
          {
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
                  subjects
                  creators
                  physical_formats
                  access_statement
                  finding_aid_url
                  collection_catalog_url
                  supporting_documentation
                  languages
                  inventory_description
                }
              }
            }
          }
        `,

        // Field used as the reference value for each document.
        // Default: 'id'.
        ref: 'collection_id',

        // List of keys to index. The values of the keys are taken from the
        // normalizer function below.
        // Default: all fields
        // index: ['title', 'body'],

        // List of keys to store and make available in your UI. The values of
        // the keys are taken from the normalizer function below.
        // Default: all fields
        store: ['collection_id'],

        // Function used to map the result from the GraphQL query. This should
        // return an array of items to index in the form of flat objects
        // containing properties to index. The objects must contain the `ref`
        // field above (default: 'id'). This is required.
        normalizer: ({ data }: {data: Queries.qCollectionsQuery}) =>
          data.allAirtableScdItems.nodes.map((node) => {
            const d = node.data!
            return ({
            collection_id: d.collection_id,
            scd_publish_status: d.scd_publish_status,
            record_type: d.record_type,
            collection_content_category: d.collection_content_category,
            collection_title: d.collection_title,
            collection_description: d.collection_description,
            collection_holder_category: d.collection_holder_category,
            collection_holder_name: d.collection_holder_name,
            collection_holder_city: d.collection_holder_city,
            collection_holder_state: d.collection_holder_state,
            collection_holder_country: d.collection_holder_country,
            content_types: d.content_types,
            dates: d.dates,
            extent: d.extent,
            historical_relevance: d.historical_relevance,
            subjects: d.subjects,
            creators: d.creators,
            physical_formats: d.physical_formats,
            access_statement: d.access_statement,
            finding_aid_url: d.finding_aid_url,
            collection_catalog_url: d.collection_catalog_url,
            supporting_documentation: d.supporting_documentation,
            languages: d.languages,
            inventory_description: d.inventory_description
          })}),
      },
    },
  ]
};

export default config;
