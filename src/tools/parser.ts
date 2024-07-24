function parse_task(text: string): {date: string, title: string, message: string, file: string, link: string}[] {
  if (text.trim() == '' || text == undefined || text == null) {
    alert("Config file error: [task file format not correct]!")
    return
  }

  let lines = text.split('\n')
  let task_list = []

  let task = new Object({
    date: null,
    title: null,
    message: null,
    file: null,
    link: null
  })

  for (let line of lines) {
    line = line.replace('\r', '')

    if (!line.startsWith('#') && line != '') {
      if (line.startsWith('[') && line.endsWith(']')) {
        task['link'] = './tasks/' + task['date'] + '/' + task['file']
        task_list.push(task)
        task = new Object({date: null, title: null, message: null, file: null, link: null})

        let title = line.substring(1, line.length-1)
        task['title'] = title
      } else {
        let pair = line.split('=')
        task[pair[0].trim()] = pair[1].trim()
      }
    }
  }

  return task_list.slice(1, task_list.length)
}

export {
  parse_task
}
