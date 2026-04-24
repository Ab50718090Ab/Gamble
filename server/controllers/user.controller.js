import { comparePasswords, hashPassword } from "../utils/passwordHash.js";
import userModel from "../models/user.model.js";
import transporter from "../config/nodemailer.js";
import generateVerificationToken from "../utils/generateVerificationToken.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateJwtTokens.js";
import jwt from "jsonwebtoken";
import { generateOTP } from "../utils/generateOTP.js";
import verifyEmail from "../email/verifyEmail.js";
import resetPassOTPEmail from "../email/resetPasswordOTPEmail.js";
import { accessCookieOptions, refreshCookieOptions } from "../utils/cookieOptions.js";
import transactionModel from "../models/transaction.model.js";
import mongoose from "mongoose";
import betModel from "../models/bet.model.js";

// =========================
// ENV KEYS (FIXED)
// =========================
const ACCESS_KEY = process.env.SECRET_KEY_ACCESS_TOKEN;
const REFRESH_KEY = process.env.SECRET_KEY_REFRESH_TOKEN;

// =========================
// REGISTER
// =========================
export const registerController = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists."
            });
        }

        const hashedPassword = await hashPassword(password);
        const verificationToken = generateVerificationToken();

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            provider: "local",
            isVerified: false,
            verificationToken,
            verificationTokenExpiration: Date.now() + 3600000
        });

        const savedUser = await newUser.save();

        const verifyLink = `${process.env.CLIENT_URL}/verify-user?token=${verificationToken}`;

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Verify your email - Auth Template",
            html: verifyEmail(name, verifyLink)
        });

        const accessToken = generateAccessToken(savedUser);
        const refreshToken = generateRefreshToken(savedUser);

        res.cookie("accessToken", accessToken, accessCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshCookieOptions);

        return res.status(201).json({
            message: "User registered. Please check your email.",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =========================
// VERIFY USER
// =========================
export const verifyUserController = async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Verification token is missing."
        });
    }

    try {
        const user = await userModel.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid token."
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Already verified."
            });
        }

        if (user.verificationTokenExpiration < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Token expired."
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiration = undefined;
        await user.save();

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("accessToken", accessToken, accessCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshCookieOptions);

        return res.status(200).json({
            success: true,
            message: "Account verified successfully."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =========================
// LOGIN
// =========================
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields required."
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            });
        }

        const isMatch = await comparePasswords(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("accessToken", accessToken, accessCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshCookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: { user }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =========================
// LOGOUT
// =========================
export const logoutController = async (req, res) => {
    try {
        res.clearCookie("accessToken", accessCookieOptions);
        res.clearCookie("refreshToken", refreshCookieOptions);

        return res.status(200).json({
            success: true,
            message: "Logged out"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =========================
// REFRESH TOKEN (FIXED - MAIN BUG FIX)
// =========================
export const refreshTokenController = async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json({
            success: false,
            message: "Refresh token missing"
        });
    }

    try {
        const decoded = jwt.verify(incomingRefreshToken, REFRESH_KEY);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        const newAccessToken = jwt.sign(
            { id: user._id, email: user.email },
            ACCESS_KEY,
            { expiresIn: "15m" }
        );

        res.cookie("accessToken", newAccessToken, accessCookieOptions);

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid refresh token",
            error: error.message
        });
    }
};

// =========================
// IS AUTH
// =========================
export const isAuthenticated = async (req, res) => {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(401).json({
            success: false,
            message: "No tokens"
        });
    }

    try {
        if (accessToken) {
            const decoded = jwt.verify(accessToken, ACCESS_KEY);
            return res.status(200).json({
                success: true,
                data: decoded
            });
        }
    } catch {}

    try {
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, REFRESH_KEY);

            const newAccessToken = generateAccessToken(decoded);

            res.cookie("accessToken", newAccessToken, accessCookieOptions);

            return res.status(200).json({
                success: true,
                data: decoded,
                refreshed: true
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid tokens"
        });
    }
};