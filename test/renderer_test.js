/* global describe, it */
const assert = require('assert')

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
    it('should register theme helpers with handlebars', done => {
      const hbs = require('handlebars')
      Renderer.setupContext(state)
        .then(data => {
          assert(typeof hbs.helpers['testHelper'] === 'function')
          done()
        })
        .catch(done)
    })

    it('should register theme partials with handlebars', done => {
      const hbs = require('handlebars')
      Renderer.setupContext(state)
        .then(data => {
          assert(hbs.partials['testLayout'])
          done()
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
})
