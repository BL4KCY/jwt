import { Request, Response, NextFunction } from "express";
import { prisma } from '../../lib/prisma.js'
import {userSignInValidator} from "../../validators/user.Validator.js";

const notAllowedMessage = 'Wrong email or password, Please try again!!'

export async function userReqSignInValidating(req: Request, res: Response, next: NextFunction) {
	
	if (!userSignInValidator(req.body)) {
		return res.status(400).json(userSignInValidator.errors);
	}
	
	const userCheck = await prisma.user.findUnique({
		where: {
			email: req.body.email
		}
	})

	if (!userCheck) {
		return res.status(400).json({
			success: false,
			message: notAllowedMessage
		});
	}
	next();
}
