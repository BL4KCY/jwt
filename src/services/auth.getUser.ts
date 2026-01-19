import { User as u } from "../interfaces/user.Interface";
import { prisma } from "../lib/prisma";
import { getTokens } from "./auth.getTokens";
import bcrypt from 'bcrypt'
import { error } from "node:console";
import chalk from 'chalk'

type User = Omit<u, "name">

export async function getUser(user: User) {
	const dbUser = await prisma.user.findUnique({
		where: {
			email: user.email
		}
	})

	const verify = await bcrypt.compare(user.password, dbUser!.passwordHash);

	if (!verify) throw error(`${chalk.bgRed('[getUser-error]:')} Invalid email or password !!`)

	return getTokens({ email: user.email, id: dbUser!.id})
}
