import express from 'express';
import { database } from '../../../infrastructure/database/NeonClient';
import { TimelineNeonDatabase } from '../../../infrastructure/timeline/Timeline.databaseNeon';

import { TimelineCreate } from '../../../application/timeline/usecases/TimelineCreate';
import { TimelineRead } from '../../../application/timeline/usecases/TimelineRead';
import { TimelineUpdate } from '../../../application/timeline/usecases/TimelineUpdate';
import { TimelineDelete } from '../../../application/timeline/usecases/TimelineDelete';

import { CreateController } from './CreateController';
import { ReadController } from './ReadController';
import { UpdateController } from './UpdateController';
import { DeleteController } from './DeleteController';


const repository = new TimelineNeonDatabase(database);

const createTimeline = new TimelineCreate(repository);
const readTimeline = new TimelineRead(repository);
const updateTimeline = new TimelineUpdate(repository);
const deleteTimeline = new TimelineDelete(repository);

const createController = new CreateController(createTimeline);
const readController = new ReadController(readTimeline);
const updateController = new UpdateController(updateTimeline);
const deleteController = new DeleteController(deleteTimeline);

const router = express.Router();

router.post('/create', (req, res) => createController.execute(req, res));
router.get('/read/:id_timeline', (req, res) => readController.execute(req, res));
router.put('/update', (req, res) => updateController.execute(req, res));
router.delete('/delete/:id_timeline', (req, res) => deleteController.execute(req, res));

export default router;