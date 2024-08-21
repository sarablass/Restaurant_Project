const model = require('../models/personalTableOrderModel');

async function getUserReservations(userId) {
    try {
        return await model.getAllTableOrders(userId);
    } catch (err) {
        throw err;
    }
}

async function getOrderDetails(orderId) {
    try {
        return await model.getOrderDetails(orderId);
    } catch (err) {
        throw err;
    }
}

async function deleteReservation(reservationId) {
    try {
        await model.deleteReservation(reservationId);
    } catch (err) {
        throw err;
    }
}

module.exports = { getUserReservations, getOrderDetails, deleteReservation };