const pool = require('../DB');

async function getLastOpenOrderForUser(userId) {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM orderingFood
            WHERE userId = ? AND statusOrder = 0
            ORDER BY id DESC
            LIMIT 1
        `, [userId]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        throw error;
    }
}

async function getOrderItems(orderId) {
    try {
        const [rows] = await pool.query(`
            SELECT d.id, d.dishName, d.price, do.amount
            FROM dishesOrdered do
            JOIN dishes d ON do.idDish = d.id
            WHERE do.idOrderingFood = ?
        `, [orderId]);
        return rows;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        throw error;
    }
}

module.exports = {
    // ... existing exports
    getLastOpenOrderForUser,
    getOrderItems
};