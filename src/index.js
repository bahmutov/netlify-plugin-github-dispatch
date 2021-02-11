// @ts-check
const debug = require('debug')('netlify-plugin-github-dispatch')
const { dispatchWorkflow } = require('./dispatch')

module.exports = {
  onSuccess: async ({ constants, utils }) => {
    const isLocal = constants.IS_LOCAL
    const siteName = process.env.SITE_NAME
    const deployPrimeUrl = process.env.DEPLOY_PRIME_URL
    debug({
      isLocal,
      siteName,
      deployPrimeUrl,
    })
    console.log('Deployed URL %s', deployPrimeUrl)

    // if this plugin is missing something, report and error
    // https://docs.netlify.com/configure-builds/build-plugins/create-plugins/#error-reporting
    const auth = process.env.GITHUB_TOKEN
    if (!auth) {
      return utils.build.failPlugin('Missing env variable GITHUB_TOKEN')
    }

    try {
      // TODO read from inputs or environment variables
      const owner = 'bahmutov'
      const repo = 'netlify-plugin-github-dispatch'
      const workflow_id = '.github/workflows/e2e.yml'
      const ref = process.env.BRANCH || 'main'
      const inputs = {
        siteName,
        deployPrimeUrl,
      }
      await dispatchWorkflow({ auth, owner, repo, workflow_id, ref }, inputs)
    } catch (error) {
      return utils.build.failPlugin(error.message, { error })
    }
  },
}
