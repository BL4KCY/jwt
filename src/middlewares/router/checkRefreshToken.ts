import { Request, Response, NextFunction } from "express";
import { prisma } from '../../lib/prisma.js'
import {tokenValidator} from "../../validators/token.Validator";
import jwt from 'jsonwebtoken'

const INVALID_TOKEN = 'Invalid Token, try again with Valid Token!'
const TOKEN_EXPIRED = 'Expired Token!, try again with Valid Token!'

export async function tokenReqValidating(req: Request, res: Response, next: NextFunction) {
	try {
		if (!tokenValidator(req.body)) {
			return res.status(400).json(tokenValidator.errors);
		}
		const tokenCheck = await prisma.token.findUnique({
			where: {
				refreshToken: req.body.refreshToken
			}
		})
		
		if (!tokenCheck) {
			return res.status(400).json({
				success: false,
				message: INVALID_TOKEN
			});
		}
		
		jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err, decoded) => {
			if (err) {
				return res.status(400).json({
					success:false,
					message: TOKEN_EXPIRED
				})
			}
		})
	} catch (error) {
		next(error);
	}
	next();
}
