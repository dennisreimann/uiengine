// / <reference types="Cypress" />

context('UIengine', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('shows the page title', () => {
    cy.get('h1').should('contain', 'Home')

    cy.get(':nth-child(1) > .navigation__tree--level-1 > :nth-child(1) > .navigation__link').click()

    cy.get('h1').should('contain', 'Getting Started')
  })
})
