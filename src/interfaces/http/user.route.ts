import express from 'express';
import { database } from '../../infrastructure/database/NeonClient';
import { UserDatabase } from '../../infrastructure/user/UserDatabase';
import { UserRegister } from '../../application/User/usecases/UserRegister';
const router = express.Router();

const useRepo = new UserDatabase();
const useRegister = new UserRegister(useRepo);

router.get("/", async (req, res) => {
  await useRegister.execute()
})
router.get("/test", (req, res) => res.send('Agora foi'))

export default router;