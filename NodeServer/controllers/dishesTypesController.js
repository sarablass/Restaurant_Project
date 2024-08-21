const model = require('../models/dishesTypesModel');

async function getSingle(id) {
    try {
        return await model.getSingleDishesType(id);
    } catch (err) {
        throw err;
    }
}

async function getAll() {
    try {
        return await model.getAllDishesTypes();
    } catch (err) {
        throw err;
    }
}

async function create(title) {
    try {
        return await model.createDishesType(title);
    } catch (err) {
        throw err;
    }
}


async function updateDishType(id, title) {
  try {
    await model.updateDishType(id, title);
  } catch (err) {
    throw err;
  }
}

module.exports = { getSingle, create, getAll, updateDishType };