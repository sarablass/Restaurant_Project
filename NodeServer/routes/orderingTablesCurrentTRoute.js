const express = require('express');
const router = express.Router();
const verifyPermissions = require('../middleware/verifyPermissions');
const { getAvailableTablesForCurrentTime } = require('../controllers/orderingTablesCurrentTController'); 

router.use(express.json());

router.get('/availableCurrent', verifyPermissions([2]), async (req, res) => {
    try {
        const availableTables = await getAvailableTablesForCurrentTime();
        res.json(availableTables);
    } catch (err) {
        console.error('Error fetching available tables for current time:', err);
        res.status(500).send(err.message);
    }
});

module.exports = router;