//@ts-nocheck

import type { TaskType } from "@/types/submission"

function parse_task(text: string): TaskType[] {
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
    file: [],
    link: []
  })

  for (let line of lines) {
    line = line.replace('\r', '')

    if (!line.startsWith('#') && line != '') {
      if (line.startsWith('[') && line.endsWith(']')) {
        for (let f of task['file']) {
          task['link'].push('./tasks/' + task['date'] + '/' + f)
        }
        task_list.push(task)
        task = new Object({date: null, title: null, message: null, file: [], link: []})

        let title = line.substring(1, line.length-1)
        task['title'] = title
      } else {
        let pair = line.split('=')
        if (pair[0] == 'file') {
          task['file'].push(pair[1])
        } else {
          task[pair[0].trim()] = pair[1].trim()
        }
      }
    }
  }

  return task_list.slice(1, task_list.length)
}

export {
  parse_task
}
