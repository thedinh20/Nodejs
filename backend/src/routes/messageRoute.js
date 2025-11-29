import express from 'express';

import {
    sendDirectMessage,
    sendGroupMessage,
} from '../controllers/messageController.js'
import { 
    checkFriendship, 
    checkGroupMembership 
} from '../middlewares/friendMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /messages/direct:
 *   post:
 *     summary: Send a direct message
 *     tags: [Messages]
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
 *         description: Direct message sent
 *       401:
 *         description: Unauthorized
 */
router.post('/direct', checkFriendship, sendDirectMessage);

/**
 * @swagger
 * /messages/group:
 *   post:
 *     summary: Send a group message
 *     tags: [Messages]
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
 *         description: Group message sent
 *       401:
 *         description: Unauthorized
 */
router.post('/group',  checkGroupMembership, sendGroupMessage);

export default router;