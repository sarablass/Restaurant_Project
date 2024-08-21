const express = require('express');
const router = express.Router();
const verifyPermissions = require('../middleware/verifyPermissions');
const { getOrderingFoodLast, create, getSingle, deleteOrder, updateOrder } = require('../controllers/orderingFoodController');

router.use(express.json());

router.get('/:idOrderingTable', verifyPermissions([2]), async (req, res) => {
    const { idOrderingTable } = req.params;
    try {
        const orderingFood = await getOrderingFoodLast(idOrderingTable);
        console.log('Fetched last order:', orderingFood);
        res.json(orderingFood);
    } catch (err) {
        console.error('Error fetching ordering food:', err);
        res.status(500).send(err.message);
    }
});

router.post('/', verifyPermissions([2, 3]), async (req, res) => {
    const response = await create(req.body.userId, req.body.idOrderingTable, req.body.orderDate, req.body.orderTime, req.body.payment, req.body.statusOrder);
    res.status(201).send(await getSingle(response));
});

router.delete('/:orderId', verifyPermissions([2, 3]), async (req, res) => {
    const { orderId } = req.params;
    try {
        await deleteOrder(orderId);
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).send('Failed to delete order');
    }
});

router.put('/:orderId', verifyPermissions([2, 3]), async (req, res) => {
    const { orderId } = req.params;
    const { orderDate, orderTime, payment, statusOrder } = req.body;
    try {
        await updateOrder(orderId, orderDate, orderTime, payment, statusOrder);
        res.status(200).send('Order updated successfully');
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).send('Failed to update order');
    }
});

module.exports = router;
