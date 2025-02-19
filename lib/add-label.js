/**
 * Adds the configured label to the created issue or pull request
 * @param {import('actions-toolkit').Toolkit} tools
 */
module.exports = async function addLabel (tools, amount) {
  // Get the label to add
  let label = tools.inputs.label
  if (amount != null && amount >= tools.inputs.superamount) {
    label = tools.inputs.superlabel
  }

  tools.log.debug(`Author is a sponsor! Adding the [${label}] label!`)

  // User is a sponsor, let's add a label
  return tools.github.issues.addLabels({
    ...tools.context.repo,
    issue_number: tools.context.issue.issue_number,
    labels: [label]
  })
}
