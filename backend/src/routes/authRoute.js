import express from "express";
import {
  refreshToken,
  signIn,
  signOut,
  signUp,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               displayName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Invalid input
 */
router.post("/signup", signUp);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Signed in
 *       401:
 *         description: Unauthorized
 */
router.post("/signin", signIn);

/**
 * @swagger
 * /auth/signout:
 *   post:
 *     summary: Sign out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Signed out
 */
router.post("/signout", signOut);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh authentication token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed
 *       401:
 *         description: Unauthorized
 */
router.post("/refresh", refreshToken);

export default router;