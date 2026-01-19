import { ErrorRequestHandler,Request, Response, NextFunction } from "express";

interface JsonSyntaxError extends SyntaxError {
  status?: number;
  body?: unknown;
}


export async function jsonErrorHandler(err: JsonSyntaxError, req: Request, res: Response, next: NextFunction) {
	if (err instanceof SyntaxError && err.status === 400, 'body' in err ) {
		return res.status(400).json({
			success: false,
			error: 'invalid JSON body'
		})
	}
	next(err);
}