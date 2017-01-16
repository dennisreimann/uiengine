const fs = require('fs')
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()

async function readFile (filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        resolve(undefined)
      } else {
        const parsed = md.render(data)

        resolve(parsed)
      }
    })
  })
}

module.exports = {
  readFile
}
