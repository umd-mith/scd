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
  const subjects = d.subjects_all || []
  const formats = d.physical_formats || []
  const langs = d.languages || []
  const contentCats = d.collection_content_category || []
  const holderCats = d.collection_holder_category || []
  const invDesc = d.inventory_description || []
  const creators = d.creators || []
  const loc = []
  d.collection_holder_city ? loc.push(d.collection_holder_city) : false;
  d.collection_holder_state ? loc.push(d.collection_holder_state) : false; 
  d.collection_holder_country ? loc.push(d.collection_holder_country) : false;

  const Field = ({label, value, isLink}: {label: string, value: string, isLink?: boolean}) => {
    const _value = isLink ? <a className="underline break-all" href={value}>{value}</a> : value;
    return <tr>
      <td className="text-slate-500 text-right align-text-top">{getLabel(label)}:</td>
      <td className="align-text-top">{_value}</td>
    </tr>
  }

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
              <tbody className="[&>tr:nth-child(even)]:bg-gray-100">
                {d.ssp_status && <Field label="Sound Submissions Collection" value={d.ssp_status}/>}
                { // additional fields for public entries.
                  d.scd_publish_status !== "collection-owner-title-description-only" && <>
                  {d.record_type && <Field label="record_type" value={d.record_type}/>}
                  {contentCats.length > 0 && <Field label="collection_content_category" value={contentCats.join('; ')}/>}
                </>}
                {d.collection_description && <Field label="collection_description" value={d.collection_description}/>}
                {d.website_url && <Field label="website_url" value={d.website_url} isLink/>}
                { // additional fields for public entries.
                  d.scd_publish_status !== "collection-owner-title-description-only" && <>
                  {holderCats && <Field label="collection_holder_category" value={holderCats.join("; ")}/>}
                </>}
                <Field label="collection_holder_name" value={d.collection_holder_name}/>
                { // additional fields for public entries.
                  d.scd_publish_status !== "collection-owner-title-description-only" && <>
                  <tr>
                    <td className="text-slate-500 text-right align-text-top">Location:</td>
                    <td className="align-text-top">{loc.join(", ")}</td>
                  </tr>
                  {ctypes.length > 0 && <Field label="content_types" value={ctypes.join("; ")}/>}
                  {d.dates && <Field label="dates" value={d.dates}/>}
                  {d.extent && <Field label="extent" value={d.extent}/>}
                  {d.historical_relevance && <Field label="historical_relevance" value={d.historical_relevance}/>}
                  {subjects.length > 0 && <Field label="subjects" value={subjects.join("; ")}/>}
                  {creators.length > 0 && <Field label="creators" value={creators.join("; ")}/>}
                  {formats.length > 0 && <Field label="physical_formats" value={formats.join("; ")}/>}
                  {d.access_statement && <Field label="access_statement" value={d.access_statement}/>}
                  {d.finding_aid_url && <tr>
                    <td className="text-slate-500 text-right align-text-top">{getLabel("finding_aid_url")}:</td>
                    <td className="align-text-top"><a className="underline break-all" href={faURL}>View on {new URL(faURL).hostname}</a></td>
                  </tr>}
                  {d.collection_catalog_url && <tr>
                    <td className="text-slate-500 text-right align-text-top">Online catalog:</td>
                    <td className="align-text-top"><a className="underline break-all" href={catURL}>View on {new URL(catURL).hostname}</a></td>
                  </tr>}
                  {d.supporting_documentation && <Field label="supporting_documentation" value={d.supporting_documentation}/>}
                  {langs.length > 0 && <Field label="languages" value={langs.join("; ")}/>}
                  {invDesc.length > 0 && <Field label="inventory_description" value={invDesc.join("; ")}/>}
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
