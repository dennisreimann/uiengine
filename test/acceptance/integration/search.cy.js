// / <reference types="Cypress" />

context('Search', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.clearLocalStorage()
  })

  it('should list multiple results', () => {
    cy.get('[data-test-searchfield]').type('atom')
    cy.get('[data-test-searchfield]').type('{enter}')
    cy.get('h1').should('contain', 'Search results for "atom"')
    cy.url().should('include', '/_search/atom')
  })

  it('should directly go to single result', () => {
    cy.get('[data-test-searchfield]').type('colors')
    cy.get('[data-test-searchfield]').type('{enter}')
    cy.get('h1').should('contain', 'Colors')
    cy.url().should('include', '/documentation/tokens/colors/')
  })
})
