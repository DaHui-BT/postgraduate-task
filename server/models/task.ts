import mongoose from 'mongoose'


const TaskSchema = new mongoose.Schema({
  date: String,
  title: String,
  message: String,
  file: Array<String>,
  status: Number,
  link: String
})

export const TaskModel = mongoose.model('Data', TaskSchema)