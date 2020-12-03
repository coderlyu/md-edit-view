const fs = window.require('fs')
const path = window.require('path')

export function getFileNameAndExt (url) {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(url, (err, _result) => {
        if (err) {
          reject('文件不存在')
        }
        const { name, ext } = path.parse(url)
        const fileDetail = {
          name,
          ext,
          content: _result.toString()
        }
        resolve(fileDetail)
      })
    } catch (error) {
      reject(error)
    }
  })
}