import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dataRoutes from './routes/task_router'

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', dataRoutes);

const PORT = process.env.PORT || 3000

// import mongoose from 'mongoose';

// mongoose.connect('mongodb://localhost:27017/task', {
//   user: 'root',
//   pass: '123'
// }).then(() => console.log('MongoDB connected...'))
//   .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
