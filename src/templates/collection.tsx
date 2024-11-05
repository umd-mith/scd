import * as React from "react"
import { Link, type HeadFC, type PageProps } from "gatsby"
import Layout from "../components/Layout"

const Collection: React.FC<PageProps> = ({pageContext}) => {
  const context = pageContext as {
    collection: Queries.qCollectionsQuery["allAirtableScdItems"]["nodes"][0]["data"]
    fields: Queries.qCollectionsQuery["allAirtableScdFields"]["nodes"]
  }

  const getLabel = (label: string) => {
    const f = context.fields.find(field => field.data!.Fields!.replace(/-/g, "_") === label)
    if (f) {
      return f.data!.scd_field_label_revised
    }
    return label
  }
  
  const d = context.collection!
  const faURL = d.finding_aid_url && d.finding_aid_url.startsWith("http") ? d.finding_aid_url : `http://${d.finding_aid_url}`
  const catURL = d.collection_catalog_url && d.collection_catalog_url.startsWith("http") ? d.collection_catalog_url : `http://${d.collection_catalog_url}`
  const ctypes = d.content_types || []
  const subjects = d.subjects || []
  const formats = d.physical_formats || []
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
                  <td className="text-slate-500 text-right align-text-top">{getLabel("collection_description")}:</td>
                  <td>{d.collection_description}</td>
                </tr>}
                { // additional fields for public entries.
                  d.scd_publish_status !== "collection-owner-title-description-only" && <>
                  {d.record_type && <tr>
                    <td className="text-slate-500 text-right align-text-top">{getLabel("record_type")}:</td>
                    <td>{d.record_type}</td>
                  </tr>}
                  {ctypes.length > 0 &&
                  <tr>
                    <td className="text-slate-500 text-right align-text-top">{getLabel("content_types")}:</td>
                    <td>{ctypes.join("; ")}</td>
                  </tr>
                  }
                  {d.collection_content_category && <tr>
                    <td className="text-slate-500 text-right align-text-top">{getLabel("collection_content_category")}:</td>
                    <td>{d.collection_content_category}</td>
                  </tr>}
                  {d.collection_holder_category && <tr>
                    <td className="text-slate-500 text-right align-text-top">{getLabel("collection_holder_category")}:</td>
                    <td>{d.collection_holder_category}</td>
                  </tr>}
                  {d.extent && <tr>
                    <td className="text-slate-500 text-right align-text-top">{getLabel("extent")}:</td>
                    <td>{d.extent}</td>
                  </tr>}
                  {d.dates && <tr>
                    <td className="text-slate-500 text-right align-text-top">{getLabel("dates")}:</td>
                    <td>{d.dates}</td>
                  </tr>}
                  {d.historical_relevance && <tr>
                    <td className="text-slate-500 text-right align-text-top">{getLabel("historical_relevance")}:</td>
                    <td>{d.historical_relevance}</td>
                  </tr>}
                  {subjects.length > 0 &&
                    <tr>
                      <td className="text-slate-500 text-right align-text-top">{getLabel("subjects")}:</td>
                      <td>{subjects.join("; ")}</td>
                    </tr>
                  }
                  {d.creators && <tr>
                    <td className="text-slate-500 text-right align-text-top">{getLabel("creators")}:</td>
                    <td>{d.creators}</td>
                  </tr>}
                  {formats.length > 0 && <tr>
                    <td className="text-slate-500 text-right align-text-top">{getLabel("physical_formats")}:</td>
                    <td>{formats}</td>
                  </tr>}
                  {langs.length > 0 &&
                    <tr>
                      <td className="text-slate-500 text-right align-text-top">{getLabel("languages")}:</td>
                      <td>{langs.join("; ")}</td>
                    </tr>
                  }
                  {d.finding_aid_url && <tr>
                    <td className="text-slate-500 text-right align-text-top">{getLabel("finding_aid_url")}:</td>
                    <td><a className="underline break-all" href={faURL}>View on {new URL(faURL).hostname}</a></td>
                  </tr>}
                  {d.supporting_documentation && 
                    <tr>
                      <td className="text-slate-500 text-right align-text-top">{getLabel("supporting_documentation")}:</td>
                      <td>{d.supporting_documentation}</td>
                    </tr>
                  }
                  {d.inventory_description && 
                    <tr>
                      <td className="text-slate-500 text-right align-text-top">{getLabel("inventory_description")}:</td>
                      <td>{d.inventory_description}</td>
                    </tr>
                  }
                  {d.collection_catalog_url && <tr>
                    <td className="text-slate-500 text-right align-text-top">Online catalog:</td>
                    <td><a className="underline break-all" href={catURL}>View on {new URL(catURL).hostname}</a></td>
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
                  {d.access_statement && <tr>
                    <td className="text-slate-500 text-right align-text-top">{getLabel("access_statement")}:</td>
                    <td>{d.access_statement}</td>
                  </tr>}
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
