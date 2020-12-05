import { getFileNameAndExt, saveFileByFilePath } from '../utils/_fs'
import { message } from 'antd'
import { useEffect } from 'react'
const { dialog } = window.require('electron').remote
const { ipcRenderer } = window.require('electron')
const File = () => {
  useEffect(() => {
    ipcRenderer.on('openFile', (event, arg) => {
      openFile()
    })
    ipcRenderer.on('saveFile', (event, arg) => {
      console.log('渲染进程：', event, arg)
    })
    return () => {
      ipcRenderer.removeAllListeners('openFile')
      ipcRenderer.removeAllListeners('saveFile')
    }
  }, [])
  const openFile = () => {
    dialog.showOpenDialog({
      title: '请选择要打开的文件',
      properties: ['openFile', 'showHiddenFiles']
    }).then(({ filePaths, canceled }) => {
      if (!canceled && filePaths) {
        const filePath = filePaths[0]
        getFileNameAndExt(filePath).then(({ content, name, ext }) => {
          if (['.md', '.txt'].includes(ext)) {
            let newIndex = tabIndex + 1
            const activeKey = uuid()
            setActiveKey(activeKey)
            setTabIndex(newIndex)
            setPanes((panes || []).concat([{ title: `${name}${ext}`, content: content, key: activeKey, url: filePath, isSaved: true }]))
          } else {
            message.warning('请选择markdown文件或txt文件')
          }
        }).catch((err) => {
          message.error(err.message || err)
        })
      }
    })
  }
  const saveFile = (key, data) => {
    let oldFilePath = (panes.filter(e => e.key === key)[0] || { url: '' }).url
    dialog.showSaveDialog({
      title: '请选择文件保存的位置',
      defaultPath: oldFilePath || '',
      filters: [
        { name: 'markdown', extensions: ['md', 'txt'] }
      ]
    }).then(({ canceled, filePath }) => {
      if (!canceled && filePath) {
        getFileNameAndExt(filePath, false).then(({ ext, name }) => {
          if (['.md', '.txt'].includes(ext)) {
            saveFileByFilePath(filePath, data).then(() => {
              setPanes(panes.map((item) => {
                if (item.key === key) {
                  return Object.assign({ ...item }, {
                    title: `${name}${ext}`,
                    url: filePath,
                    isSaved: true,
                    content: data
                  })
                }
                return item
              }))
              message.success('文件保存成功')
            }).catch((err) => {
              message.error(err.message || err)
            })
          } else {
            message.warning('请保存为markdown文件或txt文件')
          }
        })
      }
    })
  }
}
export default File