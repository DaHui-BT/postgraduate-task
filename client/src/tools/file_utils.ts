function readFile(file: File, callback: () => null) {
  if (file) {
    const reader = new FileReader()
    reader.onload = callback
    reader.readAsText(file)
  }
}

function loadFile(name: string) {
  // name为文件所在位置
  let xhr = new XMLHttpRequest()
  const okStatus = document.location.protocol === 'file:' ? 0 : 200
  xhr.open('GET', name, false)
  xhr.overrideMimeType('text/html;charset=utf-8') //默认为utf-8
  xhr.send(null)
  return xhr.status === okStatus ? xhr.responseText : null
}

export {
  loadFile,
  readFile
}
