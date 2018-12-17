// / <reference types="Cypress" />

context('Themes', () => {
  context('switch', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.clearLocalStorage()
    })

    it('should show first theme by default', () => {
      cy.get('[data-test-theme-switch-current]').should('be', 'Plain')
    })

    it('should switch and keep selected theme', () => {
      cy.get('[data-test-theme-switch-current]').click()
      cy.get('[data-test-theme-switch-id="funky"]').click()
      cy.get('[data-test-theme-switch-current]').should('be', 'Funky')

      cy.reload()
      cy.get('[data-test-theme-switch-current]').should('be', 'Funky')
      cy.get('[data-test-theme-switch-current]').click()
      cy.get('[data-test-theme-switch-id="plain"]').click()
      cy.get('[data-test-theme-switch-current]').should('be', 'Plain')
    })
  })

  context('on properties token page', () => {
    it('should show theme column only when displaying all themes', () => {
      // Plain
      cy.visit('/_tokens/plain/documentation/tokens/variables.html')
      cy.get('#Colors .uie-tokens__container--theme thead th').should(($ths) => {
        expect($ths).to.have.length(5)
        expect($ths.eq(0)).to.contain('Property')
        expect($ths.eq(1)).to.contain('Description')
        expect($ths.eq(2)).to.contain('Value')
        expect($ths.eq(4)).to.contain('Variable')
      })
      cy.get('#Colors .uie-tokens__container--theme tbody:first-of-type tr.uie-theme-token:first-child td').should(($tds) => {
        expect($tds).to.have.length(5)
      })

      // All
      cy.visit('/_tokens/_all/documentation/tokens/variables.html')
      cy.get('#Colors .uie-tokens__container--theme thead th').should(($ths) => {
        expect($ths).to.have.length(6)
        expect($ths.eq(0)).to.contain('Property')
        expect($ths.eq(1)).to.contain('Description')
        expect($ths.eq(2)).to.contain('Theme')
        expect($ths.eq(3)).to.contain('Value')
        expect($ths.eq(5)).to.contain('Variable')
      })
      cy.get('#Colors .uie-tokens__container--theme tbody:first-of-type tr.uie-theme-token:nth-child(1) td').should(($tds) => {
        expect($tds).to.have.length(6)
        expect($tds.eq(0)).to.contain('App Accent Color')
        expect($tds.eq(0)).to.contain('--app-accent-color')
        expect($tds.eq(1)).to.contain('Accent color')
        expect($tds.eq(2)).to.contain('Plain')
      })
      cy.get('#Colors .uie-tokens__container--theme tbody:first-of-type tr.uie-theme-token:nth-child(2) td').should(($tds) => {
        expect($tds).to.have.length(4)
        expect($tds.eq(0)).to.contain('Funky')
      })
    })
  })
})
