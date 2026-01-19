import { User } from "../interfaces/user.Interface";
import { prisma } from "../lib/prisma";
import { getTokens } from "./auth.getTokens";
import bcrypt from 'bcrypt'


export async function addUser(user: User) {
	const passwordHash = await bcrypt.hash(user.password, 10);

	const createdUser = await prisma.user.create({
		data: {
			name: user.name,
			email: user.email,
			passwordHash: passwordHash,
		}
	})

	return getTokens({ id: createdUser.id,email: user.email })
}