const fs = window.require('fs')
const path = window.require('path')

export function getFileNameAndExt (url, readFile = true) {
  return new Promise((resolve, reject) => {
    try {
      if (readFile) {
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
      } else {
        const { name, ext } = path.parse(url)
        const fileDetail = {
          name,
          ext
        }
        resolve(fileDetail)
      }
    } catch (error) {
      reject(error)
    }
  })
}

export function saveFileByFilePath (url, data, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFile(url, data, options, (err) => {
        if (err) {
          reject('文件写入失败')
        }
        resolve('文件写入成功')
      })
    } catch (error) {
      reject(error)
    }
  })
}