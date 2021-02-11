/// <reference types="cypress" />
describe('the site', () => {
  it('loads', () => {
    // assumes baseUrl set in cypress.json
    // or via an environment variable like CYPRESS_baseUrl
    cy.visit('/')
    cy.contains('h1', 'Netlify-plugin-github-dispatch')
  })
})
