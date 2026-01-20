import express from 'express';
import { database } from '../../../infrastructure/database/NeonClient';
import { TimelineDatabase } from '../../../infrastructure/timeline/TimelineDatabase';
import { TimelineCreate } from '../../../application/timeline/usecases/TimelineCreate';
import { CreateController } from './CreateController';

const repository = new TimelineDatabase(database);
const createTimline = new TimelineCreate(repository);
const createController = new CreateController(createTimline);

const router = express.Router();

router.post('/create', (req, res) => createController.execute(req, res));
router.get('/read', (req, res) => {
  console.log(req);
  res.status(200).json(req.query.nameBook)
})

export default router;