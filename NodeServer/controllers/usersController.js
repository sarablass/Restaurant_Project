const model = require('../models/usersModel');

async function getWaiters() {
    try {
        const waiters = await model.getWaiters();
        return waiters;
    } catch (err) {
        throw err;
    }
}

module.exports = { getWaiters };
