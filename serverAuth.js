import express from 'express';
import jwt from 'jsonwebtoken'
import env from 'dotenv'

env.config({ quiet: true })

const app = express()
app.use(express.json())


app.post('/login', (req, res) => {
	const username = req.body;
	console.log(username)
	const user = { name: username };

	res.json({
		accessToken: generateAccessToken(user),
		refreshToken: jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
	})
})

function generateAccessToken(pyload) {
	return jwt.sign
		(
			pyload,
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: process.env.REFRESH_INTERVAL || '30m'
			}
		)
}




app.listen(4000)