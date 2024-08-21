const express = require('express')
const router = express.Router()
require('dotenv').config();
const jwt = require('jsonwebtoken');
router.use(express.json())
router.use(express.urlencoded({ extended: true }))
const { create } = require('../controllers/signUpFormController')

router.post('/', async (req, res) => {
    try {
        const user = await create(req.body.idUserType, req.body.username, req.body.email, req.body.phone, req.body.password)
        const accessToken = jwt.sign(
            {
                id: user,
                idUserType: req.body.idUserType,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });
        res.status(201).json({ id: user, idUserType: req.body.idUserType, username: req.body.username, email: req.body.email, phone: req.body.phone });
    } catch (error) {
        if (error.message === 'Email and password are required' || error.message === 'User already exists') {
            res.status(400).json({ error: error.message });
        } else {
            console.error('Error in signup:', error);
            res.status(500).json({ error: 'Failed to create user' });
        }
    }
})


module.exports = router