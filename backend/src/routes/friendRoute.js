import express from 'express';

import {
    acceptFriendRequest,
    sendFriendRequest,
    declineFriendRequest,
    getAllFriends,
    getFriendRequests,
} from '../controllers/friendController.js';

const router = express.Router();

/**
 * @swagger
 * /friends/requests:
 *   post:
 *     summary: Send a friend request
 *     tags: [Friends]
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
 *         description: Friend request sent
 *       401:
 *         description: Unauthorized
 */
router.post('/requests', sendFriendRequest);

/**
 * @swagger
 * /friends/requests/{requestId}/accept:
 *   post:
 *     summary: Accept a friend request
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: Friend request ID
 *     responses:
 *       200:
 *         description: Friend request accepted
 *       401:
 *         description: Unauthorized
 */
router.post('/requests/:requestId/accept', acceptFriendRequest);

/**
 * @swagger
 * /friends/requests/{requestId}/decline:
 *   post:
 *     summary: Decline a friend request
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: Friend request ID
 *     responses:
 *       200:
 *         description: Friend request declined
 *       401:
 *         description: Unauthorized
 */
router.post('/requests/:requestId/decline', declineFriendRequest);

/**
 * @swagger
 * /friends:
 *   get:
 *     summary: Get all friends
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of friends
 *       401:
 *         description: Unauthorized
 */
router.get('/', getAllFriends);

/**
 * @swagger
 * /friends/requests:
 *   get:
 *     summary: Get all friend requests
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of friend requests
 *       401:
 *         description: Unauthorized
 */
router.get('/requests', getFriendRequests);

export default router;
