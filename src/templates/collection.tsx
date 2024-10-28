import * as React from "react"
import { graphql, Link, type HeadFC, type PageProps } from "gatsby"
import Layout from "../components/Layout"

const Collection: React.FC<PageProps> = ({pageContext}) => {
  const data = pageContext as Queries.qCollectionsQuery["allAirtableScdItems"]["nodes"][0]["data"]
  const d = data!
  const faURL = d._xxxcollectionFindingAidUrlxtxt && d._xxxcollectionFindingAidUrlxtxt.startsWith("http") ? d._xxxcollectionFindingAidUrlxtxt : `http://${d._xxxcollectionFindingAidUrlxtxt}`
  const catURL = d._xxxcollectionCatalogUrlxtxt && d._xxxcollectionCatalogUrlxtxt.startsWith("http") ? d._xxxcollectionCatalogUrlxtxt : `http://${d._xxxcollectionCatalogUrlxtxt}`
  const webURL = d._xxxcollectionWebsiteUrlxtxt && d._xxxcollectionWebsiteUrlxtxt.startsWith("http") ? d._xxxcollectionWebsiteUrlxtxt : `http://${d._xxxcollectionWebsiteUrlxtxt}`
  const ctypes = d._xxxcollectionContentTypesxtxtxxxcollectionContentTypesxtxt || []
  const genres = d._xxxcollectionGenresxtxtxxxcollectionGenresxtxt || []
  const langs = d._xxxcollectionLanguagesxtxtxxxcollectionLanguagesxtxt || []
  const loc = []
  d._xxxcollectionOwnerLocationCityxtxt ? loc.push(d._xxxcollectionOwnerLocationCityxtxt) : false;
  d._xxxcollectionOwnerLocationStatextxt ? loc.push(d._xxxcollectionOwnerLocationStatextxt) : false; 
  d._xxxcollectionOwnerLocationCountryxtxt ? loc.push(d._xxxcollectionOwnerLocationCountryxtxt) : false;

  return (
    <Layout>
      <div className="w-full max-w-hlg md:flex-nowrap md:justify-start justify-between items-center px-4 m-auto">
        <section className="px-0 mx-5">
          <article className="pt-4" key={d._xxxid}>
            <h2 className="text-4xl mb-5 font-medium">
            {d._xxxcollectionTitlextxt}
            </h2>
            <p className="text-red-800 underline"><Link to="/search">« Back to search</Link></p>
            <table className="mb-8 border-separate border-spacing-2">
              <tbody>
                {d._xxxcollectionDescriptionxtxt && <tr>
                  <td className="text-slate-500 text-right align-text-top">Description:</td>
                  <td>{d._xxxcollectionDescriptionxtxt}</td>
                </tr>}
                { // additional fields for public entries.
                  d.scd_publish_status !== "collection-owner-title-description-only" && <>
                  <tr>
                    <td className="text-slate-500 text-right align-text-top">Content type{ctypes.length > 1 ? 's': ''}:</td>
                    <td>{ctypes.join("; ")}</td>
                  </tr>
                  {genres.length > 0 &&
                    <tr>
                      <td className="text-slate-500 text-right align-text-top">Genre{genres.length > 1 ? 's': ''}:</td>
                      <td>{genres.join("; ")}</td>
                    </tr>
                  }
                  {d._xcollectionFormatsxtxtxxxcollectionFormatsxtxt && <tr>
                    <td className="text-slate-500 text-right align-text-top">Format:</td>
                    <td>{d._xcollectionFormatsxtxtxxxcollectionFormatsxtxt}</td>
                  </tr>}
                  {d._xxxcollectionExtentxtxt && <tr>
                    <td className="text-slate-500 text-right align-text-top">Extent:</td>
                    <td>{d._xxxcollectionExtentxtxt}</td>
                  </tr>}
                  {langs.length > 0 &&
                    <tr>
                      <td className="text-slate-500 text-right align-text-top">Language{langs.length > 1 ? 's': ''}:</td>
                      <td>{langs.join("; ")}</td>
                    </tr>
                  }
                  {d._xxxcollectionNotesxtxt && 
                    <tr>
                      <td className="text-slate-500 text-right align-text-top">Additional notes:</td>
                      <td>{d._xxxcollectionNotesxtxt}</td>
                    </tr>
                  }
                  {d._xxxcollectionFindingAidUrlxtxt && <tr>
                    <td className="text-slate-500 text-right align-text-top">Online finding aid:</td>
                    <td><a className="underline break-all" href={faURL}>View on {new URL(faURL).hostname}</a></td>
                  </tr>}
                  {d._xxxcollectionCatalogUrlxtxt && <tr>
                    <td className="text-slate-500 text-right align-text-top">Online catalog:</td>
                    <td><a className="underline break-all" href={catURL}>View on {new URL(catURL).hostname}</a></td>
                  </tr>}
                  {d._xxxcollectionWebsiteUrlxtxt && <tr>
                    <td className="text-slate-500 text-right align-text-top">Collection website:</td>
                    <td><a className="underline break-all" href={webURL}>View on {new URL(webURL).hostname}</a></td>
                  </tr>}
                  </>
                }
                <tr>
                  <td className="text-slate-500 text-right align-text-top">Repository/Collector:</td>
                  <td>{d._xxxcollectionOwnerNamextxt}</td>
                </tr>
                { // additional fields for public entries.
                  d.scd_publish_status !== "collection-owner-title-description-only" && <>
                  <tr>
                    <td className="text-slate-500 text-right align-text-top">Location:</td>
                    <td>{loc.join(", ")}</td>
                  </tr>
                  {d._xxxcollectionUsageStatementxtxt && 
                    <tr>
                      <td className="text-slate-500 text-right align-text-top">Usage statement:</td>
                      <td>{d._xxxcollectionUsageStatementxtxt}</td>
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

export const Head: HeadFC = ({pageContext}) => <title>{(pageContext as Queries.qCollectionsQuery["allAirtableScdItems"]["nodes"][0]["data"])?._xxxcollectionTitlextxt} | RPTF/ARSC Sound Collections Database</title>
