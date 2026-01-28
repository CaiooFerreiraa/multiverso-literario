import express from "express";
import UserRouter from './src/interfaces/http/users/user.route'
import TimelineRouter from './src/interfaces/http/timeline/timeline.route'
import QuizRouter from './src/interfaces/http/quiz/quiz.route'
const router = express.Router();

router.use("/api/user", UserRouter);
router.use("/api/timeline", TimelineRouter);
router.use("/api/quiz", QuizRouter)

export default router;