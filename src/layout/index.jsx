import { Tabs } from 'antd'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import electron from 'electron'
import './layout.css'
const { dialog } = electron.remote
const { TabPane } = Tabs
const mapStateToProps = (state) => {
  return {
    isNode: state.isNode
  }
}
let Header = ({ isNode }) => {
  let file = null
  const [activeKey, setActiveKey] = useState('1')
  const [tabIndex, setTabIndex] = useState(0)
  const [panes, setPanes] = useState([
    { title: 'Tab 1', content: 'Content of Tab 1', key: '1' }
  ])
  function onChange (val) {
    setActiveKey(val)
  }
  function onEdit (targetKey, action) {
    const operates = {
      add: () => {
        platformOpt[isNode ? 'node' : 'web']()
        const activeKey = `newTab${tabIndex + 1}`
        setActiveKey(activeKey)
        setTabIndex(tabIndex + 1)
        setPanes((panes || []).concat([{ title: 'New Tab', content: 'Content of new Tab', key: activeKey }]))
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
  const platformOpt = {
    node: () => {
      dialog.showOpenDialog({
        title: '请选择要打开的文件',
        properties: ['openFile']
      })
    },
    web: () => {
      file.click()
    }
  }
  const fileUpload = (e) => {
    const fileData = e.target.files[0]
    console.log(fileData)
    let reader = new FileReader()
    reader.readAsText(fileData)
    reader.onload = function (_res) {
      var pointsTxt = _res.target.result
      console.log(pointsTxt)
    }
  }
  return (
    <>
      <Tabs
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
      </Tabs>
      <input type="file" ref={(arg) => { file = arg }} className="hidden" onChange={fileUpload} />
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