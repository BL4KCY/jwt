import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { Prisma } from "../../lib/prisma";

interface JsonSyntaxError extends SyntaxError {
	status?: number;
	body?: unknown;
}


const jsonErrorHandler: ErrorRequestHandler = (err: JsonSyntaxError, req: Request, res: Response, next: NextFunction) => {

	if (err instanceof SyntaxError && err.status === 400, 'body' in err) {
		return res.status(400).json({
			success: false,
			error: 'invalid JSON body'
		})
	}
	next(err);
}

const prismaErrorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		if (err.code == 'P2002') {
			res.status(500).json({
				success: false,
				message: "Resources Already Exist"
			})
		}
		res.status(500).json({
			success: false,
			message: "database Error!"
		})
	}
	next()
}

export {
	jsonErrorHandler,
	prismaErrorHandler
}