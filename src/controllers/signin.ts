import { Request, Response, NextFunction} from "express";
import { getUser } from '../services/auth.getUser'

export const signinController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { password, email } = req.body;
		const userStatus = await getUser({ email: email, password: password });
		res.json(userStatus);
	} catch (error) {
		next(error);
	}
}