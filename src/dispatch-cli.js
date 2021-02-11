const { dispatchWorkflow } = require('./dispatch')
const auth = process.env.GITHUB_TOKEN
const owner = 'bahmutov'
const repo = 'netlify-plugin-github-dispatch'
const workflow_id = '.github/workflows/e2e.yml'
const ref = process.env.BRANCH || 'main'

dispatchWorkflow({ auth, owner, repo, workflow_id, ref }).catch(console.error)
