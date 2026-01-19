import express from 'express';
import { database } from '../../../infrastructure/database/NeonClient';
import { UserDatabase } from '../../../infrastructure/user/UserDatabase';

import { UpdateController } from './UpdateController';
import { RegisterController } from './RegisterController';
import { DeleteController } from './DeleteController';

import { UserRegister } from '../../../application/User/usecases/UserRegister';
import { UserUpdate } from '../../../application/User/usecases/UserUpdate';
import { UserDelete } from '../../../application/User/usecases/UserDelete';
import { UserRead } from '../../../application/User/usecases/UserRead';
import { ReadController } from './ReadController';

const router = express.Router();

const useDatabase = new UserDatabase(database);

const useCreate = new UserRegister(useDatabase);
const useRead = new UserRead(useDatabase);
const useUpdate = new UserUpdate(useDatabase);
const useDelete = new UserDelete(useDatabase);

const useControllerCreate = new RegisterController(useCreate);
const useControllerRead = new ReadController(useRead);
const useControllerUpdate = new UpdateController(useUpdate);
const useControllerDelete = new DeleteController(useDelete);

router.post("/register", (req, res) => useControllerCreate.execute(req, res));
router.put("/update", (req, res) => useControllerUpdate.execute(req, res));
router.delete("/delete", (req, res) => useControllerDelete.execute(req, res));
router.get("/read", (req, res) => useControllerRead.execute(req, res))

export default router;