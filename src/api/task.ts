import { Request } from "@/tools/request";
import type { SubmitType } from "@/types/submit";


function save_file(data: any) {
  return new Request(null).post('file', data)
}

export {
  save_file
}
