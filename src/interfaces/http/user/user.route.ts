import express from 'express';
import { database } from '../../../infrastructure/database/NeonClient';
import { UserDatabase } from '../../../infrastructure/user/UserDatabase';
import { RegisterController } from './RegisterController';
import { UserRegister } from '../../../application/User/usecases/UserRegister';
import { UpdateController } from './UpdateController';
import { UserUpdate } from '../../../application/User/usecases/UserUpdate';
const router = express.Router();

const useDatabase = new UserDatabase(database);

const useRegister = new UserRegister(useDatabase)
const useUpdate = new UserUpdate(useDatabase)

const useControllerRegister = new RegisterController(useRegister);
const useControllerUpdate = new UpdateController(useUpdate);

router.post("/register", (req, res) => useControllerRegister.execute(req, res));
router.put("/update", (req, res) => useControllerUpdate.execute(req, res))

export default router;