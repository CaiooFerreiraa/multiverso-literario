import express from "express";
import UserRouter from './src/interfaces/http/user/user.route'
const router = express.Router();

router.use("/api/user", UserRouter);
router.get("/", (req, res) => res.send("Testando"))

export default router;