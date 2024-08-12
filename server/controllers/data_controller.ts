import { Request, Response } from 'express'
import { TaskModel } from '../models/task'

export const createData = async (req: Request, res: Response) => {
  try {
    // 假设图片已上传并存储在req.file中，这里只处理其他字段  
    const newData = new TaskModel({
      date: req.params['date'],
      title: req.params['title'],
      message: req.params['message'],
      file: req.params['file'],
      status: req.params['status'],
      link: req.params['link']
    })
    // await newData.save()
    console.log(req)
    res.status(201).send(newData)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const getData = async (req: Request, res: Response) => {
  try {
    const data = await TaskModel.find()
    res.send(data);
  } catch (error) {
    res.status(500).send(error)
  }
}