// / <reference types="Cypress" />

context('Footer', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.clearLocalStorage()
  })

  it('should contain prev and next page links', () => {
    cy.get('[data-test-footer-prevlink').should('not.exist')
    cy.get('[data-test-footer-nextlink').click()
    cy.get('[data-test-footer-prevlink').should('be.visible')
    cy.get('[data-test-footer-prevlink').click()
    cy.get('[data-test-footer-prevlink').should('not.exist')
  })

  it('should contain version', () => {
    cy.get('[data-test-footer-version')
  })

  it('should contain copyright', () => {
    cy.get('[data-test-footer-copyright')
  })
})
