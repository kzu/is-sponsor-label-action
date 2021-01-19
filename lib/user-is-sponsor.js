/**
 * Uses the GraphQL API to see if the user is
 * a sponsor of the repository's owner.
 * @param {import('actions-toolkit').Toolkit} tools
 * @param {string} nodeId
 * @returns {boolean}
 */
module.exports = async function userIsSponsor (tools, nodeId) {
  // This will be either Organization or User
  const ownerType = tools.context.payload.repository.owner.type.toLowerCase()
  if (!['user', 'organization'].includes(ownerType)) {
    throw new Error(`Repository owner type ${ownerType} is not supported.`)
  }

  const query = `query ($owner: String!, $after: String) { 
    ${ownerType} (login: $owner) {
      sponsorshipsAsMaintainer (first: 100, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          sponsorEntity {
            ... on Organization {
              id
            }
            ... on User {
              id
            }
          }
          tier {
            monthlyPriceInDollars
          }
        }
      }
    }
  }`

  tools.log.debug(`Running query: 
${query}`)

  /**
   * Recursively checks the GraphQL API's response for the provided
   * nodeId, and returns true if a sponsorship record was found.
   * @param {string} [after]
   */
  async function makeRequest (after) {
    const result = await tools.github.graphql(query, {
      owner: tools.context.repo.owner,
      after
    })

    const { nodes, pageInfo } = result[ownerType].sponsorshipsAsMaintainer

    // Check if the issue/PR creator is a sponsor
    const sponsor = nodes.find(node => node.sponsorEntity && node.sponsorEntity.id === nodeId)
    if (sponsor) {
      tools.log.debug(`Found sponsor: ${JSON.stringify(sponsor)}`)
      return sponsor.tier.monthlyPriceInDollars
    }

    // We have more pages to check
    if (pageInfo.hasNextPage) {
      return makeRequest(pageInfo.endCursor)
    }

    // We checked em all, creator is not a sponsor
    return null
  }

  return makeRequest()
}
