const { dispatchWorkflow } = require('./dispatch')
const auth = process.env.GITHUB_TOKEN
dispatchWorkflow({ auth }).catch(console.error)
