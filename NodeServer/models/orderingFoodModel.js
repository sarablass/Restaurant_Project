const pool = require('../DB');

async function getOrderingFood(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM orderingFood WHERE id=?', [id]);
        return rows[0] || null; // Graceful handling of null response
    } catch (err) {
        console.log(err);
        throw err; // Rethrow the error for consistent error handling
    }
}
// async function getLastOrderingFood(numTable) {
//     try {
//         const [rows] = await pool.query(`
//             SELECT ofd.id, ofd.userId, ofd.idOrderingTable, ofd.payment, ofd.statusOrder,ofd.payUp
//             FROM orderingFood ofd
//             JOIN orderingTables ot ON ofd.idOrderingTable = ot.id
//             WHERE ot.numTable = ?
//               AND ot.orderDate = CURDATE()
//               AND ot.orderTime >= DATE_SUB(CURTIME(), INTERVAL 1 HOUR)
//               AND ot.orderTime <= CURTIME()
//               AND ofd.payUp != 1
//             ORDER BY ofd.id DESC
//             LIMIT 1
//         `, [numTable]);
//         console.log(numTable)
//         return rows.length > 0 ? rows[0] : null;
//     } catch (error) {
//         console.error('Error executing SQL query:', error);
//         throw error;
//     }
// }
async function getLastOrderingFood(numTable) {
    try {
        // Get current date
        const currentDate = new Date();
        
        // Format current date as YYYY-MM-DD
        const formattedDate = currentDate.toISOString().split('T')[0];

        const [rows] = await pool.query(`
            SELECT ofd.id, ofd.userId, ofd.idOrderingTable, ofd.payment, ofd.statusOrder, ofd.payUp
            FROM orderingFood ofd
            JOIN orderingTables ot ON ofd.idOrderingTable = ot.id
            WHERE ot.numTable = ?
              AND ot.orderDate = ?
              AND ofd.payUp != 1
            ORDER BY ofd.id DESC
            LIMIT 1
        `, [numTable, formattedDate]);

        console.log(numTable);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error executing SQL query:', error);
        throw error;
    }
}


async function createOrderingFood(userId, idOrderingTable, date, time, payment, statusOrder) {
    const payup = false;
    try {
        const [result] = await pool.query(
            "INSERT INTO orderingFood (userId, idOrderingTable,orderDate, orderTime, payment, statusOrder , payUp) VALUES (?, ?, ?, ?,? ,? ,?)",
            [userId, idOrderingTable, date, time, payment, statusOrder, payup]
        );
        return result.insertId;
    } catch (err) {
        console.error('Error creating ordering food:', err);
        throw err;
    }
}

async function deleteOrderByOrderId(orderId) {
    try {
        const [result1] = await pool.query(
            "DELETE FROM dishesOrdered WHERE idOrderingFood = ?", [orderId]
        );
        const [result2] = await pool.query(
            "DELETE FROM orderingFood WHERE id = ?", [orderId]
        );
        if (result1.affectedRows === 0 || result2.affectedRows === 0) {
            throw new Error('No rows affected');
        }
    } catch (err) {
        console.error('Error deleting order:', err);
        throw err;
    }
}

async function updateOrder(orderId,date, time, payment, statusOrder) {
    try {
        await pool.query("UPDATE orderingFood SET orderDate = ?, orderTime = ?, payment = ?, statusOrder = ? WHERE id = ?", [date, time, payment, statusOrder, orderId]);
    } catch (err) {
        console.error('Error updating order:', err);
        throw err;
    }
}

async function getOrderingTableByNumTable(numTable) {
    try {
        const query = `
            SELECT MAX(id) AS lastId
            FROM orderingTables
            WHERE numTable = ?
        `;
        const [rows] = await pool.query(query, [numTable]);
        return rows[0]?.lastId || null; // Graceful handling of null response
    } catch (err) {
        console.error('Error executing SQL query:', err);
        throw err;
    }
}


async function updatePayUpOrder(orderId) {
    try {
        await pool.query("UPDATE orderingFood SET payUp = ? WHERE id = ?", [1 , orderId]);
    } catch (err) {
        console.error('Error updating order:', err);
        throw err;
    }
}

module.exports = {
    getOrderingTableByNumTable,
    createOrderingFood,
    getLastOrderingFood,
    getOrderingFood,
    deleteOrderByOrderId,
    updateOrder,
    updatePayUpOrder
};
