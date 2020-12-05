/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import E from 'wangeditor'
import { Button, Tooltip } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import _config from './editorConfig'
import css from './index.module.scss'
let editor = null
const Left = ({ textChange, text, ownKey }) => {
  const k = 'editorId' + ownKey
  let count = 0
  useEffect(() => {
    editor = new E(`#${k}`)
    editor.config.onchange = (newHtml) => {
      if (count === 0) {
        count++
      } else {
        textChange(newHtml)
      }
    }
    editor.config.menus = _config.menus
    editor.config.colors = _config.colors
    editor.create()
    editor.txt.html(text)
    return () => {
      editor.destroy()
    }
  }, [])
  return (<div id={k} className={css['editorClass']} style={{ height: '100%' }} />)
}
const Right = ({ content }) => {
  return (
    <div className={css['content-right']}>
      <h2 className={css['right-title']}>显示内容</h2>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
const Content = ({ content, isSaved, ownKey, saveFile, contentChange }) => {
  const textChange = (val) => {
    contentChange(ownKey, val)
  }
  return (
    <div className={css['content-wrapper']}>
      <Tooltip title={isSaved ? '文件已保存' : '点击保存文件'}>
        <Button className={css['content-save']}
          type={isSaved ? '' : 'primary'}
          disabled={isSaved}
          shape="circle" onClick={isSaved ? '' : () => saveFile(ownKey, content)}>
          <SaveOutlined />
        </Button>
      </Tooltip>
      <Left textChange={textChange} ownKey={ownKey} text={content} />
      <Right content={content} text={content} />
    </div>
  )
}

export default Content