const pool = require('../DB');
// const bcrypt = require('bcrypt')

async function getByEmail(email) {
    try {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await pool.query(sql, [email]);
        if (rows.length === 0) {
            console.log(`No user found with email: ${email}`);
            return null;
        }
        return rows[0];
    } catch (err) {
        console.error('Error getting user:', err);
        throw err;
    }
}

async function confirmPassword(id, password) {
    try {
        const sql = `
            SELECT p.password 
            FROM users u 
            JOIN passwords p ON u.idPassword = p.id 
            WHERE u.id = ?`;
        const [userPassword] = await pool.query(sql, [id]);
        if (userPassword.length === 0) {
            console.log(`No password found for user ID: ${id}`);
            return false;
        }
        const hashedPassword = userPassword[0].password;
        
        // השוואת הסיסמא המוצפנת לסיסמא שהוזנה ע"י המשתמש
        // const isMatch = await bcrypt.compare(password, hashedPassword);
        //return (isMatch); 

        return (password === hashedPassword); // שזה להשוואה פשוטה ללא הצפנה
    } catch (err) {
        console.error('Error confirming password:', err);
        throw err;
    }
}

module.exports = { getByEmail, confirmPassword };