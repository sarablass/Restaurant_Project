// const express = require('express')
// const postsRouter = express.Router()
// postsRouter.use(express.json())
// const { getAll } = require('../controllers/dishesController')

// postsRouter.get('/', async (req, res) => {
//     res.send(await getAll())
// })

const express = require('express');
const router = express.Router(); // הוספתי זוהי הפקודה שחסרה

const { getAll } = require('../controllers/dishesController'); // הוספתי זה זה חסר כדי ליבא את הפונקציה getAll

router.use(express.json());

router.get('/', async (req, res) => {
    res.send(await getAll());
});

module.exports = router; // החלפתי את postsRouter ב router
