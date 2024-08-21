const express = require('express');
const router = express.Router();
const verifyPermissions = require('../middleware/verifyPermissions');

const { create, getSingle, deleteByOrderAndDish, updateQuantity } = require('../controllers/dishesOrderedController'); 

router.use(express.json());

router.post('/', verifyPermissions([2 ,3]) , async (req, res) => {
    const response = await create(req.body.idOrderingFood, req.body.idDish, req.body.amount);
    res.status(201).send(await getSingle(response));
});



router.delete('/:orderId/:dishId', verifyPermissions([2 ,3]) , async (req, res) => { //דואג למחיקת מנה מהזמנה
    const { orderId, dishId } = req.params;
    try {
        await deleteByOrderAndDish(orderId, dishId);
        res.sendStatus(204); // או כל תשובת הצלחה אחרת
    } catch (error) {
        console.error('Error deleting dish from order:', error);
        res.status(500).send('Failed to delete dish from order');
    }
});

router.put('/:orderId/:dishId', verifyPermissions([2 ,3]) , async (req, res) => {
    const { orderId, dishId } = req.params;
    const { amount } = req.body;

    try {
        await updateQuantity(orderId, dishId, amount);
        res.sendStatus(200); 
    } catch (error) {
        console.error('Error updating dish quantity:', error);
        res.status(500).send('Failed to update dish quantity');
    }
});

module.exports = router;