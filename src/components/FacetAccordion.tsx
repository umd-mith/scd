import * as React from "react"
import type { PropsWithChildren } from "react"

interface FacetAccordionProps {
  asCheckbox?: boolean
  label: string
  items: Item[]
  fieldName: string
  activeFacets: {cat: string, val: string}[]
  add: (cat: string, val: string) => void
  remove: (cat: string, val: string) => void
  toggle: (items: {cat: string, val: string}[]) => void
}

interface Item {
  label: string
  count: number
}

const FacetAccordion: React.FC<PropsWithChildren & FacetAccordionProps>  = ({asCheckbox, label, items, fieldName, activeFacets, add, remove, toggle}) => {
  const [checked, setChecked] = React.useState(false)
  const [expanded, setExpanded] = React.useState(false)
  const [expanding, setExpanding] = React.useState(false)
  const [maxHeight, setMaxHeight] = React.useState<string | undefined>(undefined);
  const contentRef = React.useRef<HTMLDivElement>(null)

  const caretRotation = expanded ? "rotate(0deg)" : "rotate(275deg)"

  React.useEffect(() => {
    if (expanding) {
      setMaxHeight(`${contentRef.current?.scrollHeight}px`);
    } else {
      setMaxHeight('0px');
    }
  }, [expanding]);

  const handleExpanded = () => {
    if (expanded) {
      setExpanding(false)
      setTimeout(() => {
        setExpanded(false)
      }, 300);
    } else {
      setExpanding(true)
      setExpanded(true)
    }
  }

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, item: Item) => {
    e.preventDefault()
    add(fieldName, item.label)
  }

  const handleRemoveFacet = (e: React.MouseEvent<HTMLAnchorElement>, item: Item) => {
    e.preventDefault()
    remove(fieldName, item.label)
  }

  const handleToggle = () => {
    toggle(items.map(item => ({cat: fieldName, val: item.label})))
  }

  const checkBox = (<input type="checkbox" className="w-4 h-4 text-[#5F9FEC] bg-gray-100 border-gray-300 rounded accent-red-800"
    checked={checked}
    onChange={(e) => {
      const newChecked = e.target.checked;
      setChecked(newChecked);
      handleToggle();
    }}
    onClick={(e) => { e.stopPropagation(); }}
    aria-label={`Select all ${label} items`}
  />);
  const caret = (<svg style={{transform: caretRotation}} className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="#000" aria-hidden="true" data-slot="icon">
    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>);

  return (
    <div className="w-full border rounded-md mb-4">
      <button type="button" className={`text-left inline-flex w-full justify-between gap-x-1.5 px-3 py-2 text-sm font-semibold text-gray-900 
        ${activeFacets.length > 0 ? 'bg-[#5F9FEC]' : 'bg-slate-100'}`}
        aria-expanded={expanded ? 'true' : 'false'} aria-haspopup="true"
        onClick={(e) => {
          if (asCheckbox) {
            e.preventDefault()
            handleToggle();
            setChecked(!checked)
         } else {
          handleExpanded()
         }
        }}
      >
        {label}
        {asCheckbox ? checkBox : caret}
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: maxHeight,
        }}
      >
        {expanded && 
          <ul className="table table-fixed w-full m-0 list-none p-4">
            {/* <li className={`table-row ${activeFacets.length === items.length ? 'text-[#5F9FEC] font-bold' : ''} border-b`}>
              <span className="table-cell px-4 -indent-4 pb-2 break-words hyphens-auto">
                {activeFacets.length === items.length
                  ? <>
                      <a onClick={handleToggle} href="#" className="text-gray-500 font-bold pr-2 text-[0.6rem] align-bottom hover:text-rose-800"><span aria-hidden="true">✖</span><span className="sr-only">[remove]</span></a>
                      [none]
                    </>
                  : <a className="text-rose-800 hover:underline" href="#" onClick={handleToggle}>[all]</a>
                }
              </span>
            </li> */}
            {items.map((item, _) => {
              const active = Boolean(activeFacets.filter(f => f.val === item.label)[0])
              return <li className={`table-row ${active ? 'text-[#5F9FEC] font-bold' : ''}`} key={`v${item.label}`}>
                <span className="table-cell pl-4 -indent-4 pb-2 break-words hyphens-auto">
                  {active
                    ? <>
                        <a onClick={(e) => handleRemoveFacet(e, item)} href="#" className="text-gray-500 font-bold pr-2 text-[0.6rem] align-bottom hover:text-rose-800"><span aria-hidden="true">✖</span><span className="sr-only">[remove]</span></a>
                        {item.label}
                      </>
                    : <a className="text-rose-800 hover:underline" href="#" onClick={(e) => handleItemClick(e, item)}>{item.label}</a>
                  }
                </span>
                <span className="table-cell align-top text-right w-16">{item.count}</span>
              </li>
            })
          }</ul>
        }
      </div>
    </div>
  )
  }

export default FacetAccordion
