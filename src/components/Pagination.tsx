import { isNumber } from "lodash"
import * as React from "react"
import Button from "./Button"

interface PaginationProps {
  count: number
  page: number
  onChange: (_event: React.ChangeEvent<unknown>, page: number) => void
}

const Pagination: React.FC<PaginationProps>  = ({count, page, onChange}) => {
  const [pageInput, setPageInput] = React.useState<number>(1)
  const [validPageInput, setValidPageInput] = React.useState(false)

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value)
    if (!isNaN(v) && v > 0 && v <= count) {
      setPageInput(v)
      setValidPageInput(true)
    } else {
      setValidPageInput(false)
    }
  }

  const activeStyle = {
    background: "#aaa",
    color: "#fff"
  }
  const ellipsis = '…'

  const pagination = (c: number, m: number) => {
    let current = c,
        last = m,
        delta = 2,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l;

    for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
            range.push(i);
        }
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push(ellipsis);
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, val: number) => {
    e.preventDefault()
    onChange(e, val)
  }


  return <div className="flex justify-center text-sm">
    <ul>
      {page > 1 && 
        <li className="border-r-[3px_0_0_3px] float-left border border-r-0 list-none">
          <a href="#" onClick={(e) => onChange(e, page-1)} className="inline-block p-1 h-[30px]">« Previous</a>
        </li>
      }
      {
        pagination(page, count).map((p, i) => (
          <li className="border-r-[3px_0_0_3px] float-left border border-r-0 list-none text-center" key={`page${i}`}
            style={page === p ? activeStyle : {}}>
            { isNumber(p)
              ? <a href="#" onClick={(e) => handleClick(e, p)} className="inline-block w-[30px] h-[30px] p-1">{p}</a>
              : <span className="inline-block w-[30px] h-[30px] p-1">{p}</span>
            }
          </li>
        ))
      }
      {page < count && 
        <li className="border-r-[3px_0_0_3px] float-left border list-none">
          <a href="#" onClick={(e) => handleClick(e, page+1)} className="inline-block p-1 h-[30px]">Next »</a>
        </li>
      }
    </ul>
    <span className="pl-4">
      <input type="number" className="border h-[32px] w-[50px] invalid:bg-red-400" min="1" max={count} onChange={handlePageInputChange} value={pageInput} />
      <Button style={{
        height: "32px",
        marginBottom: "3px"
      }}
      onClick={(e) => {if (validPageInput && !isNaN(Number(pageInput))) { handleClick(e, Number(pageInput)) } else {e.preventDefault()} }}
      >Go To Page</Button>
    </span>
  </div>
}

export default Pagination
