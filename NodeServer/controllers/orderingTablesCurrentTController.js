const model = require('../models/orderingTablesCurrentTModel');

async function getAvailableTablesForCurrentTime() {
    try {
        const availableTables = await model.getAvailableTablesForCurrentTime();
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

module.exports = { getSingle, getAvailableTablesForCurrentTime };
