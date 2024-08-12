import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/task', {
  user: 'root',
  pass: '123',
  family: '', hints: '', localAddress: '', localPort: '', lookup: ''
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

