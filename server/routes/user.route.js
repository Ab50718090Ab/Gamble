import { Router } from "express";
import {
    loginController,
    logoutController,
    registerController,
    verifyUserController,
    resendVerificationController,
    isAuthenticated,
    refreshTokenController,
    sendResetPasswordOTPController,
    verifyForgotPasswordOTPController,
    setNewPassword,
    getUserDetailsController,
    getUserDetailsByEmailController,
    depositMoneyToUserWalletController,
    updateUserDetailsController,
    getDayWiseWalletStatsController,
} from "../controllers/user.controller.js";

import AuthMiddleware from "../middleware/authMiddleware.js";

const userRoutes = Router();

// ================= AUTH =================
userRoutes.post("/register", registerController);
userRoutes.post("/login", loginController);
userRoutes.post("/logout", logoutController);
userRoutes.get("/is-auth", isAuthenticated);
userRoutes.post("/refresh-token", refreshTokenController);

// ================= EMAIL VERIFY =================
userRoutes.get("/verify-user/:token", verifyUserController);
userRoutes.post("/resend-verification", resendVerificationController);

// ================= PASSWORD RESET =================
userRoutes.post("/reset-password", sendResetPasswordOTPController);
userRoutes.post("/verify-reset-password-otp", verifyForgotPasswordOTPController);
userRoutes.post("/set-new-password", setNewPassword);

// ================= USER =================
userRoutes.get("/my-details", AuthMiddleware, getUserDetailsController);
userRoutes.get("/get-user-by-email", getUserDetailsByEmailController);
userRoutes.patch("/update-user-details", AuthMiddleware, updateUserDetailsController);

// ================= WALLET =================
userRoutes.post("/deposit-money", AuthMiddleware, depositMoneyToUserWalletController);

// ================= STATS =================
userRoutes.get("/get-day-wise-wallet-stats", AuthMiddleware, getDayWiseWalletStatsController);

export default userRoutes;