import express from 'express';
import { neonClient } from '../../../infrastructure/database/neon';
import { UserNeonDatabase } from '../../../infrastructure/users/User.databaseNeon';

import { UpdateController } from './UpdateUsersController';
import { ReadController } from './ReadUsersController';
import { RegisterController } from './CreateUsersController';
import { DeleteController } from './DeleteUsersController';

import { UserRegister } from '../../../application/users/usecases/UserRegister';
import { UserUpdate } from '../../../application/users/usecases/UserUpdate';
import { UserDelete } from '../../../application/users/usecases/UserDelete';
import { UserRead } from '../../../application/users/usecases/UserRead';

const router = express.Router();

const useDatabase = new UserNeonDatabase(neonClient);

const useCreate = new UserRegister(useDatabase);
const useRead = new UserRead(useDatabase);
const useUpdate = new UserUpdate(useDatabase);
const useDelete = new UserDelete(useDatabase);

const useControllerCreate = new RegisterController(useCreate);
const useControllerRead = new ReadController(useRead);
const useControllerUpdate = new UpdateController(useUpdate);
const useControllerDelete = new DeleteController(useDelete);

router.post("/create", (req, res) => useControllerCreate.execute(req, res));
router.get("/read", (req, res) => useControllerRead.execute(req, res))
router.put("/update", (req, res) => useControllerUpdate.execute(req, res));
router.delete("/delete", (req, res) => useControllerDelete.execute(req, res));

export default router;