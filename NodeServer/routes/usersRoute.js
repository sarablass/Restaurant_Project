const express = require('express');
const router = express.Router();
const verifyPermissions = require('../middleware/verifyPermissions');
const { getWaiters } = require('../controllers/usersController');

router.use(express.json());

router.get('/', verifyPermissions([1]), async (req, res) => {
    try {
        const waiters = await getWaiters();
        res.json(waiters);
    } catch (err) {
        console.error('Error fetching waiters:', err);
        res.status(500).send(err.message);
    }
});

module.exports = router;
