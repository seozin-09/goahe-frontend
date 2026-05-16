const express = require("express");
const Memo = require("../models/Memo");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//////////////////////////////////////////////////
// ✅ 메모 저장 (로그인 필요)
//////////////////////////////////////////////////
router.post("/", authMiddleware, async (req, res) => {

  const { content } = req.body;

  const memo = await Memo.create({
    userId: req.user.userId,
    content: content
  });

  res.json({
    message: "메모 저장 완료",
    memo
  });
});

//////////////////////////////////////////////////
// ✅ 내 메모 보관함
//////////////////////////////////////////////////
router.get("/my", authMiddleware, async (req, res) => {

  const memos = await Memo.find({
    userId: req.user.userId
  }).sort({ createdAt: -1 });

  res.json(memos);
});

module.exports = router;