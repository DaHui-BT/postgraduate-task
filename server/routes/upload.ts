import multer from 'multer'
import express from 'express'
import fs from 'fs'
import path from 'path'
import moment from 'moment'


const router = express.Router()

const storage = multer.diskStorage({
  destination: function (req: any, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
    let upload_path: string = `uploads/${moment().format('YY-MM-DD')}`
    
    if (!fs.existsSync(upload_path)) {
      fs.mkdirSync(upload_path, { recursive: true }); // 使用recursive确保可以创建多级目录
    }
    callback(null, upload_path)
  },
  filename: function (req: any, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
    callback(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
})

const upload = multer({ storage: storage })

// 在你的路由中使用upload.single('fieldName')或其他方法
router.post('/file', upload.single('file'), (req, res, next) => {
  // 文件信息在 req.file
  if (!req.file) {
    return res.status(400).send('No file was uploaded.')
  }
  // 构造文件的完整路径
  const filePath = path.join(req.file.destination, req.file.filename);
  res.setHeader('content-type', 'application/json;charset=utf-8')
  res.send({
    message: 'file uploaded successfully!',
    data: path.join(req.file.destination.replace('uploads/', ''), req.file.filename)
  })
})

export default router