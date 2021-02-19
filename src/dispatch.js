// @ts-check
const { Octokit } = require('@octokit/rest')

/**
 * Triggers workflow dispatch event in the given repository.
 * Note: you must run the workflow at least once before it is found
 * and can be triggered by the event.
 * @param {any} param0
 * @param {any} inputs
 */
const dispatchWorkflow = async (
  { auth, owner, repo, workflow_id, ref },
  inputs,
) => {
  const octokit = new Octokit({
    auth,
  })

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

  console.log('triggering GitHub with %o', {
    owner,
    repo,
    workflow_id,
    ref,
    inputs,
  })
  // https://octokit.github.io/rest.js/v18#actions-create-workflow-dispatch
  await octokit.actions.createWorkflowDispatch({
    owner,
    repo,
    workflow_id,
    ref,
    inputs,
  })
}

module.exports = { dispatchWorkflow }
