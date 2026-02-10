import express from "express";
const router = express.Router();

import { neonClient } from "../../../infrastructure/database/neon";
import { QuizDatabaseNeon } from "../../../infrastructure/quiz/Quiz.databaseNeon";

import { CreateQuizController } from "./CreateQuizController";
import { ReadQuizController } from "./ReadQuizController";
import { UpdateQuizController } from "./UpdateQuizController";
import { DeleteQuizController } from "./DeleteQuizController";

import { CreateQuiz } from "../../../application/quiz/usecases/CreateQuiz";
import { ReadQuiz } from "../../../application/quiz/usecases/ReadQuiz";
import { UpdateQuiz } from "../../../application/quiz/usecases/UpdateQuiz";
import { DeleteQuiz } from "../../../application/quiz/usecases/DeleteQuiz";
import { ResponseQuiz } from "../../../application/quiz/usecases/ResponseQuiz";
import { ResponseQuizController } from "./ResponseQuizController";
import { ReadQuizzesResponse } from "../../../application/quiz/usecases/ReadQuizzesResponse";
import { ReadQuizzesResponseController } from "./ReadQuizzesResponseController";


const repository = new QuizDatabaseNeon(neonClient);
const createQuiz = new CreateQuiz(repository);
const createQuizController = new CreateQuizController(createQuiz);
const readQuiz = new ReadQuiz(repository);
const readQuizController = new ReadQuizController(readQuiz);
const updateQuiz = new UpdateQuiz(repository);
const updateQuizController = new UpdateQuizController(updateQuiz);
const deleteQuiz = new DeleteQuiz(repository);
const deleteQuizController = new DeleteQuizController(deleteQuiz);

const responseQuiz = new ResponseQuiz(repository);
const responseQuizController = new ResponseQuizController(responseQuiz);
const readResponseQuiz = new ReadQuizzesResponse(repository)
const readQuizzesResponseController = new ReadQuizzesResponseController(readResponseQuiz);

router.post('/create', (req, res) => createQuizController.execute(req, res));
router.get('/read/:id_quiz', (req, res) => readQuizController.execute(req, res));
router.put('/update', (req, res) => updateQuizController.execute(req, res));
router.delete("/delete/:id_quiz", (req, res) => deleteQuizController.execute(req, res));
router.post('/response', (req, res) => responseQuizController.execute(req, res));
router.get('/response/:id_user', (req, res) => readQuizzesResponseController.execute(req, res));

export default router;