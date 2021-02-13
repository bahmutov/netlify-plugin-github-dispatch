# netlify-plugin-github-dispatch
[![ci status][ci image]][ci url] [![e2e status][e2e image]][ci url]
> Playing with Netlify to trigger GitHub Actions after the deploy finishes

## Install and use

1. Create a [new personal GitHub Token](https://github.com/settings/tokens/new) with "repo" permissions. This token will be used to trigger the workflow in the target repository.

![New token](images/token.png)

**Tip:** describe the purpose of the token to remember in the future

2. Set the new token as an environment variable in the Netlify Deploy Settings / Environment

![Set token in Netlify deploy settings](images/set-token.png)

3. In the target repository add a new workflow with `workflow_dispatch` event. It should accept two input parameters like this:

```yml
# .github/workflows/e2e.yml
# test the deployed Netlify site
name: e2e
on:
  workflow_dispatch:
    inputs:
      siteName:
        description: Netlify Site Name
        required: false
      deployPrimeUrl:
        description: Deployed URL
        required: true
jobs:
  show-event:
    runs-on: ubuntu-20.04
    steps:
      - run: echo "Testing url ${{ github.event.inputs.deployPrimeUrl }}"
```

4. In the source Netlify repo add this plugin

```toml
[[plugins]]
  package = "netlify-plugin-github-dispatch"
  [plugins.inputs]
    owner = "bahmutov" # use the target organization name
    repo = "ecommerce-netlify" # use the target repo name
    workflow = ".github/workflows/e2e.yml" # use workflow relative path
```

Push the code and let Netlify deploy

### Expected result

If everything works, in the Netlify Deploy log you should see a message from this plugin, something like this:

![Deploy log messages from the plugin](images/plugin-message.png)

In the target repository you should see the target workflow executed as if you triggered it manually

![Executed workflow](images/workflow.png)

## Why

This plugin is needed because [Netlify does not dispatch `deployment` or `deployment_status` events](https://community.netlify.com/t/can-netlify-deliver-deploy-event-to-github-api-after-successful-deployment/10905) thus we have to do it ourselves via `workflow_dispatch` event.

[ci image]: https://github.com/bahmutov/netlify-plugin-github-dispatch/workflows/ci/badge.svg?branch=main
[e2e image]: https://github.com/bahmutov/netlify-plugin-github-dispatch/workflows/e2e/badge.svg?branch=main
[ci url]: https://github.com/bahmutov/netlify-plugin-github-dispatch/actions
