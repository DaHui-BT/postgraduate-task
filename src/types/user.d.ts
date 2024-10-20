
interface UserType {
  _id?: string,
  email: string,
  username: string,
  register_date?: Date,
  update_date?: Date,
  describe: string
}

export type { UserType }
