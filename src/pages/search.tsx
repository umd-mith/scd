import * as React from "react"
import { graphql, Link, type HeadFC, type PageProps } from "gatsby"
import { FieldsMap } from "../fieldsMap"
import Layout from "../components/Layout"
import Button from "../components/Button"
import Pagination from "../components/Pagination"
import Dropdown from "../components/Dropdown"
import FacetAccordion from "../components/FacetAccordion"

interface ResultProps {
  results: Queries.qSearchPageQuery["allAirtableScdItems"]["nodes"]
  start: number
}

type PerPageValues = 10 | 20 | 50 | 100
type SortValues = "asc" | "desc"

const Results = ({results, start}: ResultProps) => (
  <section className="px-0 mx-5">
    {results.map((r, i) => {
      const d = r.data!
      d.collection_finding_aid_url
      const faURL = d.collection_finding_aid_url && d.collection_finding_aid_url?.startsWith("http") ? d.collection_finding_aid_url : `http://${d.collection_finding_aid_url}`
      const ctypes = d.content_types || []
      return <article className="border-b border-dotted border-slate-300 mb-7 pt-4" key={d.collection_id}>
        <h3 className="text-xl leading-5 mb-5 font-medium">
          {start + i}. <Link to={`/collections/${d.collection_id}`} className="text-rose-800 hover:underline">{d.collection_title}</Link>
        </h3>
        <table className="mb-8 border-separate border-spacing-2">
          <tbody>
            {d.collection_description && <tr>
              <td className="text-slate-500 text-right align-text-top">Description:</td>
              <td>{d.collection_description}</td>
            </tr>}
            {d.scd_publish_status !== "collection-owner-title-description-only" && <>
            {ctypes.length > 0 &&
              <tr>
                <td className="text-slate-500 text-right align-text-top">Content type{ctypes.length > 1 ? 's': ''}:</td>
                <td>{ctypes.join("; ")}</td>
              </tr>
            }
            {d.collectionFormats && <tr>
              <td className="text-slate-500 text-right align-text-top">Format:</td>
              <td>{d.collectionFormats}</td>
            </tr>}
            {d.collection_extent && <tr>
              <td className="text-slate-500 text-right align-text-top">Extent:</td>
              <td>{d.collection_extent}</td>
            </tr>}
            {d.collection_finding_aid_url && <tr>
              <td className="text-slate-500 text-right align-text-top">Online finding aid:</td>
              <td><a className="underline break-all" href={faURL}>View on {new URL(faURL).hostname}</a></td>
            </tr>}
            </>}
            <tr>
              <td className="text-slate-500 text-right align-text-top">Repository/Collector:</td>
              <td>{d.collection_holder_name}</td>
            </tr>
          </tbody>
        </table>
      </article>})
    }
  </section>
)

interface Facet {
  cat: string, val: string
}

const SearchPage: React.FC<PageProps> = ({data}) => {
  const [showFacets, setShowFacets] = React.useState(false)
  const results = (data as Queries.qSearchPageQuery).allAirtableScdItems.nodes
  const [currentPage, setCurrentPage] = React.useState(1)
  const [resultsPerPage, setResultsPerPage] = React.useState<PerPageValues>(20)
  const startIndex = (currentPage - 1) * resultsPerPage
  const endIndex = startIndex + resultsPerPage
  const totalPages = Math.ceil(results.length / resultsPerPage)
  
  const [sortOrder, setSortOrder] = React.useState<SortValues>("asc");
  const [facets, setFacets] = React.useState<Facet[]>([]);

  const facetFields = new Map<string, string>([
    ["Content type", "content_types"],
    ["Format", "collectionFormats"],
    ["Repository/Collector", "collection_holder_name"],
    ["Country (Location)", "collection_holder_country"],
    ["State (Location)", "collection_holder_state"]
  ])

  // apply facets
  const facetedResults = facets.length > 0 ? results.filter(r => {
    for (const f of facets) {
      const cat = f.cat as keyof Queries.qSearchPageQuery["allAirtableScdItems"]["nodes"][0]["data"]
      if (Object.keys(r.data!).includes(cat)) {
        if ((r.data![cat] as string[])?.includes(f.val)) {
          return true
        }
      }
    }
    return false
  }) : results;

  // sort then paginate
  (facetedResults as DeepWritable<Queries.qSearchPageQuery["allAirtableScdItems"]["nodes"]>).sort((a, b) => {
    if (sortOrder === "asc") {
      return a.data!.collection_title!.localeCompare(b.data!.collection_title!)
    } else {
      return b.data!.collection_title!.localeCompare(a.data!.collection_title!)
    }
  })
  const paginatedResults = facetedResults.slice(startIndex, endIndex)

  // Update component with existing query parameters on load
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    // Facets
    const newFacets: Facet[] = []
    for (const facet of facetFields.keys()) {
      const fieldName = facetFields.get(facet) || ""
      const values = urlParams.get(fieldName)
      if (values) {
        values.split(",").forEach(val => {
          if (facets.filter(f => f.cat === fieldName && f.val === val)[0] === undefined) {
            newFacets.push({cat: fieldName, val})
          }
        })
      }
    }
    setFacets(newFacets)
    // Sort
    const sort = urlParams.get("sort")
    if (sort && ["asc", "desc"].includes(sort)) {
      setSortOrder(sort as SortValues)
    }
    // Results per page
    const perPage = Number(urlParams.get("per_page"))
    if (!isNaN(perPage) && [10, 20, 50, 100].includes(perPage)) {
      setResultsPerPage(perPage as PerPageValues)
    }
    // Page
    const p = Number(urlParams.get("page"))
    if (!isNaN(p) && p > 0) {
      setCurrentPage(p)
    }
  }, [])

  const quietlyUpdateUrlSearch = (queries: {param: string, val: string}[]) => {
    // Update search without refreshing the page.
    const urlParams = new URLSearchParams(window.location.search)
    for (const q of queries) {
      const paramFromUrl = urlParams.get(q.param)
      if (paramFromUrl) {
        urlParams.set(q.param, q.val)
      } else {
        urlParams.append(q.param, q.val)
      }
    }
    history.pushState(null, '', '?' + urlParams.toString());
  }

  const quietlyRemoveUrlSearch = (params: string[]) => {
    const urlParams = new URLSearchParams(window.location.search)
    params.forEach(q => {
      urlParams.delete(q)
    })
    history.pushState(null, '', '?' + urlParams.toString());
  }

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
    quietlyUpdateUrlSearch([{param: "page", val: page.toString()}])
  }

  const handlePerPageChange = (val: PerPageValues) => {
    setResultsPerPage(val)
    quietlyUpdateUrlSearch([{param: "per_page", val: val.toString()}])
  }

  const handleSortChange = (val: SortValues) => {
    setSortOrder(val)
    quietlyUpdateUrlSearch([{param: "sort", val: val.toString()}])
  }

  const facetsToUrlQuery = (facets: Facet[]) => {
    return facets.reduce((acc: {param: string, val: string}[], facet) => {
      // Check if the category already exists in the accumulator
      const existing = acc.find((i) => i.param === facet.cat);
      if (existing) {
        // If it exists, add the new value to the existing string, separated by a comma
        existing.val += `,${facet.val}`;
      } else {
        // If it doesn't exist, add a new entry to the accumulator
        acc.push({ param: facet.cat, val: facet.val });
      }
      return acc;
    }, [])
  }

  const handleAddFacet = (cat: string, val: string) => {
    if (facets.filter(f => f.cat === cat && f.val === val)[0] === undefined) {
      const newFacets = [...facets, {cat, val}]
      setFacets(newFacets)
      const urlQueries = facetsToUrlQuery(newFacets)
      quietlyUpdateUrlSearch(urlQueries)
    }
  }

  const handleRemoveFacet = (cat: string, val: string) => {
    const newFacets: Facet[] = [];
    const removedFacets: string[] = [];
    facets.forEach(f => {
      if (!(f.cat === cat && f.val === val)) {
        newFacets.push(f)
      } else {
        removedFacets.push(f.cat)
      }
    })
    setFacets(newFacets)
    quietlyRemoveUrlSearch(removedFacets)
    const urlQueries = facetsToUrlQuery(newFacets)
    quietlyUpdateUrlSearch(urlQueries)
  }

  const SmallPagination = () => {
    const prev = currentPage > 1 ? <><a href="#" onClick={(e) => handleChange(e, "prev")} className="hover:underline">« Previous</a> | </> : "";
    const next = currentPage < totalPages ? <> | <a href="#" onClick={(e) => handleChange(e, "next")} className="hover:underline">Next »</a></> : "";
    const handleChange = (e: React.MouseEvent<HTMLAnchorElement>, dir: "prev" | "next") => {
      e.preventDefault()
      const urlParams = new URLSearchParams(window.location.search)
      const p = urlParams.get("page")
      const newP = (dir === "prev" ? currentPage -1 : currentPage + 1)
      if (p) {
        urlParams.set("page", newP.toString())
      } else {
        urlParams.append("page", newP.toString())
      }
      if (newP > 0 && newP <= totalPages) {
        setCurrentPage(newP)
        // Update search without refreshing the page.
        history.pushState(null, '', '?' + urlParams.toString());
      }
    }
    return <div>{prev}<strong>{startIndex+1} – {endIndex}</strong> of <strong>{facetedResults.length}</strong>{next}</div>
  }

  // Function to extract facets
  const extractFacet = (field: string) => {
    const f = field as keyof Queries.qSearchPageQuery["allAirtableScdItems"]["nodes"][0]["data"]
    return results.reduce((acc: { label: string; count: number, action: () => null }[], item) => {
      // If facet value is not present, skip
      if (!item.data![f]) return acc;
      const values = Array.isArray(item.data![f]) ? item.data![f] : [item.data![f] as string]
      // Iterate through each facet value in the current item
      values.forEach(type => {
        // Find if the facet value is already in the accumulator
        const existing = acc.find(entry => entry.label === type);
        if (existing) {
          // If found, increment the count
          existing.count += 1;
        } else {
          // If not found, add a new entry with count 1
          acc.push({ label: type || "", count: 1, action: () => null });
        }
      });
    
      return acc;
    }, [])
    .sort((a, b) => b.count - a.count);
  }

  return (
    <Layout>
      <div className="w-full max-w-hlg md:flex-nowrap md:justify-start justify-between items-center px-4 m-auto">
        <div>
          <div className=""></div>
          <div className="lg:flex">
            <div className="lg:flex-none lg:w-1/4 px-2 mb-6">
              <div className="flex justify-between"><h2 className="text-2xl mb-2 leading-tight h-14" id="search">Limit your search</h2>
                <span className="lg:hidden block">
                  <Button color="transparent" onClick={(e) => {e.preventDefault(); setShowFacets(!showFacets)}}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'><path stroke='rgba(0, 0, 0, 0.5)' strokeLinecap='round' stroke-miterlimit='10' strokeWidth='2' d='M4 7h22M4 15h22M4 23h22'/></svg>
                  </Button>
                </span>
              </div>
              <div className={`${showFacets ? '' : 'hidden'} lg:block`}>{
                Array.from(facetFields.keys()).map((ff) => {
                  const fieldName = facetFields.get(ff) || "";
                  return (
                    <FacetAccordion
                      key={ff}
                      label={ff}
                      fieldName={fieldName}
                      items={extractFacet(fieldName)}
                      activeFacets={facets.filter(f => f.cat === fieldName)}
                      add={handleAddFacet}
                      remove={handleRemoveFacet}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between border-b border-slate-300 pb-4 h-14">
                <SmallPagination />
                <div>Sort by: <Dropdown items={[
                  {label: "A-Z", active: sortOrder === "asc", action: () => handleSortChange("asc")},
                  {label: "Z-A", active: sortOrder === "desc", action: () => handleSortChange("desc")}
                  ]} />{" "}
                  <Dropdown items={[
                  {label: "10 per page", active: resultsPerPage === 10, action: () => handlePerPageChange(10)},
                  {label: "20 per page", active: resultsPerPage === 20, action: () => handlePerPageChange(20)},
                  {label: "50 per page", active: resultsPerPage === 50, action: () => handlePerPageChange(50)},
                  {label: "100 per page", active: resultsPerPage === 100, action: () => handlePerPageChange(100)},
                  ]} />
                </div>
              </div>
              <Results results={paginatedResults} start={startIndex + 1}/>
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange}/>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query qSearchPage {
    allAirtableScdItems(
      filter: {data: {scd_publish_status: {nin: ["duplicate-record-do-not-display", "do-not-display"]}}}
      sort: {data: {collection_title: ASC}}
    ) {
      nodes {
        data {
          collection_id
          scd_publish_status
          collection_description
          collection_holder_name
          collection_title
          collection_extent
          collectionFormats
          content_types
          collection_finding_aid_url
          collection_holder_country
          collection_holder_state
        }
      }
    }
  }
`

export default SearchPage

export const Head: HeadFC = () => <title>Search | RPTF/ARSC Sound Collections Database</title>
