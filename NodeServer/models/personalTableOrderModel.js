const pool = require('../DB');

async function getAllTableOrders(userId) {
    try {
        const query = `
            SELECT 
                ot.id AS orderId,
                ot.orderDate,
                ot.orderTime,
                rt.inside AS tableInside,
                ot.numSeats AS orderNumSeats,
                EXISTS(SELECT 1 FROM orderingFood WHERE idOrderingTable = ot.id) AS hasFoodOrders
            FROM orderingTables ot
            JOIN restaurantTables rt ON ot.numTable = rt.id
            WHERE ot.userId = ?
        `;
        const [rows] = await pool.query(query, [userId]);
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getOrderDetails(orderId) {
    try {
        const query = `
            SELECT 
                ot.orderDate,
                ot.orderTime,
                d.dishName,
                d.price,
                d.imageUrl,
                do.amount,
                f.payment AS totalPayment
            FROM orderingFood f
            JOIN orderingTables ot ON f.idOrderingTable = ot.id
            JOIN dishesOrdered do ON f.id = do.idOrderingFood
            JOIN dishes d ON do.idDish = d.id
            WHERE ot.id = ?
        `;
        const [rows] = await pool.query(query, [orderId]);
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


async function deleteReservation(reservationId) {
    try {
        await pool.query('START TRANSACTION');

        // Delete related food orders
        await pool.query('DELETE FROM dishesOrdered WHERE idOrderingFood IN (SELECT id FROM orderingFood WHERE idOrderingTable = ?)', [reservationId]);
        await pool.query('DELETE FROM orderingFood WHERE idOrderingTable = ?', [reservationId]);

        // Delete the table reservation
        await pool.query('DELETE FROM orderingTables WHERE id = ?', [reservationId]);

        await pool.query('COMMIT');
    } catch (err) {
        await pool.query('ROLLBACK');
        console.log(err);
        throw err;
    }
}


module.exports = { getAllTableOrders, getOrderDetails, deleteReservation };