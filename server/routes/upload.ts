import multer from 'multer'
import express from 'express'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
});

const upload = multer({ storage: storage })

// 在你的路由中使用upload.single('fieldName')或其他方法
router.post('/data', upload.single('image'), createData)