const model = require('../models/signUpFormModel')
const bcrypt = require('bcrypt')
const saltRounds = 10

async function create(idUserType, username, email, phone, password) {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }
    try {
        const validate = await model.validateUser(email)
        if (validate) {
            throw new Error("User already exists");
        } else {
            const hashedPassword = await bcrypt.hash(password, saltRounds)
            return await model.createUser(idUserType, username, email, phone, hashedPassword)
        }
    } catch (err) {
        throw err
    }
}

module.exports = { create }