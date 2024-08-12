import express from 'express';
import { createData, getData } from '../controllers/data_controller'
const router = express.Router()

router.post('/data', createData)
router.get('/data', getData)

export default router