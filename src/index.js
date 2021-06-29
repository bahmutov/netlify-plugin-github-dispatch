// @ts-check
const debug = require('debug')('netlify-plugin-github-dispatch')
const { dispatchWorkflow } = require('./dispatch')

module.exports = {
  onSuccess: async ({ constants, utils, inputs }) => {
    // https://docs.netlify.com/configure-builds/environment-variables/
    const context = process.env.CONTEXT
    const isLocal = constants.IS_LOCAL
    const siteName = process.env.SITE_NAME
    // unique deploy url
    const deployUrl = process.env.DEPLOY_URL
    // preview, branch, or production deploy url
    const deployPrimeUrl = process.env.DEPLOY_PRIME_URL
    const isPullRequest = process.env.PULL_REQUEST === 'true'
    const commitRef = process.env.COMMIT_REF
    const branch = process.env.BRANCH
    const headBranch = process.env.HEAD

    debug({
      isLocal,
      isPullRequest,
      siteName,
      context,
      commitRef,
      branch,
      headBranch,
      deployUrl,
      deployPrimeUrl,
    })
    // we probably want to test the prime url
    console.log('Deployed URL %s', deployPrimeUrl)

    // if this plugin is missing something, report and error
    // https://docs.netlify.com/configure-builds/build-plugins/create-plugins/#error-reporting
    const auth = process.env.GITHUB_TOKEN
    if (!auth) {
      return utils.build.failPlugin('Missing env variable GITHUB_TOKEN')
    }

    try {
      const owner = inputs.owner
      const repo = inputs.repo
      const workflow_id = inputs.workflow
      const ref = inputs.branch || headBranch || branch || 'main'
      // inputs the triggered workflow receives
      const workflowInputs = {
        siteName,
        deployPrimeUrl,
        commit: commitRef,
      }

      const dispatchInput = { auth, owner, repo, workflow_id, ref }
      debug('dispatching %o', dispatchInput)
      await dispatchWorkflow(dispatchInput, workflowInputs)
    } catch (error) {
      return utils.build.failPlugin(error.message, { error })
    }
  },
}
