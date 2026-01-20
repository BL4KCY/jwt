import { error } from "node:console";
import { User } from "../interfaces/user.Interface";
import { prisma } from "../lib/prisma";
import { tokensGenerator } from "./auth.tokensGenerator";
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

	if (!createdUser) throw error('[addUser]: User doesn\'t exist !!')

	return tokensGenerator({ id: createdUser.id, email: user.email })
}