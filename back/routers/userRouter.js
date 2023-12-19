import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import UserController from "../controllers/userController";
import profileMiddleware from "../middlewares/profileMiddleware"

const userRouter = Router();

userRouter.post('/user/register', UserController.addUser)
userRouter.post('/user/password_reset', UserController.resetPassword)
userRouter.post('/user/login', UserController.getUser)
userRouter.get('/user/auth/kakao', UserController.kakaoLogin)
userRouter.get('/user/mypage', login_required, UserController.detailUser)
userRouter.put('/user/update', login_required, profileMiddleware.single("profile_image"), UserController.setUser)
userRouter.delete('/user/delete', login_required, UserController.deleteUser)
userRouter.post(
  "/user/profile",
  login_required,
  profileMiddleware.single("profileImage"),
  UserController.uploadProfile
);
export { userRouter };
