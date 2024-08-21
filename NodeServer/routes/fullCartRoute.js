const express = require('express');
const router = express.Router();
const verifyPermissions = require('../middleware/verifyPermissions');
const { getLastOpenOrderForUser} = require('../controllers/fullCartController'); // עדכן את שם הקובץ כאן
router.use(express.json());

router.get('/user/:userId/last-open', verifyPermissions([3]), async (req, res) => {
    const { userId } = req.params;
    try {
        const lastOpenOrder = await getLastOpenOrderForUser(userId);
        res.json(lastOpenOrder);
    } catch (err) {
        console.error('Error fetching last open order:', err);
        res.status(500).send(err.message);
    }
});

module.exports = router;