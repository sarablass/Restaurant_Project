const model = require('../models/orderingFoodModel');

async function getSingle(id) {
    try {
        return await model.getOrderingFood(id);
    } catch (err) {
        throw err;
    }
}

async function getOrderingFoodLast(numTable) {
    try {
        return await model.getLastOrderingFood(numTable);
    } catch (err) {
        console.error('Error in getOrderingFoodLast:', err);
        throw err;
    }
}

async function create(userId, idOrderingTable, date, time, payment, statusOrder) {
    try {
        // const idOrderingTable = await model.getOrderingTableByNumTable(numTable);
        // if (!idOrderingTable) {
        //     throw new Error('No valid ordering table found');
        // }
        return await model.createOrderingFood(userId, idOrderingTable, date, time, payment, statusOrder);
    } catch (err) {
        throw err;
    }
}

async function deleteOrder(orderId) {
    try {
        await model.deleteOrderByOrderId(orderId);
    } catch (err) {
        throw err;
    }
}

async function updateOrder(orderId, date, time, payment, statusOrder) {
    try {
        await model.updateOrder(orderId, date, time, payment, statusOrder);
    } catch (err) {
        throw err;
    }
}


async function updatePayUpOrder(orderId) {
    try {
        await model.updatePayUpOrder(orderId);
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getOrderingFoodLast,
    create,
    getSingle,
    deleteOrder,
    updateOrder,
    updatePayUpOrder
};
