import { Request } from "@/tools/request";
import type { SubmitType } from "@/types/submit";


function get_task_list() {
  return new Request(null).get('list', null)
}

function save_task(data: SubmitType) {
  return new Request(null).post('save', data)
}

function save_file(data: any) {
  return new Request(null).post('file', data)
}

export {
  get_task_list,
  save_task,
  save_file
}
