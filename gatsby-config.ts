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
    }
  ]
};

export default config;
