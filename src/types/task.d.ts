import type { BSON } from "realm-web"


interface TaskType {
  _id?: BSON.ObjectId,
  user_id?: BSON.ObjectId | string,
  date?: Date,
  task_list: {
    name: string,
    describe: string,
  }[]
}

export type { TaskType }
