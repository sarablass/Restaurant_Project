const express = require('express');
const router = express.Router();
const verifyPermissions = require('../middleware/verifyPermissions');
const { getUserFoodOrders } = require('../controllers/personalFoodOrdersController');

router.use(express.json());

router.get('/:userId', verifyPermissions([3]), async (req, res) => {
    const { userId } = req.params;
    try {
        res.send(await getUserFoodOrders(userId))
    } catch (err) {
        console.error('Error fetching food orders:', err);
        res.status(500).send(err.message);
    }
})

router.delete('/:orderId', verifyPermissions([3]), async (req, res) => {
    const { orderId } = req.params;
    try {
      const result = await deleteUserFoodOrder(orderId);
      res.json(result);
    } catch (err) {
      console.error('Error deleting order:', err);
      res.status(500).send(err.message);
    }
  });
  
module.exports = router;