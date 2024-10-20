import type { TaskType } from "./task"

interface UserType {
  _id?: string,
  email: string,
  username: string,
  task_list?: Array<{
    name: string,
    describe: string,
  }>
  total_finish_task_num?: number,
  today_finish_task_num?: number,
  register_date?: Date,
  update_date?: Date,
  describe: string
}

export type { UserType }
