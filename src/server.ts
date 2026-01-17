import express, { Express } from "express";
import signupRoute from './routes/signup.js'

const PORT = 3000;


const app = express();

app.use(express.json());

app.use('/auth', signupRoute);

app.listen(PORT, () => {
	console.log(`Authentication server is up and running in port: ${PORT}`)
})




