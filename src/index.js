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
      await dispatchWorkflow({ auth })
    } catch (error) {
      return utils.build.failPlugin(error.message, { error })
    }
  },
}
