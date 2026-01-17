import express from 'express';
import type { Request, Response } from 'express';
import ms from 'ms';
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { prisma } from './lib/prisma.js';
import argon2 from 'argon2';
import bcrypt from 'bcrypt'

const app = express()


// Fetch zero or more Users
const users = await prisma.user.findMany()

console.log(users);

app.use(express.json())




interface UserLogin {
	username: string
	passwordHash: string
}

interface UserSignup {
	name: string
	email: string
	password: string
}

interface UserPyload {
	email: string
}

const signUpValidating = async (req: Request, res: Response, next: Function) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		console.log("**************************************")
		return res.status(400).json({
			message: 'All fields are required',
			fields: {
				name: name || "<=== this",
				email: email || "<=== this",
				password: (password && '<hidden>') || "<=== this"
			}
		});
	}

	const userCheck = await prisma.user.findUnique({
		where: {
			email: email
		}
	})

	if (userCheck) {
		return res.status(400).json({
			message: 'User with this email already exists'
		});
	}
	console.log('userCheck', userCheck);

	const user: UserSignup = { name, email, password };
	req.body.user = user;
	next();
}

app.post('/signup', signUpValidating, async (req: Request, res: Response) => {

	const user: UserSignup = req.body.user;
	console.log(user);
	const passwordHash = await bcrypt.hash(user.password, 10);

	await prisma.user.create({
		data: {
			name: user.name,
			email: user.email,
			passwordHash: passwordHash,
		}
	})

	const userPyload: UserPyload = { email: user.email }

	res.json({
		message: "Account created successfully !",
		accessToken: generateAccessToken(userPyload),
		refreshToken: jwt.sign(userPyload, process.env.REFRESH_TOKEN_SECRET as string)
	})
})


function generateAccessToken(pyload: UserPyload) {
	return jwt.sign
		(
			pyload,
			process.env.ACCESS_TOKEN_SECRET as string,
			{
				expiresIn: process.env.REFRESH_INTERVAL as ms.StringValue || '30m'
			}
		)
}
try {
	app.listen(4000, () => {
		console.log('Server started -> http://localhost:4000');
	})

} catch (error) {
	console.error('Error starting server:', error);
}