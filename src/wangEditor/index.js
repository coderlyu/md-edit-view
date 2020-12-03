import { useState, useEffect } from 'react'
import E from 'wangeditor'
let editor = null

const Editor = ({ render }) => {
  const [text, setText] = useState('')
  useEffect(() => {
    editor = new E("#div1")
    editor.config.onchange = (newHtml) => {
      setText(newHtml)
    }
    editor.create()
    return () => {
      editor.destroy()
    }
  }, [])

  return render(text)
}

export default Editor