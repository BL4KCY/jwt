import { Request, Response, NextFunction } from "express";
import { tokenRefresher } from "../services/auth.tokenRefresher";

export default async function refreshController(req: Request, res: Response, next: NextFunction) {
	try {
		res.json(await tokenRefresher(req.body.refreshToken))
	} catch (error) {
		next(error);
	}
}