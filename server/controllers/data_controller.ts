import { Request, Response } from 'express'
import { TaskModel } from '../models/task'
import moment from 'moment'

const createData = async (req: Request, res: Response) => {
  try {
    // 假设图片已上传并存储在req.file中，这里只处理其他字段  
    const newData = new TaskModel({
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
      title: req.body['title'],
      message: req.body['message'],
      file: req.body['file_list'],
      status: 0,
      link: req.body['link']
    })
    // await newData.save()
    console.log(req.params, req.query, req.body)
    res.status(201).send(newData)
    newData.save().then(res => {
      console.log('save successful')
      // send to front success message
    }).catch(err => {
      console.log(err)
      // send to front error message
    })
  } catch (error) {
    res.status(500).send(error)
    // send to front backend error
  }
}

const getData = async (req: Request, res: Response) => {
  try {
    const data = await TaskModel.find()
    res.send(data);
  } catch (error) {
    res.status(500).send(error)
  }
}

export {
  createData,
  getData
}