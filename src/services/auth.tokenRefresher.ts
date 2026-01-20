import { User as u } from "../interfaces/user.Interface";
import { prisma } from "../lib/prisma";
import { tokensGenerator } from "./auth.tokensGenerator";
import { error } from "node:console";

type User = Omit<u, "name">

export async function tokenRefresher(refreshToken: string) {

	const deletedToken = await prisma.token.delete({
		where: {
			refreshToken: refreshToken
		}
	})

	const tokenOwner = await prisma.user.findUnique({
		where: {
			id: deletedToken.userID
		}
	})
	
	if (!tokenOwner) throw error('Token owner not found !')

	return await tokensGenerator({ email: tokenOwner.email, id: tokenOwner.id })
}
