import * as React from "react"
import { Link, type HeadFC, type PageProps } from "gatsby"
import Layout from "../components/Layout"

const Collection: React.FC<PageProps> = ({pageContext}) => {
  const data = pageContext as Queries.qCollectionsQuery["allAirtableScdItems"]["nodes"][0]["data"]
  const d = data!
  const faURL = d.collection_finding_aid_url && d.collection_finding_aid_url.startsWith("http") ? d.collection_finding_aid_url : `http://${d.collection_finding_aid_url}`
  const catURL = d.collection_catalog_url && d.collection_catalog_url.startsWith("http") ? d.collection_catalog_url : `http://${d.collection_catalog_url}`
  const webURL = d.collection_website_url && d.collection_website_url.startsWith("http") ? d.collection_website_url : `http://${d.collection_website_url}`
  const ctypes = d.content_types || []
  const langs = d.languages || []
  const loc = []
  d.collection_holder_city ? loc.push(d.collection_holder_city) : false;
  d.collection_holder_state ? loc.push(d.collection_holder_state) : false; 
  d.collection_holder_country ? loc.push(d.collection_holder_country) : false;

  return (
    <Layout>
      <div className="w-full max-w-hlg md:flex-nowrap md:justify-start justify-between items-center px-4 m-auto">
        <section className="px-0 mx-5">
          <article className="pt-4" key={d.collection_id}>
            <h2 className="text-4xl mb-5 font-medium">
            {d.collection_title}
            </h2>
            <p className="text-red-800 underline"><Link to="/search">« Back to search</Link></p>
            <table className="mb-8 border-separate border-spacing-2">
              <tbody>
                {d.collection_description && <tr>
                  <td className="text-slate-500 text-right align-text-top">Description:</td>
                  <td>{d.collection_description}</td>
                </tr>}
                { // additional fields for public entries.
                  d.scd_publish_status !== "collection-owner-title-description-only" && <>
                  <tr>
                    <td className="text-slate-500 text-right align-text-top">Content type{ctypes.length > 1 ? 's': ''}:</td>
                    <td>{ctypes.join("; ")}</td>
                  </tr>
                  {d.collectionFormats && <tr>
                    <td className="text-slate-500 text-right align-text-top">Format:</td>
                    <td>{d.collectionFormats}</td>
                  </tr>}
                  {d.collection_extent && <tr>
                    <td className="text-slate-500 text-right align-text-top">Extent:</td>
                    <td>{d.collection_extent}</td>
                  </tr>}
                  {langs.length > 0 &&
                    <tr>
                      <td className="text-slate-500 text-right align-text-top">Language{langs.length > 1 ? 's': ''}:</td>
                      <td>{langs.join("; ")}</td>
                    </tr>
                  }
                  {d.collection_notes && 
                    <tr>
                      <td className="text-slate-500 text-right align-text-top">Additional notes:</td>
                      <td>{d.collection_notes}</td>
                    </tr>
                  }
                  {d.collection_finding_aid_url && <tr>
                    <td className="text-slate-500 text-right align-text-top">Online finding aid:</td>
                    <td><a className="underline break-all" href={faURL}>View on {new URL(faURL).hostname}</a></td>
                  </tr>}
                  {d.collection_catalog_url && <tr>
                    <td className="text-slate-500 text-right align-text-top">Online catalog:</td>
                    <td><a className="underline break-all" href={catURL}>View on {new URL(catURL).hostname}</a></td>
                  </tr>}
                  {d.collection_website_url && <tr>
                    <td className="text-slate-500 text-right align-text-top">Collection website:</td>
                    <td><a className="underline break-all" href={webURL}>View on {new URL(webURL).hostname}</a></td>
                  </tr>}
                  </>
                }
                <tr>
                  <td className="text-slate-500 text-right align-text-top">Repository/Collector:</td>
                  <td>{d.collection_holder_name}</td>
                </tr>
                { // additional fields for public entries.
                  d.scd_publish_status !== "collection-owner-title-description-only" && <>
                  <tr>
                    <td className="text-slate-500 text-right align-text-top">Location:</td>
                    <td>{loc.join(", ")}</td>
                  </tr>
                  {d.collection_usage_statement && 
                    <tr>
                      <td className="text-slate-500 text-right align-text-top">Usage statement:</td>
                      <td>{d.collection_usage_statement}</td>
                    </tr>
                  }
                </>}
              </tbody>
            </table>
          </article>
        </section>
      </div>
    </Layout>
  )
}

export default Collection

export const Head: HeadFC = ({pageContext}) => <title>{(pageContext as Queries.qCollectionsQuery["allAirtableScdItems"]["nodes"][0]["data"])?.collection_title} | RPTF/ARSC Sound Collections Database</title>
