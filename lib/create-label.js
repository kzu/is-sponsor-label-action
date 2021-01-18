/**
 * Creates the configured labels. If
 * the label already exists, it'll throw and fail silently.
 * @param {import('actions-toolkit').Toolkit} tools
 */
module.exports = async function createLabel (tools) {
  // Create the labels
  
  tools.log.debug(`Making label [${tools.inputs.label}]`)
  try {
    await tools.github.issues.createLabel({
      ...tools.context.repo,
      name: tools.inputs.label,
      color: tools.inputs.color,
      request: { retries: 0 }
    })
  } catch {}

  tools.log.debug(`Making label [${tools.inputs.superlabel}]`)
  try {
    await tools.github.issues.createLabel({
      ...tools.context.repo,
      name: tools.inputs.superlabel,
      color: tools.inputs.color,
      request: { retries: 0 }
    })
  } catch {}
}
