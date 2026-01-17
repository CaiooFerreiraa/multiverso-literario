import express from 'express';
import router from './src/Routes/routes';

const app = express()
const port: Number = 6060;

app.use(router)

app.listen(port, () => console.log("Servidor rodando em " + `http://192.168.1.5:${port}`))