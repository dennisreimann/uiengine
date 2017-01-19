/* global describe, it */
const assert = require('assert')
const hbs = require('handlebars')

const Renderer = require('../lib/renderer')
const state = {
  config: {
    basedirs: {
      theme: './test/fixtures/theme'
    }
  }
}

describe('Renderer', () => {
  describe('#setupContext', () => {
    it('should register theme helpers with Renderer', done => {
      hbs.unregisterHelper('testHelper')
      Renderer.setupContext(state)
        .then(data => {
          assert.equal(typeof hbs.helpers['testHelper'], 'function')
          done()
        })
        .catch(done)
    })

    it('should register theme partials with Renderer', done => {
      hbs.unregisterPartial('testLayout')
      Renderer.setupContext(state)
        .then(data => {
          assert(hbs.partials['testLayout'])
          done()
        })
        .catch(done)
    })

    it('should register theme templates with Renderer', done => {
      Renderer.clearTemplates()
      Renderer.setupContext(state)
        .then(data => {
          Renderer.getTemplate('testTemplate')
            .then(template => {
              assert.equal(typeof template, 'function')
              done()
            })
            .catch(done)
        })
        .catch(done)
    })
  })

  describe('#teardownContext', () => {
    it('should unregister theme helpers with Renderer', done => {
      hbs.registerHelper('testHelper', () => {})
      Renderer.teardownContext(state)
        .then(data => {
          assert.equal(hbs.helpers['testHelper'], undefined)
          done()
        })
        .catch(done)
    })

    it('should unregister theme partials with Renderer', done => {
      hbs.registerPartial('testPartial', 'Test partial')
      Renderer.teardownContext(state)
        .then(data => {
          assert.equal(hbs.partials['testPartial'], undefined)
          done()
        })
        .catch(done)
    })

    it('should unregister theme template with Renderer', done => {
      const templateId = 'testTemplate'
      Renderer.putTemplate(templateId, 'Test')
        .then(() => {
          Renderer.teardownContext(state)
            .then(() => {
              Renderer.getTemplate(templateId)
                .catch(error => {
                  assert(error)
                  done()
                })
            })
            .catch(done)
        })
        .catch(done)
    })
  })

  describe('#renderTemplate', () => {
    it('should render the template with the data', done => {
      Renderer.setupContext(state)
        .then(() => {
          const data = { page: { title: 'Test Text', content: '<p>This is the content</p>' } }
          Renderer.renderTemplate(state, 'testTemplate', data)
            .then(data => {
              assert(data.match('<title>Test Text</title>'), 'missing title')
              assert(data.match('<h1>Test Text</h1>'), 'missing headline')
              assert(data.match('<p>This is the content</p>'), 'missing content text')
              done()
            })
            .catch(done)
        })
        .catch(done)
    })

    it('should throw error if template does not exist in cache', done => {
      Renderer.renderTemplate(state, 'doesnotexist')
        .catch(error => {
          assert(error)
          done()
        })
    })
  })

  describe('#putTemplate / #getTemplate', () => {
    it('should put compiled template into cache and fetch cached template', done => {
      Renderer.clearTemplates()
      Renderer.putTemplate('testTemplate', 'Test')
        .then(() => {
          Renderer.getTemplate('testTemplate')
            .then(template => {
              assert.equal(typeof template, 'function')
              assert.equal(template(), 'Test')
              done()
            })
        })
        .catch(done)
    })
  })

  describe('#clearTemplates', () => {
    it('should drop template cache', done => {
      Renderer.putTemplate('testTemplate', 'Test')
        .then(() => {
          Renderer.clearTemplates()
            .then(() => {
              Renderer.getTemplate('testTemplate')
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
      Renderer.clearTemplates()
      Renderer.putTemplate(templateName, 'Test Content')
        .then(() => {
          Renderer.getTemplate(templateName)
            .then(template => {
              assert.equal(typeof template, 'function')
              assert.equal(template(), 'Test Content')
              done()
            })
        })
        .catch(done)
    })
  })

  describe('#getTemplate', () => {
    it('should throw error if template does not exist in cache', done => {
      Renderer.clearTemplates()
      Renderer.getTemplate('getTemplateTestWithNonExistingTemplate')
        .catch(error => {
          assert(error)
          done()
        })
    })
  })
})
