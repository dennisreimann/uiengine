const { exec } = require('child_process')

const runCommand = async (workingDir, command) => {
  return new Promise((resolve, reject) => {
    exec(`cd ${workingDir} && ${command}`, 'utf8', (err, stdout, stderr) => {
      if (err) {
        reject(err)
      } else {
        resolve(stdout)
      }
    })
  })
}

module.exports = {
  runCommand
}
