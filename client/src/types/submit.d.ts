interface SubmitType {
  date: string,
  title: string,
  message: string,
  file_name_list?: string[],
  file_list: FormData[],
  status?: number
}

export { type SubmitType }
