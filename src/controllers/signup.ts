import { Request, Response, NextFunction } from "express";
import { addUser } from '../services/auth.addUser'



export async function signupController(req: Request, res: Response, next: NextFunction) {
	try {
		const { name, password, email } = req.body;
		const userStatus = await addUser({ name: name, email: email, password: password });
		res.cookie('token', userStatus);
		res.json(userStatus);
	} catch (error) {	
		next(error); // send error to global handler
	}
}