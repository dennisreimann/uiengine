// / <reference types="Cypress" />

context('Search', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should list multiple results', () => {
    cy.get('[data-test-searchfield]').type('atom').type('{enter}')
    cy.get('h1').should('be', 'Search results for "atom"')
    cy.url().should('include', '/_search/atom')
  })

  it('should directly go to single result', () => {
    cy.get('[data-test-searchfield]').type('colors').type('{enter}')
    cy.get('h1').should('be', 'Colors')
    cy.url().should('include', '/documentation/tokens/colors/')
  })
})
