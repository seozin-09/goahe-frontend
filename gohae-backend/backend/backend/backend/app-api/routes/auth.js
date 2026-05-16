const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: '이미 존재하는 이메일' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword
  });

  res.status(201).json({ message: '회원가입 성공' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: '유저 없음' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: '비밀번호 오류' });
  }

  const token = jwt.sign(
    { userId: user._id },
    'SECRET_KEY',
    { expiresIn: '1h' }
  );

  res.json({ token });
});

module.exports = router;
