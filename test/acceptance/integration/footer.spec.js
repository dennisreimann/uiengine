// / <reference types="Cypress" />

context('Footer', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should contain prev and next page links', () => {
    cy.get('[data-test-footer-prevlink').should('not.be.visible')
    cy.get('[data-test-footer-nextlink').click()
    cy.get('[data-test-footer-prevlink').should('be.visible')
    cy.get('[data-test-footer-prevlink').click()
    cy.get('[data-test-footer-prevlink').should('not.be.visible')
  })

  it('should contain version', () => {
    cy.get('[data-test-footer-version')
  })

  it('should contain copyright', () => {
    cy.get('[data-test-footer-copyright')
  })
})
