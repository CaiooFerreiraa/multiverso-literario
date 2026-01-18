import express from 'express';
import router from './src/interfaces/http/routes';

const app = express();
const port: Number = 8080;
const hostname: String = "192.168.1.5";

app.use(express.urlencoded({extended: true}))
app.use(router);

app.listen({port, hostname}, () => {console.log("Server rodando em " + `http://${hostname}:${port}`)});
