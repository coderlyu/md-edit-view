import { Tabs, message } from 'antd'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import './layout.css'
import { getFileNameAndExt } from '../utils/_fs'
const { dialog } = window.require('electron').remote
const { TabPane } = Tabs
const mapStateToProps = (state) => {
  return {
    isNode: state.isNode
  }
}
let Header = () => {
  const [activeKey, setActiveKey] = useState('1')
  const [tabIndex, setTabIndex] = useState(0)
  const [panes, setPanes] = useState([])
  function onChange (val) {
    setActiveKey(val)
  }
  function onEdit (targetKey, action) {
    const operates = {
      add: () => {
        dialog.showOpenDialog({
          title: '请选择要打开的文件',
          properties: ['openFile', 'showHiddenFiles']
        }).then(({ filePaths }) => {
          getFileNameAndExt(filePaths[0]).then(({ content, name, ext }) => {
            if (['.md', '.txt'].includes(ext)) {
              const activeKey = `${name}${ext}${tabIndex + 1}`
              setActiveKey(activeKey)
              setTabIndex(tabIndex + 1)
              setPanes((panes || []).concat([{ title: `${name}${ext}`, content: content, key: activeKey }]))
            } else {
              message.warning('请选择markdown文件或txt文件')
            }
          })
        })
      },
      remove: (type) => {
        let newActiveKey = activeKey
        let lastIndex
        panes.forEach((pane, i) => {
          if (pane.key === type) {
            lastIndex = i - 1
          }
        })
        const newPanes = panes.filter(pane => pane.key !== type)
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
    operates[action](targetKey)
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
            <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
              {pane.content}
            </TabPane>
          ))}
        </Tabs>) : null
      }
    </>
  )
}
Header = connect(mapStateToProps)(Header)

const Layout = () => {
  return (
    <>
      <Header className="header" />
    </>
  )
}

export default connect(mapStateToProps)(Layout)