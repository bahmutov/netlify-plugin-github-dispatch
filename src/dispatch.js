const { Octokit } = require('@octokit/rest')

/**
 * Triggers workflow dispatch event in the given repository.
 * Note: you must run the workflow at least once before it is found
 * and can be triggered by the event.
 * @param {} param0
 */
const dispatchWorkflow = async ({ auth }) => {
  const octokit = new Octokit({
    auth,
  })
  const owner = 'bahmutov'
  const repo = 'netlify-plugin-github-dispatch'

  const workflows = await octokit.actions.listRepoWorkflows({
    owner,
    repo,
  })
  if (!workflows.data) {
    throw new Error('Cannot find workflows data')
  }
  if (!workflows.data.total_count) {
    throw new Error(`Could not find any workflows in ${owner}/${repo}`)
  }
  console.log(workflows.data.workflows)

  const workflow_id = '.github/workflows/e2e.yml'
  const ref = process.env.BRANCH || 'main'
  console.log('triggering GitHub with %o', {
    owner,
    repo,
    workflow_id,
    ref,
  })
  await octokit.actions.createWorkflowDispatch({
    owner,
    repo,
    workflow_id,
    ref,
  })
}

module.exports = { dispatchWorkflow }
