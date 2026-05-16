// server.js
const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("./middleware/authMiddleware");
const User = require("./models/User");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log("HIT:", req.method, req.url);
  next();
});

// MongoDB 연결
mongoose
  .connect("mongodb://127.0.0.1:27017/mydb")
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => console.log("MongoDB 연결 실패", err));

app.get("/", (req, res) => {
  res.send("서버 실행 성공");
});

// ✅ 회원가입 로직을 함수로 분리 (중복 라우트 방지)
const registerHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email, password는 필수야" });
    }

    // ✅ 이메일 중복 체크 (이거 없으면 같은 이메일 무한 가입됨)
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "이미 존재하는 이메일" });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({ message: "회원가입 성공" });
  } catch (err) {
    res.status(500).json({ message: "에러 발생", error: err.message });
  }
};

// ✅ 기존 경로 유지
app.post("/register", registerHandler);

// ✅ 프론트가 쓰는 경로도 추가 (이게 핵심)
app.post("/auth/register", registerHandler);

app.get("/test", authMiddleware, (req, res) => {
  res.send("통과");
});

app.listen(3000, () => {
  console.log("서버 실행 중: http://localhost:3000");
  console.log("회원가입: POST /auth/register (또는 /register)");
});