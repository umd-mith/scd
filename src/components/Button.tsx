import * as React from "react"
import type { PropsWithChildren } from "react"

interface ButtonProps {
  href?: string
  style?: React.CSSProperties
  color?: "default" | "transparent"
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

const Button: React.FC<PropsWithChildren & ButtonProps>  = ({href, color, children, style, onClick}) => (
  <a href={href || "#"} className={`
    ${color !== "transparent" ? 'bg-rose-800 border-rose-800 hover:bg-rose-900 hover:border-rose-900' : ''}
    mr-2 px-2 py-1 text-sm leading-normal rounded-[.2rem] text-gray-100 inline-block font-normal text-center align-middle cursor-pointer select-none border [transition:color_0.15s_ease-in-out,_background-color_0.15s_ease-in-out,_border-color_0.15s_ease-in-out,_box-shadow_0.15s_ease-in-out]`}
    style={style}
    onClick={onClick}
  >{children}</a>
)

export default Button
