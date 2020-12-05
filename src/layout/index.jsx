/* eslint-disable react-hooks/exhaustive-deps */
import { Tabs, message } from 'antd'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import uuid from 'react-uuid'
import { Modal } from 'antd'
import ContentEditor from '../content'
import css from './index.module.scss'
import { getFileNameAndExt, saveFileByFilePath } from '../utils/_fs'
import EmptyNode from './empty'
const Mousetrap = require('mousetrap')
const { dialog } = window.require('electron').remote
const { ipcRenderer } = window.require('electron')
const { TabPane } = Tabs
const mapStateToProps = (state) => {
  return {
    isNode: state.isNode
  }
}

let Main = () => {
  const [activeKey, setActiveKey] = useState('')
  const [tabIndex, setTabIndex] = useState(0)
  const [panes, setPanes] = useState([])
  function onChange (val) {
    setActiveKey(val)
  }
  function onEdit (targetKey, action) {
    const operates = {
      add: addNewTab,
      remove: (type) => {
        let newActiveKey = activeKey
        let lastIndex
        panes.forEach((pane, i) => {
          if (pane.key === type) {
            lastIndex = i - 1
          }
        })
        const newPanes = panes.filter(pane => pane.key !== type)
        if (!newPanes.isSaved) {
          Modal.confirm({
            title: '提示',
            content: '该文件已修改，还未保存，关闭可能导致文件无法找回，是否继续？',
            zIndex: '11000',
            onOk () {
              remove()
            }
          })
        } else {
          remove()
        }
        function remove () {
          if (newPanes.length && newActiveKey === type) {
            if (lastIndex >= 0) {
              newActiveKey = newPanes[lastIndex].key
            } else {
              newActiveKey = newPanes[0].key
            }
          }
          setActiveKey(newActiveKey)
          setPanes(newPanes)
        }
      }
    }
    operates[action](targetKey)
  }
  useEffect(() => {
    // 注册 键盘快捷键
    Mousetrap.bind(['command+s', 'ctrl+s'], () => {
      if (activeKey) {
        saveFile(activeKey)
      }
      return false
    })
    return () => {
      Mousetrap.unbind(['command+s', 'ctrl+s'])
    }
  }, [activeKey, panes])
  useEffect(() => {
    ipcRenderer.on('openFile', (event, arg) => {
      openFile()
    })
    ipcRenderer.on('saveFile', (event, arg) => {
      if (activeKey) {
        saveFile(activeKey)
      }
    })
    return () => {
      ipcRenderer.removeAllListeners('openFile')
      ipcRenderer.removeAllListeners('saveFile')
    }
  }, [activeKey, panes, tabIndex])
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
  const saveFile = (key) => {
    let oldFilePath = (panes.filter(e => e.key === key)[0] || { url: '' }).url
    const data = panes.filter(e => e.key === key)[0].content || ''
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
  const addNewTab = () => {
    const newIndex = tabIndex + 1
    const activeKey = uuid()
    setActiveKey(activeKey)
    setTabIndex(newIndex)
    setPanes((panes || []).concat([{ title: `New Tab ${newIndex}`, content: '', key: activeKey, url: '', isSaved: false }]))
  }
  const contentChange = (key, data) => {
    setPanes(panes.map((item) => {
      if (item.key === key) {
        return Object.assign({ ...item }, {
          isSaved: false,
          content: data
        })
      }
      return item
    }))
  }
  return (
    <>
      {
        Array.isArray(panes) && panes.length > 0 ? (<Tabs
          type="editable-card"
          onChange={onChange}
          activeKey={activeKey}
          onEdit={onEdit}
        >
          {panes.map(pane => (
            <TabPane tab={
              <span className={css['title-dot-wrapper']}>
                {pane.isSaved ? null : (<span className={css['title-dot']} />)}
                {pane.title}
              </span>
            }
              key={pane.key} closable={pane.closable}>
              <ContentEditor
                content={pane.content}
                isSaved={pane.isSaved}
                key={pane.key}
                ownKey={pane.key}
                saveFile={saveFile}
                contentChange={contentChange}
              />
            </TabPane>
          ))}
        </Tabs>) : <EmptyNode addNewTab={addNewTab} openNewFile={openFile} />
      }
    </>
  )
}

export default connect(mapStateToProps)(Main)