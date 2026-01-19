import jwt from "jsonwebtoken";
import 'dotenv/config'

interface UserPyload {
	id:	string
	email: string
}

export async function getTokens(userPyload: UserPyload) {
	return {
		success: true,
		message: "Tokens created successfully !",
		id: userPyload.id,
		accessToken: jwt.sign(userPyload, process.env.ACCESS_TOKEN_SECRET as string),
		refreshToken: jwt.sign(userPyload, process.env.REFRESH_TOKEN_SECRET as string)
	}
}