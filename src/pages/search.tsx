import * as React from "react"
import { graphql, Link, type HeadFC, type PageProps } from "gatsby"
import { useFlexSearch } from 'react-use-flexsearch'
import Layout from "../components/Layout"
import Button from "../components/Button"
import Pagination from "../components/Pagination"
import Dropdown from "../components/Dropdown"
import FacetAccordion from "../components/FacetAccordion"

interface ResultProps {
  results: Queries.qSearchPageQuery["allAirtableScdItems"]["nodes"]
  fieldLabels: Queries.qSearchPageQuery["allAirtableScdFields"]["nodes"]
  start: number
}

type PerPageValues = 10 | 20 | 50 | 100
type SortValues = "asc" | "desc"

const Results = ({results, fieldLabels, start}: ResultProps) => {
  const getLabel = (label: string) => {
    const f = fieldLabels.find(field => field.data!.Fields!.replace(/-/g, "_") === label)
    if (f) {
      return f.data!.scd_field_label_revised
    }
    return label
  }

  return (<section className="px-0 mx-5">
    {results.map((r, i) => {
      const d = r.data!
      d.finding_aid_url
      const faURL = d.finding_aid_url && d.finding_aid_url?.startsWith("http") ? d.finding_aid_url : `http://${d.finding_aid_url}`
      return <article className="border-b border-dotted border-slate-300 mb-7 pt-4" key={d.collection_id}>
        <h3 className="text-xl leading-5 mb-5 font-medium">
          {start + i}. <Link to={`/collections/${d.collection_id}`} className="text-rose-800 hover:underline">{d.collection_title}</Link>
        </h3>
        <table className="mb-8 border-separate border-spacing-2">
          <tbody className="[&>tr:nth-child(even)]:bg-gray-100">
            {d.collection_description && <tr>
              <td className="text-slate-500 text-right align-text-top">{getLabel('collection_description')}:</td>
              <td className="align-text-top">{d.collection_description}</td>
            </tr>}
            {d.scd_publish_status !== "collection-owner-title-description-only" && <>
            {(d.physical_formats || []).length > 0 && <tr>
              <td className="text-slate-500 text-right align-text-top">{getLabel('physical_formats')}:</td>
              <td className="align-text-top">{d.physical_formats?.join("; ")}</td>
            </tr>}
            {d.extent && <tr>
              <td className="text-slate-500 text-right align-text-top">{getLabel('extent')}:</td>
              <td className="align-text-top">{d.extent}</td>
            </tr>}
            {d.finding_aid_url && <tr>
              <td className="text-slate-500 text-right align-text-top">{getLabel('finding_aid_url')}:</td>
              <td className="align-text-top"><a className="underline break-all" href={faURL}>View on {new URL(faURL).hostname}</a></td>
            </tr>}
            </>}
            <tr>
              <td className="text-slate-500 text-right align-text-top">{getLabel('collection_holder_name')}:</td>
              <td className="align-text-top">{d.collection_holder_name}</td>
            </tr>
            {d.ssp_status && <tr>
              <td className="text-slate-500 text-right align-text-top">{getLabel('ssp_status')}:</td>
              <td className="align-text-top">{d.ssp_status}</td>
            </tr>}
          </tbody>
        </table>
      </article>})
    }
  </section>)
}

interface Facet {
  cat: string, val: string
}

const SearchPage: React.FC<PageProps> = ({data}) => {
  const [showFacets, setShowFacets] = React.useState(false)
  const results = (data as Queries.qSearchPageQuery).allAirtableScdItems.nodes
  const [currentPage, setCurrentPage] = React.useState(1)
  const [resultsPerPage, setResultsPerPage] = React.useState<PerPageValues>(20)
  const [sortOrder, setSortOrder] = React.useState<SortValues>("asc");
  const [facets, setFacets] = React.useState<Facet[]>([]);
  
  const d = data as Queries.qSearchPageQuery
  const facetsFromAirTable = d.allAirtableScdFacets.nodes || []
  const fieldsFromAirTable = d.allAirtableScdFields.nodes || []

  const facetData = facetsFromAirTable.map(f => 
    [f.data!.scd_field_label_revised, f.data!.Fields!.replace(/-/g, '_')] as [string, string]
  )

  const facetFields = new Map<string, string>(facetData)

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

  const [searchQuery, setSearchQuery] = React.useState<string>()
  const searchData = useFlexSearch(searchQuery, d.localSearchCollections?.index, d.localSearchCollections?.store)
  const searchResultIds = searchData.map((item: {collection_id: string}) => item.collection_id)

  // Apply search results
  const searchResults = searchQuery ? facetedResults.filter(r => searchResultIds.includes(r.data!.collection_id)) : facetedResults;

  // sort then paginate
  (searchResults as DeepWritable<Queries.qSearchPageQuery["allAirtableScdItems"]["nodes"]>).sort((a, b) => {
    if (sortOrder === "asc") {
      return a.data!.collection_title!.localeCompare(b.data!.collection_title!)
    } else {
      return b.data!.collection_title!.localeCompare(a.data!.collection_title!)
    }
  })

  const totalPages = Math.ceil(searchResults.length / resultsPerPage)
  const startIndex = (currentPage - 1) * resultsPerPage
  const endIndex = Math.min(startIndex + resultsPerPage, searchResults.length)

  const paginatedResults = searchResults.slice(startIndex, endIndex)

  // Update component with existing query parameters on load
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    // Search Query
    const q = urlParams.get("q")
    if (q) {
      setSearchQuery(decodeURI(q))
    }
    // Facets
    const newFacets: Facet[] = []
    for (const facet of facetFields.keys()) {
      const fieldName = facetFields.get(facet) || ""
      const values = urlParams.get(fieldName)
      if (values) {
        values.split("|").forEach(val => {
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
        existing.val += `|${facet.val}`;
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

  const toggleFacets = (items: {cat: string, val: string}[]) => {
    const newFacets: Facet[] = [];
    const removedFacets: string[] = [];
    facets.forEach(f => {
      if (!items.find(i => i.cat === f.cat && i.val === f.val)) {
        newFacets.push(f)
      } else {
        removedFacets.push(f.cat)
      }
    })
    items.forEach(i => {
      if (facets.filter(f => f.cat === i.cat && f.val === i.val)[0] === undefined) {
        newFacets.push(i)
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
    return endIndex > 0 ? <div>{prev}<strong>{startIndex+1} – {endIndex}</strong> of <strong>{searchResults.length}</strong>{next}</div> : ""
  }

  // Function to extract facets
  const extractFacet = (field: string) => {
    const f = field as keyof Queries.qSearchPageQuery["allAirtableScdItems"]["nodes"][0]["data"]
    return results.reduce((acc: { label: string; count: number, inSearchCount: number, action: () => null }[], item) => {
      // If facet value is not present, skip
      if (!item.data![f]) return acc;
      const values = Array.isArray(item.data![f]) ? item.data![f] : [item.data![f] as string]
      // Iterate through each facet value in the current item
      values.forEach(type => {
        // Find if the facet value is already in the accumulator
        const existing = acc.find(entry => entry.label === type);
        const inSearch = !searchQuery ? true : searchResultIds.includes(item.data!.collection_id);
        if (existing) {
          // If found, increment the count
          existing.count += 1;
          if (inSearch) existing.inSearchCount += 1;
        } else {
          // If not found, add a new entry with count 1
          acc.push({ label: type || "", count: 1, inSearchCount: inSearch ? 1 : 0, action: () => null });
        }
        
      });
    
      return acc;
    }, [])
    .sort((a, b) => b.count - a.count);
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setSearchQuery(q)
    if (q === "") {
      quietlyRemoveUrlSearch(["q"])
    } else {
      quietlyUpdateUrlSearch([{param: "q", val: e.target.value}])
    }
  }

  return (
    <Layout>
      <div className="w-full max-w-hlg md:flex-nowrap md:justify-start justify-between items-center px-4 m-auto">
        <div>
          <div className="py-4 pl-2">
            <form className="w-full">   
              <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
              <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                  </div>
                  <input onChange={handleSearchChange} value={searchQuery} type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-rose-800 focus:border-rose-800" placeholder="Search..." required />
              </div>
            </form>
          </div>
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
                  if (fieldName === "ssp_status") return (
                    <FacetAccordion
                      asCheckbox={true}
                      key={ff}
                      label={ff}
                      fieldName={fieldName}
                      items={extractFacet(fieldName)}
                      activeFacets={facets.filter(f => f.cat === fieldName)}
                      add={handleAddFacet}
                      remove={handleRemoveFacet}
                      toggle={toggleFacets}
                    />
                  );

                  return (
                    <FacetAccordion
                      key={ff}
                      label={ff}
                      fieldName={fieldName}
                      items={extractFacet(fieldName)}
                      activeFacets={facets.filter(f => f.cat === fieldName)}
                      add={handleAddFacet}
                      remove={handleRemoveFacet}
                      toggle={toggleFacets}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex-1">
            {searchResults.length > 0 
              ? <><div className="flex justify-between border-b border-slate-300 pb-4 h-14">
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
              <Results results={paginatedResults} fieldLabels={fieldsFromAirTable} start={startIndex + 1}/>
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange}/></>
              : <div className="text-2xl px-3">No results.</div>
              }
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
          collection_title
          collection_description
          collection_holder_name
          extent
          physical_formats
          finding_aid_url

          record_type
          collection_holder_state
          collection_holder_category
          collection_content_category
          content_types
          ssp_status
        }
      }
    }
    allAirtableScdFacets(filter: {data: {Fields: {nin: ["subjects", "creators"]}}}) {
      nodes {
        data {
          scd_field_label_revised
          Fields
        }
      }
    }
    allAirtableScdFields(filter: {data: {Fields: {nin: ["subjects", "creators"]}}}) {
      nodes {
        data {
          scd_field_label_revised
          Fields
        }
      }
    }
    localSearchCollections {
      store
      index
    }
  }
`

export default SearchPage

export const Head: HeadFC = () => <title>Search | RPTF/ARSC Sound Collections Database</title>
