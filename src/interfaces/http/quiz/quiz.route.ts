import express from "express";
const router = express.Router();

import { neonClient } from "../../../infrastructure/database/neon";
import { QuizDatabaseNeon } from "../../../infrastructure/quiz/Quiz.databaseNeon";

import { CreateQuizController } from "./CreateQuizController";
import { ReadQuizController } from "./ReadQuizController";

import { CreateQuiz } from "../../../application/quiz/usecases/CreateQuiz";
import { ReadQuiz } from "../../../application/quiz/usecases/ReadQuiz";

const repository = new QuizDatabaseNeon(neonClient);
const createQuiz = new CreateQuiz(repository);
const createQuizController = new CreateQuizController(createQuiz);
const readQuiz = new ReadQuiz(repository);
const readQuizController = new ReadQuizController(readQuiz);

router.post('/create', (req, res) => createQuizController.execute(req, res));
router.get('/read/:id_quiz', (req, res) => readQuizController.execute(req, res));

export default router;