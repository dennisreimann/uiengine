/* global describe, it */
const assert = require('assert')

const Handlebars = require('../lib/util/handlebars')

describe('Handlebars', () => {
  describe('#registerHelpersFromFile', () => {
    it('should register helpers with handlebars', done => {
      const hbs = require('handlebars')
      Handlebars.registerHelpersFromFile('./test/fixtures/theme/helpers.js')
        .then(data => {
          assert(typeof hbs.helpers['testHelper'] === 'function')
          done()
        })
        .catch(done)
    })
  })

  describe('#registerPartialFromFile', () => {
    it('should register partial with handlebars', done => {
      const hbs = require('handlebars')
      Handlebars.registerPartialFromFile('testPartial', './test/fixtures/theme/partials/testLayout.hbs')
        .then(data => {
          assert(hbs.partials['testPartial'])
          done()
        })
        .catch(done)
    })
  })

  describe('#registerTemplateFromFile / #getTemplate', () => {
    it('should put compiled template into cache and fetch cached template', done => {
      Handlebars.registerTemplateFromFile('testTemplate', './test/fixtures/theme/templates/testTemplate.hbs')
        .then(data => {
          Handlebars.getTemplate('testTemplate')
            .then(template => {
              assert.equal(typeof template, 'function')
              done()
            })
        })
        .catch(done)
    })
  })

  describe('#clearTemplates', () => {
    it('should drop template cache', done => {
      Handlebars.registerTemplateFromFile('testTemplate', './test/fixtures/theme/templates/testTemplate.hbs')
        .then(data => {
          Handlebars.clearTemplates()
            .then(() => {
              Handlebars.getTemplate('testTemplate')
                .catch(error => {
                  assert(error)
                  done()
                })
            })
        })
        .catch(done)
    })
  })

  describe('#putTemplate', () => {
    it('should put template into cache', done => {
      const templateName = 'putTemplateTest'
      Handlebars.clearTemplates()
      Handlebars.putTemplate(templateName, '{{{content}}}')
        .then(() => {
          Handlebars.getTemplate(templateName)
            .then(template => {
              assert.equal(typeof template, 'function')
              done()
            })
        })
        .catch(done)
    })
  })

  describe('#getTemplate', () => {
    it('should throw error if template does not exist in cache', done => {
      Handlebars.clearTemplates()
      Handlebars.getTemplate('getTemplateTestWithNonExistingTemplate')
        .catch(error => {
          assert(error)
          done()
        })
    })
  })
})
