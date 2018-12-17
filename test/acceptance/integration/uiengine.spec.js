// / <reference types="Cypress" />

context('UIengine', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.clearLocalStorage()
  })

  it('shows the home page content', () => {
    cy.get('.main h1').should('be', 'Home')

    cy.get('.main .content').should('contain', 'Welcome! This is the UIengine Sample Project.')
  })

  it('shows the 404 page', () => {
    cy.visit('/does-not-exist')
    cy.get('.main h1').should('be', 'Not Found ')

    cy.get('.main .content').should('be', 'This page does not exist. ')
  })
})
