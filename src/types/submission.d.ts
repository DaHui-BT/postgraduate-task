import { TaskType, ObjectId } from "./task"

interface SubmissionType {
  id: string,
  task_list: TaskType[]
}

export { type SubmissionType, TaskType, ObjectId }
