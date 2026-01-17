import { Router } from "express";

import { signupController } from '../controllers/signup.js'
import { userReqValidating } from '../middlewares/checkUser.js'

const router = Router();



router.post('/signup', userReqValidating, signupController);


export default router