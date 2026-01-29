import express from "express";
const router = express.Router();

import { database } from "../../../infrastructure/database/neon/NeonAdpter";
import { QuizDatabaseNeon } from "../../../infrastructure/quiz/Quiz.databaseNeon";

import { CreateQuizController } from "./CreateQuizController"; 

import { CreateQuiz } from "../../../application/quiz/usecases/CreateQuiz";

const repository = new QuizDatabaseNeon(database);
const createQuiz = new CreateQuiz(repository);
const createQuizController = new CreateQuizController(createQuiz);

router.post('/create', (req, res) => createQuizController.execute(req, res));

export default router;