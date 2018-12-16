// / <reference types="Cypress" />

context('UIengine', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('shows the home page content', () => {
    cy.get('.main h1').should('be', 'Home')

    cy.get('.main .content').should('contain', 'Welcome! This is the UIengine Sample Project.')
  })
})
