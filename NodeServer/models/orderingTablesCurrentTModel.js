const pool = require('../DB');

// async function getAvailableTablesForCurrentTime() {
//     const currentDate = new Date();
//     const date = currentDate.toISOString().split('T')[0];
    
//     // Adding 2 minutes to the current time and formatting it
//     const currentTimePlusTwoMinutes = new Date(currentDate.getTime() + 2 * 60000);
//     const time = currentTimePlusTwoMinutes.toTimeString().split(' ')[0].slice(0, 5);

//     try {
//         const query = `
//             SELECT t.id, t.numSeats, t.inside,
//                    (SELECT MIN(ot.orderTime)
//                     FROM orderingTables ot 
//                     WHERE ot.numTable = t.id 
//                     AND ot.orderDate = ?
//                     AND ot.statusTable != 1
//                     AND ot.orderTime <= ?) AS earliestReservationTime,
//                    (SELECT ot.id
//                     FROM orderingTables ot 
//                     WHERE ot.numTable = t.id 
//                     AND ot.orderDate = ?
//                     AND ot.statusTable != 1
//                     AND ot.orderTime <= ?
//                     ORDER BY ot.orderTime ASC
//                     LIMIT 1) AS orderingTableId
//             FROM restaurantTables t;
//         `;
//         const [rows] = await pool.query(query, [date, time, date, time]);
//         rows.forEach(row => {
//             row.isOccupied = row.orderingTableId !== null;
//         });
//         return rows;
//     } catch (err) {
//         console.error('Error fetching available tables:', err);
//         throw err;
//     }
// }

async function getAvailableTablesForCurrentTime() {
    const currentDate = new Date();
    const date = currentDate.toISOString().split('T')[0];
    
    // Adding 2 minutes to the current time and formatting it
    const currentTimePlusTwoMinutes = new Date(currentDate.getTime() + 2 * 60000);
    const time = currentTimePlusTwoMinutes.toTimeString().split(' ')[0].slice(0, 5);

    // Adding 1 hour to the current time for future reservations
    const futureTime = new Date(currentDate.getTime() + 60 * 60000);
    const futureTimeFormatted = futureTime.toTimeString().split(' ')[0].slice(0, 5);

    try {
        const query = `
            SELECT t.id, t.numSeats, t.inside,
                   (SELECT MIN(ot.orderTime)
                    FROM orderingTables ot 
                    WHERE ot.numTable = t.id 
                    AND ot.orderDate = ?
                    AND ot.statusTable != 1
                    AND ((ot.orderTime <= ?) OR (ot.orderTime > ? AND ot.orderTime <= ?))) AS earliestReservationTime,
                   (SELECT ot.id
                    FROM orderingTables ot 
                    WHERE ot.numTable = t.id 
                    AND ot.orderDate = ?
                    AND ot.statusTable != 1
                    AND ((ot.orderTime <= ?) OR (ot.orderTime > ? AND ot.orderTime <= ?))
                    ORDER BY ot.orderTime ASC
                    LIMIT 1) AS orderingTableId
            FROM restaurantTables t;
        `;
        const [rows] = await pool.query(query, [date, time, time, futureTimeFormatted, date, time, time, futureTimeFormatted]);
        rows.forEach(row => {
            row.isOccupied = row.orderingTableId !== null;
        });
        return rows;
    } catch (err) {
        console.error('Error fetching available tables:', err);
        throw err;
    }
}



async function getOrderingTable(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM orderingTables WHERE id=?', [id]);
        return rows[0];
    } catch (err) {
        console.log(err);
    }
}

module.exports = { getAvailableTablesForCurrentTime, getOrderingTable };