import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";
import { verifyUserJWT } from "../middlewares/auth.middleware.js";

const router = Router();
// User registration route
router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyUserJWT, logoutUser);

export default router;
