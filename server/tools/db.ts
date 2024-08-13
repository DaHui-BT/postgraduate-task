import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017', {
  user: 'root',
  pass: 'example'
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

