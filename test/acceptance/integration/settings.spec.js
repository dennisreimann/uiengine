// / <reference types="Cypress" />

context('Component', () => {
  beforeEach(() => {
    cy.visit('/_settings', { failOnStatusCode: false })
    cy.clearLocalStorage()
  })

  context('locale', () => {
    it('should switch the locale', () => {
      cy.get('.main h1').should('contain', 'Settings')
      cy.get('#locale-select').should('contain', 'English')

      cy.get('#locale-select').select('Deutsch')
      cy.get('.main h1').should('contain', 'Einstellungen')

      cy.reload()

      cy.get('#locale-select').should('contain', 'Deutsch')
      cy.get('.main h1').should('contain', 'Einstellungen')
    })
  })

  context('preview mode', () => {
    it('should switch the preview mode', () => {
      cy.get('#previewMode-select').should('contain', 'Viewports')

      cy.get('#previewMode-select').select('Breakpoints')

      cy.reload()

      cy.get('#previewMode-select').should('contain', 'Breakpoints')
    })
  })

  context('highlight.js theme', () => {
    it('should switch the hljs theme', () => {
      cy.get('#hljs-select').should('contain', 'Atom One Dark')

      cy.get('#hljs-select').select('Darcula')

      cy.reload()

      cy.get('#hljs-select').select('Darcula')
    })
  })
})
