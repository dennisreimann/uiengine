// / <reference types="Cypress" />

context('Component', () => {
  beforeEach(() => {
    cy.visit('/_settings')
    cy.clearLocalStorage()
  })

  context('locale', () => {
    it('should switch the locale', () => {
      cy.get('.main h1').should('be', 'Settings')
      cy.get('#locale-select').should('be', 'English')

      cy.get('#locale-select').select('Deutsch')
      cy.get('.main h1').should('be', 'Einstellungen')

      cy.reload()

      cy.get('#locale-select').should('be', 'Deutsch')
      cy.get('.main h1').should('be', 'Einstellungen')
    })
  })

  context('preview mode', () => {
    it('should switch the preview mode', () => {
      cy.get('#previewMode-select').should('be', 'Viewports')

      cy.get('#previewMode-select').select('Breakpoints')

      cy.reload()

      cy.get('#previewMode-select').should('be', 'Breakpoints')
    })
  })

  context('highlight.js theme', () => {
    it('should switch the hljs theme', () => {
      cy.get('#hljs-select').should('be', 'Atom One Dark')

      cy.get('#hljs-select').select('Darkula')

      cy.reload()

      cy.get('#hljs-select').select('Darkula')
    })
  })
})
