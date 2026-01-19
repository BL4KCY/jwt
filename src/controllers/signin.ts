import { Request, Response, NextFunction } from "express";
import { getUser } from '../services/auth.getUser'
import chalk from "chalk";

export async function signinController(req: Request, res: Response, next: NextFunction) {
	try {
		const { password, email } = req.body;
		const userStatus = await getUser({ email: email, password: password });
		res.cookie('token', userStatus);
		res.json(userStatus);
	} catch (error) {
		console.log(`${chalk.bgHex('F63049')('[signinController]')} debugging 1`);
		console.log(error);
		next(error); // send error to global handler
	}
}