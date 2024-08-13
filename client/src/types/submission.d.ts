interface TaskType {
  date: string,
  title: string,
  message: string,
  file: string[],
  status: number,
  link: string[]
}

interface SubmissionType {
  id: string,
  info: TaskType[]
}

export { type SubmissionType, TaskType }
