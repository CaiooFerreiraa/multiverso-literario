import express from "express";
const router = express.Router();

router.post('/create', (req, res) => {
  console.log("testando rota");
  const useData = req.body;

  console.log(useData.questions[0].alternatives)
  res.status(200).send("Tudo OK")
})

export default router;