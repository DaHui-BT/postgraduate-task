import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import dataRoutes from './routes/task_router'
import fileRoutes from './routes/upload'

const app = express();

app.use(cors());
app.use(express.static('uploads'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', dataRoutes);
app.use('/api', fileRoutes)

const PORT = process.env.PORT || 3000

import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost:27017', {
  user: 'root',
  pass: 'example',
  dbName: 'admin'
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
