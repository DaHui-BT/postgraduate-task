import { Request } from "@/tools/request";


function get_task_list() {
  return new Request(null).get('list')
}