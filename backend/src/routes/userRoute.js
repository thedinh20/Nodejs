import express from 'express';
import { authMe, searchUsers } from '../controllers/userController.js';

const router = express.Router();

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user info
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authMe);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users by username prefix
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Username prefix to search for
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       displayName:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/search", searchUsers);

export default router;