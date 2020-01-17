// / <reference types="Cypress" />

context('Component', () => {
  beforeEach(() => {
    cy.visit('/patterns/atoms/label/', { failOnStatusCode: false })
    cy.get('[data-test-theme-switch-current]').click()
    cy.get('[data-test-theme-switch-id="plain"]').click()
    cy.clearLocalStorage()
  })

  it('should open variant in separate window', () => {
    // https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/testing-dom__tab-handling-links/cypress/integration/tab_handling_anchor_links_spec.js
    const linkSelector = '#label-label-ejs-1 [data-test-openinwindow-link]'

    cy.get(linkSelector).should('have.attr', 'href', '/test-project/_variants/plain/label/label.ejs-1.html')
    cy.get(linkSelector).should('have.attr', 'target', 'label-label-ejs-1')
  })

  context('preview', () => {
    afterEach(() => {
      // Back to plain
      cy.get('[data-test-theme-switch-current]').click()
      cy.get('[data-test-theme-switch-id="plain"]').click()
    })

    context('in viewport mode', () => {
      beforeEach(() => {
        cy.visit('/_settings/', { failOnStatusCode: false })
        cy.get('#previewMode-select').select('Viewports')
        cy.visit('/patterns/atoms/label/', { failOnStatusCode: false })
      })

      it('should show first theme by default and switch themes', () => {
        const plainUrl = '/test-project/_variants/plain/label/label.ejs-1.html'
        const funkyUrl = '/test-project/_variants/funky/label/label.ejs-1.html'

        // Plain
        cy.get('#label-label-ejs-1 iframe').should(($iframes) => {
          expect($iframes).to.have.length(3)
        })

        cy.get('#label-label-ejs-1 [data-test-viewport-iframe="plain-Phone"]')
          .should('have.attr', 'src', plainUrl)

        // shown for this theme
        cy.get('#label-label-pug-5 iframe').should(($iframes) => {
          expect($iframes).to.have.length(3)
        })

        // Funky
        cy.get('[data-test-theme-switch-current]').click()
        cy.get('[data-test-theme-switch-id="funky"]').click()

        cy.get('#label-label-ejs-1 iframe').should(($iframes) => {
          expect($iframes).to.have.length(3)
        })

        cy.get('#label-label-ejs-1 [data-test-viewport-iframe="funky-Phone"]')
          .should('have.attr', 'src', funkyUrl)

        // hidden for this theme
        cy.get('#label-label-pug-5 iframe').should('have.length', 0)

        // All
        cy.get('[data-test-theme-switch-current]').click()
        cy.get('[data-test-theme-switch-all]').click()

        cy.get('#label-label-ejs-1 iframe').should(($iframes) => {
          expect($iframes).to.have.length(6)
        })

        cy.get('#label-label-ejs-1 [data-test-viewport-iframe="plain-Phone"]')
        cy.get('#label-label-ejs-1 [data-test-viewport-iframe="funky-Phone"]')

        cy.get('#label-label-pug-5 [data-test-viewport-iframe="plain-Phone"]')
        cy.get('#label-label-pug-5 [data-test-viewport-iframe="funky-Phone"]')
      })
    })

    context('in breakpoint mode', () => {
      beforeEach(() => {
        cy.visit('/_settings/', { failOnStatusCode: false })
        cy.get('#previewMode-select').select('Breakpoints')
        cy.visit('/patterns/atoms/label/', { failOnStatusCode: false })
      })

      it('should show first theme by default and switch themes', () => {
        const plainUrl = '/test-project/_variants/plain/label/label.ejs-1.html'
        const funkyUrl = '/test-project/_variants/funky/label/label.ejs-1.html'

        // Plain
        cy.get('#label-label-ejs-1 iframe').should(($iframes) => {
          expect($iframes).to.have.length(1)
        })

        cy.get('#label-label-ejs-1 [data-test-breakpoint-iframe="plain"]')
          .should('have.attr', 'src', plainUrl)

        // shown for this theme
        cy.get('#label-label-pug-5 [data-test-breakpoint-iframe="funky"]').should('have.length', 0)

        // Funky
        cy.get('[data-test-theme-switch-current]').click()
        cy.get('[data-test-theme-switch-id="funky"]').click()

        cy.get('#label-label-ejs-1 iframe').should(($iframes) => {
          expect($iframes).to.have.length(1)
        })

        cy.get('#label-label-ejs-1 [data-test-breakpoint-iframe="funky"]')
          .should('have.attr', 'src', funkyUrl)

        // hidden for this theme
        cy.get('#label-label-pug-5 [data-test-breakpoint-iframe="funky"]').should('have.length', 0)

        // All
        cy.get('[data-test-theme-switch-current]').click()
        cy.get('[data-test-theme-switch-all]').click()

        cy.get('#label-label-ejs-1 iframe').should(($iframes) => {
          expect($iframes).to.have.length(2)
        })

        cy.get('#label-label-ejs-1 [data-test-breakpoint-iframe="plain"]')
        cy.get('#label-label-ejs-1 [data-test-breakpoint-iframe="funky"]')

        cy.get('#label-label-pug-5 [data-test-breakpoint-iframe="plain"]')
        cy.get('#label-label-pug-5 [data-test-breakpoint-iframe="funky"]')
      })
    })
  })

  context('code', () => {
    it('should toggle parts', () => {
      cy.get('#label-label-ejs-1 [data-test-variant-tab-link="code"]').click()

      // Raw
      cy.get('#label-label-ejs-1 [data-test-variant-code-part="raw"]').should('be.visible')
      cy.get('#label-label-ejs-1 [data-test-variant-code-button="raw"]').click()
      cy.get('#label-label-ejs-1 [data-test-variant-code-part="raw"]').should('not.be.visible')

      // Context
      cy.get('#label-label-ejs-1 [data-test-variant-code-part="context"]').should('be.visible')
      cy.get('#label-label-ejs-1 [data-test-variant-code-button="context"]').click()
      cy.get('#label-label-ejs-1 [data-test-variant-code-part="context"]').should('not.be.visible')

      // HTML
      cy.get('#label-label-ejs-1 [data-test-variant-code-part="HTML"]').should('not.be.visible')
      cy.get('#label-label-ejs-1 [data-test-variant-code-button="HTML"]').click()
      cy.get('#label-label-ejs-1 [data-test-variant-code-part="HTML"]').should('be.visible')
    })
  })
})
