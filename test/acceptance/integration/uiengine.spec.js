// / <reference types="Cypress" />

context('UIengine', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.clearLocalStorage()
  })

  it('shows the home page content', () => {
    cy.get('.main h1').should('contain', 'Home')

    cy.get('.main .content').should('contain', 'Welcome! This is the UIengine Test Project.')
  })

  it('shows the 404 page', () => {
    cy.visit('/does-not-exist', { failOnStatusCode: false })
    cy.get('.main h1').should('contain', 'Not Found')

    cy.get('.main .content').should('contain', 'This page does not exist.')
  })
})
