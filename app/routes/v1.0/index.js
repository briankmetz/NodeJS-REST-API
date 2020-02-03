//mounts all routes for v1.0 API
const express = require('express');
const authRoutes = require('./auth');
const conferenceRoutes = require('./conference');
const imageRoutes = require('./image');
const meetingRoutes = require('./meeting');
const messageRoutes = require('./message');
const searchRoutes = require('./search');
const settingsRoutes = require('./settings');
const threadRoutes = require('./thread');
const userRoutes = require('./user');

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/hello', (req, res) =>
	res.send('Hi!')
)

router.use('/auth', authRoutes);
router.use('/conference', conferenceRoutes);
router.use('/image', imageRoutes);
router.use('/meeting', meetingRoutes);
router.use('/message', messageRoutes);
router.use('/search', searchRoutes);
router.use('/settings', settingsRoutes);
router.use('/thread', threadRoutes);
router.use('/user', userRoutes);

module.exports = router;
