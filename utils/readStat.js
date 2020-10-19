const FS = require('fs');

const readStat = (path) => {
  return new Promise((resolve, reject) => {
    FS.stat(path, (err, stat) => {
      if (!stat) resolve(null)
      else resolve(stat)
    })
  })
}

module.exports = readStat;
