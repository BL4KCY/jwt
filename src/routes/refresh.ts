import { Router } from "express";
import refreshController from '../controllers/refresh'
import { tokenReqValidating } from '../middlewares/router/checkRefreshToken'

const router = Router();

router.post('/refresh', tokenReqValidating, refreshController);

export default router