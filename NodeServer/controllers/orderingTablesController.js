const model = require('../models/orderingTablesModel');

async function getAvailableTables(date, time, numSeats) {
    try {
        const availableTables = await model.getAvailableTables(date, time, numSeats);
        return availableTables;
    } catch (err) {
        throw err;
    }
}

async function getSingle(id) {
    try {
        return await model.getOrderingTable(id);
    } catch (err) {
        throw err;
    }
}

async function create(numTable, userId, orderDate, orderTime, numSeats) {
    try {
        return await model.createOrderingTable(numTable, userId, orderDate, orderTime, numSeats);
    } catch (err) {
        throw err;
    }
}

async function updateOrderingTables(orderingTablesId, statusTable) {
    try {
        await model.updateOrderingTables(orderingTablesId, statusTable);
    } catch (err) {
        throw err;
    }
}

module.exports = { getSingle, getAvailableTables, create, updateOrderingTables };