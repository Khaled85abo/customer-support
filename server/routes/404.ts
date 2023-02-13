import express from "express";
const router = express.Router();

router.use((req, res) => {
  res
    .status(400)
    .json({ error: `EndPoint ${req.method} ${req.path} not found` });
});

export default router;
