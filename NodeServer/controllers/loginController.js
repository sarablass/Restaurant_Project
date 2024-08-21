const model = require('../models/loginModel')

async function getByEmail(email) {
    try {
        return await model.getByEmail(email)
    } catch (err) {
        throw err
    }
}
async function confirmPassword(email, password) {
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const userByEmail = await getByEmail(email);
        if (!userByEmail) {
            return null;
        } else {
            const confirm = await model.confirmPassword(userByEmail.id, password);
            if (confirm) {
                return userByEmail;
            } else {
                return null;
            }
        }
    } catch (err) {
        throw err;
    }
}


module.exports = { getByEmail , confirmPassword }