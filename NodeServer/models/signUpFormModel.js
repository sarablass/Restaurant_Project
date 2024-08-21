const pool = require('../DB')
const bcrypt = require('bcrypt')

async function createUser(idUserType, username, email, phone, hashedPassword) {
    try {
        const [result1] = await pool.query(
           "INSERT INTO passwords( password) VALUES(?)",
            [hashedPassword]
        )
        console.log('result.insertId: ' + result1.insertId)
        const [result2] =  await pool.query(
            "INSERT INTO users(idUserType, username, email, phone, idPassword) VALUES(?, ?, ?, ?, ?)",
            [idUserType, username, email, phone, result1.insertId ]
        )
        return result2.insertId
    } catch (err) {
        console.error('Error creating user:', err)
        throw err
    }
}

async function validateUser(email) {
    try {
        const [existUser] = await pool.query(`SELECT email FROM users where email=?`, [email])
        console.log('existUser[0]: ' + existUser[0])
        return existUser[0]
    } catch (err) {
        console.error('Error validate user:', err)
        throw err
    }
}

module.exports = { createUser, validateUser }