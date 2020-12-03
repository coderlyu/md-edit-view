import React, { useState } from 'react'
import Editor from '../wangEditor'
import SplitBar from '../splitBar/index'
import './index.css'
const Left = () => {
  return (<div id="editorId" />)
}
const Right = ({ content }) => {
  return (<div className="content-right">{{ content }}</div>)
}
const Content = () => {
  const [text, setText] = useState('')
  return (
    <div className="content-wrapper">
      <Editor render={(val) => {
        setText(val)
        return (<Left />)
      }} />
      <SplitBar />
      <Right content={text} />
    </div>
  )
}

export default Content