const express = require('express');
const router = express.Router();
const verifyPermissions = require('../middleware/verifyPermissions');
const { getUserReservations, deleteReservation } = require('../controllers/personalTableOrderController');

router.use(express.json());

router.get('/:userId', verifyPermissions([3]), async (req, res) => {
    const { userId } = req.params;
    try {
        res.send(await getUserReservations(userId));
    } catch (err) {
        console.error('Error fetching table orders:', err);
        res.status(500).send(err.message);
    }
});

router.delete('/:reservationId', verifyPermissions([3]), async (req, res) => {
    const { reservationId } = req.params;
    try {
        await deleteReservation(reservationId);
        res.sendStatus(200);
    } catch (err) {
        console.error('Error deleting reservation:', err);
        res.status(500).send(err.message);
    }
});

module.exports = router;