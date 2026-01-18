import express from 'express';
import { database } from '../../../infrastructure/database/NeonClient';
import { UserDatabase } from '../../../infrastructure/user/UserDatabase';
import UserController from './RegisterController';
import { UserRegister } from '../../../application/User/usecases/UserRegister';
const router = express.Router();

const useRepo = new UserDatabase(database);
const userRegister = new UserRegister(useRepo)
const userController = new UserController(userRegister);

router.get("/", (req, res) => userController.register(req, res));
router.get("/test", (req, res) => res.send('Agora foi'))

export default router;