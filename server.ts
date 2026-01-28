import express, { application } from 'express';
import router from './routes';

const app = express();
const port: Number = 8080;
const hostname: String = "192.168.1.2";

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(router);

app.listen({port, hostname}, () => {console.log("Server rodando em " + `http://${hostname}:${port}`)});
