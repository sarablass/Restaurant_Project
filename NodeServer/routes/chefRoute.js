const express = require('express');
const router = express.Router();
const { getActiveOrders, updateOrderStatus, getOrderDishes } = require('../controllers/chefController');
const verifyPermissions = require('../middleware/verifyPermissions');
router.use(express.json());

router.get('/active', verifyPermissions([4]), async (req, res) => {
    try {
        res.send(await getActiveOrders());
    } catch (error) {
        res.status(500).send('Error fetching active orders');
    }
});

router.put('/:orderId', verifyPermissions([4]), async (req, res) => {
    const { orderId } = req.params;
    const { statusOrder } = req.body;
    try {
        await updateOrderStatus(orderId, statusOrder);
        res.status(200).send('Order status updated successfully');
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).send('Failed to update order status');
    }
});



module.exports = router;
