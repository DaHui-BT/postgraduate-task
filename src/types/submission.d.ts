import { BSON } from "realm-web"



interface SubmissionType {
  _id?: BSON.ObjectId,
  user_id?: string | undefined,
  date: Date,
  title: string,
  message: string,
  file_id_list?: BSON.ObjectId[],
  file_name_list?: string[],
  status: number
}


interface SubmissionListType {
  id: string,
  task_list: TaskType[]
}

type ObjectId = BSON.ObjectId

export type { SubmissionType, SubmissionListType, ObjectId }
