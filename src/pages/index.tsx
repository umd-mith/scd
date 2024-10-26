import * as React from "react"
import { withPrefix, type HeadFC, type PageProps } from "gatsby"
import Layout from "../components/Layout"
import Button from "../components/Button"

const IndexPage: React.FC<PageProps> = () => {
  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${withPrefix("/images/werd.jpg")})`
  }

  return (
    <Layout>
      <div className="bg-linear min-h-[70vmin] bg-center bg-no-repeat bg-cover relative border-r-0 px-0 py-16 mb-8" style={heroStyle}>
        <div className="w-full max-w-hlg md:flex-nowrap  md:justify-start justify-between items-center px-4 m-auto flex flex-[0 0 50%]">
          <div className="max-w-[50%] text-gray-200">
            <h2 className="text-[2rem] mb-2 leading-tight" id="welcome-to-the-sound-collections-database">Welcome to the Sound Collections Database!</h2>

            <p>This database of sound collections is a project of the Library of Congress <a href="https://www.loc.gov/programs/national-recording-preservation-board/about-this-program/"><abbr title="National Radio Preservation Board">NRPB</abbr></a>, <a href="https://radiopreservation.org/"><abbr title="Radio Preservation Task Force">RPTF</abbr></a>, and <a href="http://arsc-audio.org/"><abbr title="Association of Recorded Sound Collections">ARSC</abbr></a>.</p>

            <p>Use the search box above to search for collections by keyword. You can also click below to browse everything, or to recommend collections for inclusion.</p>

            <p>
              <Button href="search">Browse</Button>
              <Button href="#">Recommend a collection</Button>
            </p>
            <p>Image: <a href="https://artsandculture.google.com/asset/werd-radio-station/NAGIYZDoGYaZPA">WERD radio station</a>, <a href="https://aaamc.indiana.edu/"><abbr title="Archives of African American Music and Culture">AAAMC</abbr></a></p>

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>RPTF/ARSC Sound Collections Database | This database is a project of the Library of Congress NRPB, RPTF, ARSC, and MITH.</title>
