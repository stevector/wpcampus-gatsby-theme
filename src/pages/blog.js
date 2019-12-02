import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Archive from "../components/archive"
import { NavPrimary } from "../components/nav"

export default function Template({ data }) {
  return (
    <Layout>
      <SEO title="Blog" />
      <h1>Blog posts</h1>
      <NavPrimary/>
      <Archive list={data.allWordpressPost.edges} />
    </Layout>
  )
}

// @TODO remove fields we're not using.
export const query = graphql`
  query {
    allWordpressPost(
      filter: { type: { eq: "post" }, status: { eq: "publish" } }
      sort: { fields: date, order: DESC }
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
          comment_status
          categories
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
