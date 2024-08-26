import { Router } from "express";
import * as controller from "../controller/controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import upload from "../helper/upload.js";
const router = Router();

router.route("/users/signup").post(controller.signUp);
router.route("/users/signin").post(controller.signIn);
router.route("/users/logout").post(verifyJWT, controller.userLogout);
router.route("/verifymail").post(controller.verifyEmail);
router.route("/addpost").post(upload.single('file'),controller.addPost);

export default router;
