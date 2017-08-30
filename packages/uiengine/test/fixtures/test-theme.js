import path from 'path'

export const staticPath = path.resolve(__dirname, 'test-theme-static')

export async function setup (options) {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

export async function render (options, id, data = {}) {
  return new Promise((resolve, reject) => {
    resolve(`${id} ${JSON.stringify(data)}`)
  })
}

export async function teardown (options) {
  return new Promise((resolve, reject) => {
    resolve()
  })
}
