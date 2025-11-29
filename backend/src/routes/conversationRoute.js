import express from 'express';
import {
    createConversation,
    getConversations, 
    getMessages
} from '../controllers/conversationController.js';
import {checkFriendship} from '../middlewares/friendMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /conversations:
 *   post:
 *     summary: Create a new conversation
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Conversation created
 *       401:
 *         description: Unauthorized
 */
router.post('/', checkFriendship, createConversation);

/**
 * @swagger
 * /conversations:
 *   get:
 *     summary: Get all conversations for the current user
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
 *       401:
 *         description: Unauthorized
 */
router.get('/', getConversations);

/**
 * @swagger
 * /conversations/{conversationId}/messages:
 *   get:
 *     summary: Get messages for a conversation
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: List of messages
 *       401:
 *         description: Unauthorized
 */
router.get('/:conversationId/messages', getMessages);

export default router;