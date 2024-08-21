const express = require('express');
const router = express.Router();
const verifyPermissions = require('../middleware/verifyPermissions');
const { getAvailableTables, create, getSingle, updateOrderingTables } = require('../controllers/orderingTablesController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(express.json());

router.get('/available', async (req, res) => {
    const { date, time, numSeats } = req.query;
    console.log(`Checking availability for date: ${date}, time: ${time}, numSeats: ${numSeats}`);
    try {
        const availableTables = await getAvailableTables(date, time, numSeats);
        console.log('Available tables:', availableTables);
        res.json(availableTables);
    } catch (err) {
        console.error('Error fetching available tables:', err);
        res.status(500).send(err.message);
    }
});

router.post('/', verifyJWT, verifyPermissions([2,3]), async (req, res) => {
    try {
        const response = await create(req.body.numTable, req.body.userId, req.body.orderDate, req.body.orderTime, req.body.numSeats);
        res.status(201).send(await getSingle(response));
    } catch (error) {
        res.status(500).send({ error: 'Failed to create ordering table' });
    }
});

router.put('/:orderingTablesId', verifyJWT, verifyPermissions([2]), async (req, res) => {
    const { orderingTablesId } = req.params;
    const { statusTable } = req.body;
    try {
        await updateOrderingTables(orderingTablesId, statusTable);
        res.status(200).send('Ordering Tables updated successfully');
    } catch (error) {
        console.error('Error updating Ordering Tables:', error);
        res.status(500).send('Failed to update Ordering Tables');
    }
});

module.exports = router;