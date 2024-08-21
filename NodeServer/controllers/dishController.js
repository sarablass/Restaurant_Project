const model = require('../models/dishModel');


async function getSingle(id) {
    try {
        return await model.getDish(id);
    } catch (err) {
        throw err;
    }
}

async function createDish(dishName, dishTypeName, price, remarks, vegan, gluten, imageUrl) {
    try {
        const idDishTypes = await model.getDishTypeIdByName(dishTypeName);
        return await model.createDish(dishName, idDishTypes, price, remarks, vegan, gluten, imageUrl);
    } catch (err) {
        throw err;
    }
}

async function deleteDish(dishId) {
    try {
        await model.deleteDish(dishId);
    } catch (err) {
        throw err;
    }
}

async function updateDish(dishId, dishName, remarks, price) {
    try {
        await model.updateDish(dishId, dishName, remarks, price);
    } catch (err) {
        throw err;
    }
}

module.exports = { createDish, deleteDish, updateDish, getSingle };