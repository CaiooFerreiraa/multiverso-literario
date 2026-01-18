import express from 'express';
import { database } from '../../../infrastructure/database/NeonClient';
import { UserDatabase } from '../../../infrastructure/user/UserDatabase';
import { RegisterController } from './RegisterController';
import { UserRegister } from '../../../application/User/usecases/UserRegister';
const router = express.Router();

const useDatabase = new UserDatabase(database);
const useRegister = new UserRegister(useDatabase)
const useController = new RegisterController(useRegister);

router.post("/register", (req, res) => useController.register(req, res));
router.get("/test", (req, res) => res.send('Agora foi'))

export default router;