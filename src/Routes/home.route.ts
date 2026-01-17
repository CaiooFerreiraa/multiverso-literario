import express from 'express';
const router = express.Router();

router.get("/", (req, res) => res.send('Agora foi na home'))
router.get("/test", (req, res) => res.send('Agora foi'))

export default router;