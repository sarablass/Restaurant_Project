const pool = require('../DB');

async function getActiveOrders() {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM orderingFood
            WHERE statusOrder != '0'
            ORDER BY orderDate DESC, orderTime DESC
        `);
        return rows;
    } catch (err) {
        console.error('Error fetching active orders:', err);
        throw err;
    }
}

async function updateOrderStatus(orderId, statusOrder) {
    try {
        const [result] = await pool.query(`
            UPDATE orderingFood
            SET statusOrder = ?
            WHERE id = ?
        `, [statusOrder, orderId]);
        return result;
    } catch (err) {
        console.error('Error updating order status:', err);
        throw err;
    }
}

async function getOrderDishes(orderId) {
    try {
        const [rows] = await pool.query(`
            SELECT d.dishName, d.price, d.remarks, d.vegan, d.gluten, d.imageUrl, do.amount
            FROM dishesOrdered do
            JOIN dishes d ON do.idDish = d.id
            WHERE do.idOrderingFood = ?
        `, [orderId]);
        return rows;
    } catch (err) {
        console.error('Error fetching order dishes:', err);
        throw err;
    }
}

module.exports = { getActiveOrders, updateOrderStatus, getOrderDishes };
