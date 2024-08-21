const pool = require('../DB');

async function getAvailableTables(date, time, numSeats) {
    try {
        const query = `
            SELECT t.id, t.numSeats, t.inside
            FROM restaurantTables t
            WHERE t.numSeats >= ?
            AND t.numSeats <= ? + 3
            AND t.id NOT IN (
                SELECT ot.numTable
                FROM orderingTables ot
                WHERE ot.orderDate = ?
                AND (
                    (ot.orderTime <= ? AND ADDTIME(ot.orderTime, '2:00:00') > ?)
                    OR (ot.orderTime >= ? AND ot.orderTime < ADDTIME(?, '2:00:00'))
                )
                AND ot.statusTable != 1
            )
            ORDER BY t.numSeats;
        `;
        const [rows] = await pool.query(query, [numSeats, numSeats, date, time, time, time, time]);
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getOrderingTable(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM orderingTables where id=?', [id]);
        return rows[0];
    } catch (err) {
        console.log(err);
    }
}

async function createOrderingTable(numTable, userId, orderDate, orderTime, numSeats) {
    const statusTableT = '0';
    try {
        const [result] = await pool.query(
            "INSERT INTO orderingTables (numTable, userId, orderDate, orderTime, numSeats, statusTable) VALUES(?, ?, ?, ?, ?, ?)",
            [numTable, userId, orderDate, orderTime, numSeats, statusTableT]
        );
        return result.insertId;
    } catch (err) {
        console.error('Error creating ordering Table:', err);
        throw err;
    }
}

async function updateOrderingTables(orderingTablesId, statusTable) {
    try {
        await pool.query(
            "UPDATE orderingTables SET statusTable = ? WHERE id = ?",
            [statusTable, orderingTablesId]
        );
    } catch (err) {
        console.error('Error updating ordering Tables:', err);
        throw err;
    }
}

module.exports = { getAvailableTables, createOrderingTable, getOrderingTable, updateOrderingTables };