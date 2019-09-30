/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require("path")
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const pages = await graphql(`
    {
        prismic {
            allDocuments(where: {type: "soumission"}, lang: "fr-ca") {
                edges {
                    node {
                        type
                        _meta {
                            uid
                        }
                    }
                }
            }
        }
    }
  `)
  const template = path.resolve("src/templates/document.js")

  pages.data.prismic.allDocuments.edges.forEach(edge => {
    createPage({
      path: `/${edge.node.type}/${edge.node._meta.uid}`,
      component: template,
      context: {
        uid: edge.node._meta.uid,
        type: edge.node.type
      },
    })
  })
}
