const model = require('../models/personalFoodOrdersModel');

async function getUserFoodOrders(userId) {
    try {
        return await model.getAllFoodOrders(userId);;
    } catch (err) {
        throw err;
    }
}


async function deleteUserFoodOrder(orderId) {
    try {
        return await model.deleteFoodOrder(orderId);
    } catch (err) {
        throw err;
    }
}

module.exports = { getUserFoodOrders, deleteUserFoodOrder };