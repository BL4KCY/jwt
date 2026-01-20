import { User as u } from "../interfaces/user.Interface";
import { prisma } from "../lib/prisma";
import { tokensGenerator } from "./auth.tokensGenerator";
import bcrypt from 'bcrypt'
import { error } from "node:console";

type User = Omit<u, "name">

export async function getUser(user: User) {
	const dbUser = await prisma.user.findUnique({
		where: {
			email: user.email
		}
	})

	const verify = await bcrypt.compare(user.password, dbUser!.passwordHash);

	if (!verify) throw error('Invalid email or password !!')

	return await tokensGenerator({ email: user.email, id: dbUser!.id })
}
