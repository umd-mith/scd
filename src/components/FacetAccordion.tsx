import * as React from "react"
import type { PropsWithChildren } from "react"

interface FacetAccordionProps {
  label: string
  items: Item[]
}

interface Item {
  label: string
  count: number
  selected?: boolean
  action: () => void
}

const FacetAccordion: React.FC<PropsWithChildren & FacetAccordionProps>  = ({label, items}) => {
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
    item.action()
  }

  return (
    <div className="w-full border rounded-md">
      <button type="button" className="inline-flex w-full justify-between gap-x-1.5 bg-slate-100 px-3 py-2 text-sm font-semibold text-gray-900" 
        aria-expanded={expanded ? 'true' : 'false'} aria-haspopup="true"
        onClick={() => handleExpanded() }
      >
        {label}
        <svg style={{transform: caretRotation}} className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: maxHeight,
        }}
      >
        {expanded && 
          <ul className="table table-fixed w-full m-0 list-none p-4">{
            items.map((item, _) => (
              <li className="table-row">
                <span className="table-cell px-4 -indent-4 pb-2 break-words hyphens-auto">
                  <a className="text-rose-800 hover:underline" href="#" onClick={(e) => handleItemClick(e, item)}>{item.label}</a>
                </span>
                <span className="table-cell align-top text-right w-20">{item.count}</span>
              </li>
            ))
          }</ul>
        }
      </div>
    </div>
  )
  }

export default FacetAccordion
