import express from 'express';
import { createData, getData } from '../controllers/data_controller'
const router = express.Router()

router.post('/save', createData)
router.get('/list', getData)

export default router