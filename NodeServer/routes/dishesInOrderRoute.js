const express = require('express');
const router = express.Router();
const { getOrderDishes } = require('../controllers/chefController');
const verifyPermissions = require('../middleware/verifyPermissions');
router.use(express.json());


router.get('/:orderId/dishes', verifyPermissions([4]), async (req, res) => {
    const { orderId } = req.params;
    try {
        res.send(await getOrderDishes(orderId));
    } catch (error) {
        res.status(500).send('Error fetching order dishes');
    }
});

module.exports = router;
