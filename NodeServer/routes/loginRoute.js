const express = require('express')
const router = express.Router()
require('dotenv').config();
const jwt = require('jsonwebtoken');
router.use(express.json())
router.use(express.urlencoded({ extended: true }))
const { confirmPassword } = require('../controllers/loginController')

router.post('/', async (req, res) => {
    const { email, password } = req.body;  
    try {
        const user = await confirmPassword(email, password);  
        if (user) {
            const token = jwt.sign({ id: user.id,  idUserType: user.idUserType}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.cookie("accessToken", token, {
                httpOnly: true,
                sameSite: "None",
                secure: true,
            });
            res.status(201).send(user);
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
