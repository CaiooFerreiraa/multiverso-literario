import express from "express";
import homeRouter from './home.route'
const router = express.Router();

router.use("/", homeRouter);

export default router;