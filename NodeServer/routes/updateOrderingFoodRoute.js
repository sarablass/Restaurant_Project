// orderingFoodRoute.js

const express = require('express');
const router = express.Router();
const { updatePayUpOrder } = require('../controllers/orderingFoodController');

router.use(express.json());

router.put('/:orderId', async (req, res) => {
    const { orderId } = req.params;
    try {
        await updatePayUpOrder(orderId);
        res.status(200).send('Order updated successfully');
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).send('Failed to update order');
    }
});

module.exports = router;
