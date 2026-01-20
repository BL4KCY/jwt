import { Request, Response, NextFunction } from "express";
import { prisma } from '../../lib/prisma.js'
import {userSignUpValidator} from "../../validators/user.Validator.js";

export async function userReqSignUpValidating(req: Request, res: Response, next: NextFunction) {
	if (!userSignUpValidator(req.body)) {
		return res.status(400).json(userSignUpValidator.errors);
	}

	const userCheck = await prisma.user.findUnique({
		where: {
			email: req.body.email
		}
	})


	if (userCheck) {
		return res.status(400).json({
			success: false,
			message: 'User with this email already exists'
		});
	}
	next();
}
