// / <reference types="Cypress" />

context('Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.clearLocalStorage()
  })

  it('should switch pages', () => {
    cy.get('[data-test-navitem-id="documentation/getting-started"] > a').click()
    cy.get('h1').should('be', 'Getting Started')

    cy.get('[data-test-navitem-id="documentation/tokens/colors"] > a').click()
    cy.get('h1').should('be', 'Colors')

    cy.get('[data-test-navitem-id="patterns"] > a').click()
    cy.get('h1').should('be', 'Pattern Library')

    cy.get('[data-test-navitem-id="patterns/atoms/input"] > a').click()
    cy.get('h1').should('be', 'Inputs')

    cy.get('[data-test-navitem-id="testcases/custom-template"] > a').click()
    cy.get('h1').should('be', 'Custom Template')

    cy.get('[data-test-navitem-id="settings"] >   a').click()
    cy.get('h1').should('be', 'Settings')
  })

  it('should toggle categories', () => {
    cy.get('[data-test-navtree-id="documentation/tokens"]').should('be.visible')
    cy.get('[data-test-navitem-id="documentation/tokens"] > button').click()
    cy.get('[data-test-navtree-id="documentation/tokens"]').should('not.be.visible')

    cy.reload()
    cy.get('[data-test-navtree-id="documentation/tokens"]').should('not.be.visible')

    cy.get('[data-test-navitem-id="documentation/tokens"] > button').click()

    cy.get('[data-test-navtree-id="documentation/tokens"]').should('be.visible')
    cy.reload()
    cy.get('[data-test-navtree-id="documentation/tokens"]').should('be.visible')
  })

  it('should display initially collapsed pages', () => {
    cy.get('[data-test-navtree-id="testcases/examples"]').should('not.be.visible')
    cy.get('[data-test-navitem-id="testcases/examples"] > button').click()
    cy.get('[data-test-navtree-id="testcases/examples"]').should('be.visible')

    cy.reload()

    cy.get('[data-test-navtree-id="testcases/examples"]').should('be.visible')
    cy.get('[data-test-navitem-id="testcases/examples"] > button').click()
    cy.get('[data-test-navtree-id="testcases/examples"]').should('not.be.visible')
  })

  it('should be toggleable', () => {
    cy.get('[data-test-navtoggle]').click()
    cy.get('[data-test-navigation]').should('not.be.visible')

    cy.reload()
    cy.get('[data-test-navigation]').should('not.be.visible')

    cy.get('[data-test-navtoggle]').click()
    cy.get('[data-test-navigation]').should('be.visible')
  })
})
