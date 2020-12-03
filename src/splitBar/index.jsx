import React, { useState, useEffect } from 'react'
const SplitBar = () => {
  const [left, setLeft] = useState('50%')
  useEffect(() => {
    let splitBar = document.getElementById('split-bar')
    splitBar.onmousedown = (e) => {
      let startX = e.clientX
      let eParent = e.parentNode
      splitBar.left = splitBar.offsetLeft
      document.onmousemove = function (e) {
        var endX = e.clientX
        var moveLen = splitBar.left + (endX - startX)
        var maxT = eParent.clientWidth - splitBar.offsetWidth
        if (moveLen < 150) moveLen = 150
        if (moveLen > maxT - 150) moveLen = maxT - 150
        splitBar.style.left = moveLen
      }
      document.onmouseup = function (evt) {
        document.onmousemove = null
        document.onmouseup = null
        splitBar.releaseCapture && splitBar.releaseCapture()
      }
      splitBar.setCapture && splitBar.setCapture()
      return false
    }
    return () => {
      splitBar.onmousedown = null
    }
  }, [])
  return (<div id="split-bar" style={{ width: '2px', height: '100vh', background: '#efefef', cursor: 'ew-resize' }} />)
}

export default SplitBar
