import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import bcrypt from 'bcrypt'
import 'dotenv/config'


export interface User {
	name: string
	email: string
	password: string
}

interface UserPyload {
	email: string
}

export async function addUser(user: User) {
	const passwordHash = await bcrypt.hash(user.password, 10);

	await prisma.user.create({
		data: {
			name: user.name,
			email: user.email,
			passwordHash: passwordHash,
		}
	})

	const userPyload: UserPyload = { email: user.email }

	return {
		message: "Account created successfully !",
		accessToken: jwt.sign(userPyload, process.env.ACCESS_TOKEN_SECRET as string),
		refreshToken: jwt.sign(userPyload, process.env.REFRESH_TOKEN_SECRET as string)
	}
}