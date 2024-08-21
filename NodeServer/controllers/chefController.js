const model = require('../models/chefModel');

async function getActiveOrders() {
    try {
        return await model.getActiveOrders();
    } catch (err) {
        throw err;
    }
}

async function updateOrderStatus(orderId, statusOrder) {
    try {
        await model.updateOrderStatus(orderId, statusOrder);
    } catch (err) {
        throw err;
    }
}

async function getOrderDishes(orderId) {
    try {
        return await model.getOrderDishes(orderId);
    } catch (err) {
        throw err;
    }
}

module.exports = { getActiveOrders, updateOrderStatus, getOrderDishes };
