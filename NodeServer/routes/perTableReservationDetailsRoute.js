const express = require('express');
const router = express.Router();
const verifyPermissions = require('../middleware/verifyPermissions');
const { getOrderDetails } = require('../controllers/personalTableOrderController');

router.get('/:orderId', verifyPermissions([3]), async (req, res) => {
    const { orderId } = req.params;
    console.log('Received request for orderId:', orderId);
    try {
        const orderDetails = await getOrderDetails(orderId);
        res.json(orderDetails); 
    } catch (err) {
        console.error('Error fetching order details:', err);
        res.status(500).send(err.message);
    }
});

module.exports = router;