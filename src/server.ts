import express, { Express } from "express";
import signUpRoute from './routes/signup'
import signInRoute from './routes/login'
import { jsonErrorHandler } from "./middlewares/application/global.error.handler";

const PORT = 3000;


const app = express();

app.use(express.json());

app.use(jsonErrorHandler);

app.use('/auth', [
	signUpRoute,
	signInRoute
])

app.listen(PORT, () => {
	console.log(`Authentication server is up and running in port: ${PORT}`)
})




