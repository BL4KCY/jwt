import express, { Express } from "express";
import signUpRoute from './routes/signup'
import signInRoute from './routes/login'
import refreshRoute from './routes/refresh'
import { startTokenCleanupJob } from './services/data.cleandup'
import { prismaErrorHandler, jsonErrorHandler } from "./middlewares/application/global.error.handler";

const PORT = 3000;


const app = express();

app.use(express.json());

app.use('/auth', [
	signUpRoute,
	signInRoute,
	refreshRoute
])


app.use(
	jsonErrorHandler,
	prismaErrorHandler
);

app.listen(PORT, () => {
	console.log(`Authentication server is up and running in port: ${PORT}`)
})

startTokenCleanupJob();