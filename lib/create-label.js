/**
 * Creates the configured label (or the default one). If
 * the label already exists, it'll throw and fail silently.
 * @param {import('actions-toolkit').Toolkit} tools
 */
module.exports = async function createLabel (tools) {
  // Create the label
  tools.log.debug(`Making label [sponsor 💛]`)
  try {
    await tools.github.issues.createLabel({
      ...tools.context.repo,
      name: 'sponsor 💛',
      color: 'ea4aaa',
      request: { retries: 0 }
    })
  } catch {}
  tools.log.debug(`Making label [sponsor 🤍]`)
  try {
    await tools.github.issues.createLabel({
      ...tools.context.repo,
      name: 'sponsor 🤍',
      color: 'ea4aaa',
      request: { retries: 0 }
    })
  } catch {}
}
