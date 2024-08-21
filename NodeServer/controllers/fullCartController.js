const model = require('../models/fullCartModel');

async function getLastOpenOrderForUser(userId) {
    try {
        const lastOpenOrder = await model.getLastOpenOrderForUser(userId);
        if (lastOpenOrder) {
            const orderItems = await model.getOrderItems(lastOpenOrder.id);
            return { ...lastOpenOrder, items: orderItems };
        }
        return null;
    } catch (err) {
        console.error('Error in getLastOpenOrderForUser:', err);
        throw err;
    }
}

module.exports = {
    getLastOpenOrderForUser
};