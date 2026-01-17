import { Request, Response, NextFunction } from "express";
import { prisma } from '../lib/prisma.js'
import userValidator from "../validators/user.Validator.js";






export async function userReqValidating(req: Request, res: Response, next: NextFunction) {
	console.log('**********')
	//const { name, email, password } = req.body;

	if (!userValidator(req.body)) {
		return res.status(400).json(userValidator.errors);
	}

	const userCheck = await prisma.user.findUnique({
		where: {
			email: req.body.email
		}
	})

	if (userCheck) {
		return res.status(400).json({
			message: 'User with this email already exists'
		});
	}
	console.log('userCheck', userCheck);
	next();
}
