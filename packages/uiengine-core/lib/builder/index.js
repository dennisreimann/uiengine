const generateSite = (config) => {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(true)
    }, 1000)
  })
}

module.exports = {
  generateSite
}
