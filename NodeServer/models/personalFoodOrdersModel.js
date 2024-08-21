const pool = require('../DB');

async function getAllFoodOrders(userId) {
    try {
        const query = `
            SELECT o.id as orderId, o.orderDate, o.orderTime, o.payment,
                   JSON_ARRAYAGG(
                       JSON_OBJECT(
                           'dishId', d.id,
                           'dishName', d.dishName,
                           'price', d.price,
                           'amount', do.amount,
                           'imageUrl', d.imageUrl
                       )
                   ) as dishes
            FROM orderingFood o
            JOIN dishesOrdered do ON o.id = do.idOrderingFood
            JOIN dishes d ON do.idDish = d.id
            WHERE o.userId = ? AND o.idOrderingTable IS NULL
            GROUP BY o.id
            ORDER BY o.orderDate DESC, o.orderTime DESC
        `;
        const [rows] = await pool.query(query, [userId]);
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function deleteFoodOrder(orderId) {
    try {
        const query = `
            DELETE FROM orderingFood WHERE id = ?;
        `;
        await pool.query(query, [orderId]);
        return { success: true };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getAllFoodOrders, deleteFoodOrder };