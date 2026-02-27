const express = require('express');
const router = express.Router();   

router.get('/hemytask/HA', async function (req, res, next) {
    const selectedHA = await getUserProfile(authToken);
    res.json({ selectedHA });
});

module.exports = router;