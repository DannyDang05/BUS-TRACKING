import express from "express";

const router = express.Router();

// 🧠 ví dụ route
router.get("/", (req, res) => {
  res.send("Xin chào từ Bus Tracking API 🚍");
});

// ✅ xuất đúng cú pháp ESM
const initWebRouter = (app) => {
  return app.use("/", router);
};

export default initWebRouter;
