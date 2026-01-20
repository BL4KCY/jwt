import jwt from "jsonwebtoken";
import 'dotenv/config'
import { prisma } from "../lib/prisma";
import {StringValue} from 'ms'
import getExpiresAtFromMs from "../utils/getExpiresAtFromMs";

interface UserPyload {
	id:	string
	email: string
}

export async function tokensGenerator(userPyload: UserPyload) {
	const expiresIn = (process.env.REFERSH_INTERVAL || '30d') as StringValue;
	const refreshToken = jwt.sign(
		userPyload,
		process.env.REFRESH_TOKEN_SECRET as string,
		{
			expiresIn: expiresIn
		}
	)

	/**
	 * because the refreshToken is unique
	 * i use upsert instead of create because of the user sign two times at the same time
	 * so if it's issue at <same time> it's gonna have the same previous token
	*/
	await prisma.token.upsert({
		where: {
			refreshToken: refreshToken
		},
		update: {
		},
		create: {
			refreshToken: refreshToken,
			userID: userPyload.id,
			expiresAt: getExpiresAtFromMs(expiresIn)
		}
	})

	return {
		success: true,
		message: "Tokens created successfully !",
		id: userPyload.id,
		accessToken: jwt.sign(userPyload, process.env.ACCESS_TOKEN_SECRET as string),
		refreshToken: refreshToken
	}
}
