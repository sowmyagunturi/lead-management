import { Router } from "express";
import {register, login,getCurrentUser, logout} from '../Controllers/AuthController.js'
import {loginValidation, registerValidation} from '../Middlewares/AuthValidation.js'
import validateToken from '../Middlewares/validateTokenhandler.js'
const router = Router();

router.post("/login", loginValidation, login);

router.post("/register",registerValidation, register);

router.get("/currentuser",validateToken,getCurrentUser);

router.post("/logout", logout );

export default router;
