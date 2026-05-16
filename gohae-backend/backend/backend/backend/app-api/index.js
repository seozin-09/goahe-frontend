const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const memoRoutes = require('./routes/memo');

const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
  'mongodb://127.0.0.1:27017/appdb'
).then(() => {
  console.log('MongoDB 연결 성공');
});

app.get('/', (req, res) => {
  res.send('App API Server');
});

app.use('/auth', authRoutes);
app.use('/memo', memoRoutes);

app.get('/profile', authMiddleware, (req, res) => {
  res.json({
    message: '인증 성공',
    userId: req.user.userId
  });
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
});
