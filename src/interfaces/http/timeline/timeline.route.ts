import express from 'express';
import { database } from '../../../infrastructure/database/NeonClient';
import { TimelineDatabase } from '../../../infrastructure/timeline/TimelineDatabase';

import { TimelineCreate } from '../../../application/timeline/usecases/TimelineCreate';
import { TimelineRead } from '../../../application/timeline/usecases/TimelineRead';

import { CreateController } from './CreateController';
import { ReadController } from './ReadController';

const repository = new TimelineDatabase(database);

const createTimeline = new TimelineCreate(repository);
const readTimeline = new TimelineRead(repository);

const createController = new CreateController(createTimeline);
const readController = new ReadController(readTimeline);

const router = express.Router();

router.post('/create', (req, res) => createController.execute(req, res));
router.get('/read/:id_timeline', (req, res) => readController.execute(req, res));

export default router;