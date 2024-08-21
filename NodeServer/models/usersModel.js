const pool = require('../DB');

async function getWaiters() {
    try {
        const query = `
            SELECT users.id, users.username, users.email, users.phone
            FROM users
            JOIN userTypes ON users.idUserType = userTypes.id
            WHERE userTypes.id = 2 OR userTypes.typeUser = 'waiter'
        `;
        const [rows] = await pool.query(query);
        return rows;
    } catch (err) {
        console.error('Error fetching waiters:', err);
        throw err;
    }
}

module.exports = { getWaiters };
