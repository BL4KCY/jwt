import { Router } from "express";
import { signinController } from '../controllers/signin'
import { userReqSignInValidating } from '../middlewares/router/checkSignInUser'

const router = Router();

router.post('/login', userReqSignInValidating, signinController);

export default router