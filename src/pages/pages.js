// @TODO delete page
import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import { ArticleArchive } from "../components/archive"

export default function Template(props) {
	return (
		<Layout heading="Pages" path={props.path}>
			<ArticleArchive
				displayMeta={false}
				displayContent={false}
				list={props.data.allWordpressPage.edges}
			/>
		</Layout>
	)
}

Template.propTypes = {
	path: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired
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
