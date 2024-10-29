import * as React from "react"
import { graphql, Link, type HeadFC, type PageProps } from "gatsby"
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
      const faURL = d._xxxcollectionFindingAidUrlxtxt && d._xxxcollectionFindingAidUrlxtxt.startsWith("http") ? d._xxxcollectionFindingAidUrlxtxt : `http://${d._xxxcollectionFindingAidUrlxtxt}`
      const ctypes = d._xxxcollectionContentTypesxtxtxxxcollectionContentTypesxtxt || []
      return <article className="border-b border-dotted border-slate-300 mb-7 pt-4" key={d._xxxid}>
        <h3 className="text-xl leading-5 mb-5 font-medium">
          {start + i}. <Link to={`/collections/${d._xxxid}`} className="text-rose-800 hover:underline">{d._xxxcollectionTitlextxt}</Link>
        </h3>
        <table className="mb-8 border-separate border-spacing-2">
          <tbody>
            {d._xxxcollectionDescriptionxtxt && <tr>
              <td className="text-slate-500 text-right align-text-top">Description:</td>
              <td>{d._xxxcollectionDescriptionxtxt}</td>
            </tr>}
            {d.scd_publish_status !== "collection-owner-title-description-only" && <>
            {ctypes.length > 0 &&
              <tr>
                <td className="text-slate-500 text-right align-text-top">Content type{ctypes.length > 1 ? 's': ''}:</td>
                <td>{ctypes.join("; ")}</td>
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
            {d._xxxcollectionFindingAidUrlxtxt && <tr>
              <td className="text-slate-500 text-right align-text-top">Online finding aid:</td>
              <td><a className="underline break-all" href={faURL}>View on {new URL(faURL).hostname}</a></td>
            </tr>}
            </>}
            <tr>
              <td className="text-slate-500 text-right align-text-top">Repository/Collector:</td>
              <td>{d._xxxcollectionOwnerNamextxt}</td>
            </tr>
          </tbody>
        </table>
      </article>})
    }
  </section>
)

const SearchPage: React.FC<PageProps> = ({data}) => {
  const [showFacets, setShowFacets] = React.useState(false)
  const results = (data as Queries.qSearchPageQuery).allAirtableScdItems.nodes
  const [currentPage, setCurrentPage] = React.useState(1)
  const [resultsPerPage, setResultsPerPage] = React.useState<PerPageValues>(20)
  const startIndex = (currentPage - 1) * resultsPerPage
  const endIndex = startIndex + resultsPerPage
  const totalPages = Math.ceil(results.length / resultsPerPage)
  
  const [sortOrder, setSortOrder] = React.useState<SortValues>("asc");
  const [facets, setFacets] = React.useState<{cat: string, val: string}[]>([]);

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
      return a.data!._xxxcollectionTitlextxt!.localeCompare(b.data!._xxxcollectionTitlextxt!)
    } else {
      return b.data!._xxxcollectionTitlextxt!.localeCompare(a.data!._xxxcollectionTitlextxt!)
    }
  })
  const paginatedResults = facetedResults.slice(startIndex, endIndex)

  // Update component with existing query parameters on load
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
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

  const quietlyUpdateUrlSearch = (param: string, val: string) => {
    // Update search without refreshing the page.
    const urlParams = new URLSearchParams(window.location.search)
    const paramFromUrl = urlParams.get("sort")
    if (paramFromUrl) {
      urlParams.set("sort", val)
    } else {
      urlParams.append("sort", val)
    }
    history.pushState(null, '', '?' + urlParams.toString());
  }

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
    quietlyUpdateUrlSearch("page", page.toString())
  }

  const handlePerPageChange = (val: PerPageValues) => {
    setResultsPerPage(val)
    quietlyUpdateUrlSearch("per_page", val.toString())
  }

  const handleSortChange = (val: SortValues) => {
    setSortOrder(val)
    quietlyUpdateUrlSearch("sort", val.toString())
  }

  const handleAddFacet = (cat: string, val: string) => {
    if (facets.filter(f => f.cat === cat && f.val === val)[0] === undefined) {
      setFacets([...facets, {cat, val}])
    }
  }

  const handleRemoveFacet = (cat: string, val: string) => {
    setFacets(facets.filter(f => !(f.cat === cat && f.val === val)))
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
              <div className={`${showFacets ? '' : 'hidden'} lg:block`}>
                <FacetAccordion
                  label="Content type" fieldName="_xxxcollectionContentTypesxtxtxxxcollectionContentTypesxtxt"
                  items={extractFacet("_xxxcollectionContentTypesxtxtxxxcollectionContentTypesxtxt")}
                  activeFacets={facets.filter(f => f.cat === "_xxxcollectionContentTypesxtxtxxxcollectionContentTypesxtxt")}
                  add={handleAddFacet}
                  remove={handleRemoveFacet}/>
                <FacetAccordion
                  label="Format" fieldName="_xcollectionFormatsxtxtxxxcollectionFormatsxtxt"
                  items={extractFacet("_xcollectionFormatsxtxtxxxcollectionFormatsxtxt")}
                  activeFacets={facets.filter(f => f.cat === "_xcollectionFormatsxtxtxxxcollectionFormatsxtxt")}
                  add={handleAddFacet}
                  remove={handleRemoveFacet}/>
                <FacetAccordion
                  label="Genre" fieldName="_xxxcollectionGenresxtxtxxxcollectionGenresxtxt"
                  items={extractFacet("_xxxcollectionGenresxtxtxxxcollectionGenresxtxt")}
                  activeFacets={facets.filter(f => f.cat === "_xxxcollectionGenresxtxtxxxcollectionGenresxtxt")}
                  add={handleAddFacet}
                  remove={handleRemoveFacet}/>
                <FacetAccordion
                  label="Recpository/Collector" fieldName="_xxxcollectionOwnerNamextxt"
                  items={extractFacet("_xxxcollectionOwnerNamextxt")}
                  activeFacets={facets.filter(f => f.cat === "_xxxcollectionOwnerNamextxt")}
                  add={handleAddFacet}
                  remove={handleRemoveFacet}/>
                <FacetAccordion
                  label="Country (Location)" fieldName="_xxxcollectionOwnerLocationCountryxtxt"
                  items={extractFacet("_xxxcollectionOwnerLocationCountryxtxt")}
                  activeFacets={facets.filter(f => f.cat === "_xxxcollectionOwnerLocationCountryxtxt")}
                  add={handleAddFacet}
                  remove={handleRemoveFacet}/>
                <FacetAccordion
                  label="State (Location)" fieldName="_xxxcollectionOwnerLocationStatextxt"
                  items={extractFacet("_xxxcollectionOwnerLocationStatextxt")}
                  activeFacets={facets.filter(f => f.cat === "_xxxcollectionOwnerLocationStatextxt")}
                  add={handleAddFacet}
                  remove={handleRemoveFacet}/> 
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
      sort: {data: {_xxxcollectionTitlextxt: ASC}}
    ) {
      nodes {
        data {
          _xxxid
          scd_publish_status
          _xxxcollectionDescriptionxtxt
          _xxxcollectionOwnerNamextxt
          _xxxcollectionTitlextxt
          _xxxcollectionExtentxtxt
          _xcollectionFormatsxtxtxxxcollectionFormatsxtxt
          _xxxcollectionContentTypesxtxtxxxcollectionContentTypesxtxt
          _xxxcollectionGenresxtxtxxxcollectionGenresxtxt
          _xxxcollectionFindingAidUrlxtxt
          _xxxcollectionOwnerLocationCountryxtxt
          _xxxcollectionOwnerLocationStatextxt
        }
      }
    }
  }
`

export default SearchPage

export const Head: HeadFC = () => <title>Search | RPTF/ARSC Sound Collections Database</title>
