const express = require('express');
const v1_0Routes = require('./v1.0/index');

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/hello', (req, res) =>
	res.send('Hi!')
)

router.use('/v1.0', v1_0Routes);

module.exports = router;
