const pool = require('../DB');

async function getDishesOrdered(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM dishesOrdered where id=?', [id]);
        return rows[0];
    } catch (err) {
        console.log(err);
    }
}

async function createDishesOrdered(idOrderingFood, idDish, amount) {
    try {
        const [result] = await pool.query(
            "INSERT INTO dishesOrdered (idOrderingFood, idDish, amount) VALUES(?, ?, ?)", [idOrderingFood, idDish, amount]
        );
        return result.insertId;
    } catch (err) {
        console.error('Error creating dishes order:', err);
        throw err;
    }
}

async function deleteDishesOrderByOrderAndDish(orderId, dishId) {
    try {
        const [result] = await pool.query(
            "DELETE FROM dishesOrdered WHERE idOrderingFood = ? AND idDish = ?", [orderId, dishId]
        );
        console.log('Delete result:', result); // בדיקת תוצאת המחיקה
        if (result.affectedRows === 0) {
            throw new Error('No rows affected');
        }
    } catch (err) {
        console.error('Error deleting dish order:', err);
        throw err;
    }
}

async function updateDishQuantity(orderId, dishId, newQuantity) {
    try {
        const [result] = await pool.query(
            "UPDATE dishesOrdered SET amount = ? WHERE idOrderingFood = ? AND idDish = ?", [newQuantity, orderId, dishId]
        );
        console.log('Update result:', result); // בדיקת תוצאת העדכון
        if (result.affectedRows === 0) {
            throw new Error('No rows affected');
        }
    } catch (err) {
        console.error('Error updating dish quantity:', err);
        throw err;
    }
}

module.exports = { createDishesOrdered, getDishesOrdered, deleteDishesOrderByOrderAndDish, updateDishQuantity };
