const model = require('../models/dishesOrderedModel');

async function getSingle(id) {
    try {
        return await model.getDishesOrdered(id);
    } catch (err) {
        throw err;
    }
}

async function create(idOrderingFood, idDish, amount) {
    try {
        return await model.createDishesOrdered(idOrderingFood, idDish, amount);
    } catch (err) {
        throw err;
    }
}


async function deleteByOrderAndDish(orderId, dishId) {
    try {
        await model.deleteDishesOrderByOrderAndDish(orderId, dishId);
    } catch (err) {
        throw err;
    }
}

async function updateQuantity(orderId, dishId, newQuantity) {
    try {
        await model.updateDishQuantity(orderId, dishId, newQuantity);
    } catch (err) {
        throw err;
    }
}

module.exports = { getSingle, create, deleteByOrderAndDish, updateQuantity };
