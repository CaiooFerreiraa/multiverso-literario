import express from "express";
import UserRouter from './src/interfaces/http/user/user.route'
import TimelineRouter from './src/interfaces/http/timeline/timeline.route'
const router = express.Router();

router.use("/api/user", UserRouter);
router.use("/api/timeline", TimelineRouter)

export default router;