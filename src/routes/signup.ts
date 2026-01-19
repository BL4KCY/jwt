import { Router } from "express";
import { signupController } from '../controllers/signup'
import { userReqSignUpValidating } from '../middlewares/router/checkSignUpUser'

const router = Router();

router.post('/signup', userReqSignUpValidating, signupController);

export default router