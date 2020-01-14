import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Archive from "../components/archive"
import { NavPrimary } from "../components/nav"

export default function Template({ data }) {
  return (
    <Layout>
      <SEO title="Pages" />
      <h1>Pages</h1>
      <NavPrimary/>
      <Archive displayMeta={false} displayContent={false} list={data.allWordpressPage.edges} />
    </Layout>
  )
}

// @TODO remove fields we're not using.
export const query = graphql`
  query {
    allWordpressPage(
      filter: { status: { eq: "publish" } }
      sort: { fields: title, order: ASC }
    ) {
      edges {
        node {
          id
          wordpress_id
          slug
          path
          author
          title
          status
          date
          dateFormatted: date(formatString: "MMMM D, YYYY")
          excerpt
          content
        }
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`