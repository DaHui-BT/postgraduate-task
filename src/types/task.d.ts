import type { BSON } from "realm-web"


interface TaskType {
  _id?: BSON.ObjectId,
  date: Date,
  title: string,
  message: string,
  file_id_list?: BSON.ObjectId[],
  file_name_list?: string[],
  status: number
}

type ObjectId = BSON.ObjectId

export type { TaskType, ObjectId }
