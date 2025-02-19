require('dotenv').config()
const { Toolkit } = require('actions-toolkit')
const getAuthorNodeId = require('./lib/get-author-id')
const userIsSponsor = require('./lib/user-is-sponsor')
const createLabel = require('./lib/create-label')
const addLabel = require('./lib/add-label')

Toolkit.run(async tools => {
  // Get the user id of the submitter
  const nodeId = getAuthorNodeId(tools.context.payload)

  // Check if the user is a sponsor
  const sponsorAmount = await userIsSponsor(tools, nodeId)
  if (!sponsorAmount) {
    tools.log.debug('Author is not a sponsor! Nothing left to do.')
    return
  }

  // Add the label
  await createLabel(tools)
  await addLabel(tools, sponsorAmount)
  tools.log.success('Label successfully applied. Have a nice day!')
}, {
  event: [
    'pull_request.opened',
    'issues.opened'
  ],
  secrets: [
    'GITHUB_TOKEN'
  ]
})
