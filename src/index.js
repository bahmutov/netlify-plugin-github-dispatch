const debug = require('debug')('netlify-plugin-github-dispatch')

module.exports = {
  onSuccess: async ({ constants }) => {
    const isLocal = constants.IS_LOCAL
    const siteName = process.env.SITE_NAME
    const deployPrimeUrl = process.env.DEPLOY_PRIME_URL
    debug({
      isLocal,
      siteName,
      deployPrimeUrl,
    })
    console.log('Deployed URL %s', deployPrimeUrl)
  },
}
