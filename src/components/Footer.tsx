import * as React from "react"

import logoRptf from "../images/rptf-logo.png"
import logoArsc from "../images/arsc-logo.png"
import logoNrpf from "../images/nrpf-logo.png"
import logoMith from "../images/MITHgrayscale.png"

const Footer = () => {
  return (<footer className="w-full min-h-20 pt-4 border-t-gray-300 bg-gray-100">
    <div className="w-full max-w-hlg items-center px-4 m-auto flex flex-wrap">
      <a className="block align-middle max-w-20 relative p-4 w-full flex-[0_0_8%]" href="https://radiopreservation.org/"><img alt="RPTF logo" src={logoRptf} /></a>
      <a className="block align-middle max-w-20 relative p-4 w-full flex-[0_0_8%]" href="http://arsc-audio.org/"><img alt="ARSC logo" src={logoArsc} /></a>
      <a className="block align-middle max-w-20 relative p-4 w-full flex-[0_0_8%]" href="https://mith.umd.edu/"><img alt="MITH logo" src={logoMith} /></a>
      <a className="block align-middle max-w-20 relative p-4 w-full flex-[0_0_8%]" href="https://www.recordingpreservation.org/"><img alt="NRPF logo" src={logoNrpf} /></a>
      <p>The SCD is a project of the Library of Congress <a href="https://www.loc.gov/programs/national-recording-preservation-board/about-this-program/"><abbr title="National Recording Preservation Board">NRPB</abbr></a>, <a href="https://radiopreservation.org/"><abbr title="Radio Preservation Task Force">RPTF</abbr></a>, and <a href="http://arsc-audio.org"><abbr title="Associaton of Recorded Sound Collections">ARSC</abbr></a>, with support from the <a href="https://www.recordingpreservation.org/about/"><abbr title="National Recording Preservation Foundation">NRPF</abbr></a>.</p>
    </div>
 </footer>)
}

export default Footer
