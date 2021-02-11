const { Octokit } = require('@octokit/rest')

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
  console.log(workflows)

  const workflow_id = 'e2e'
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
