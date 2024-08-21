const express = require('express');
const multer = require('multer');
const router = express.Router();
const verifyPermissions = require('../middleware/verifyPermissions');
const { createDish, deleteDish, updateDish, getSingle } = require('../controllers/dishController');
router.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'pic'); // ספריית היעד של הקבצים
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // שם הקובץ ששומר בספרייה
  },
});

const upload = multer({ storage: storage });

router.post('/', verifyPermissions([1]), upload.single('image'), async (req, res) => {
  try {
    const { dishName, idDishTypes, price, remarks, vegan, gluten } = req.body;
    const imageUrl = req.file ? req.file.filename : null;
    const response = await createDish(dishName, idDishTypes, price, remarks, vegan, gluten, imageUrl);
    const singleDish = await getSingle(response.id); // שינוי: שימוש ב-id מהתגובה
    console.log('Single Dish:', singleDish);
    res.status(201).json(singleDish);
  } catch (error) {
    console.error('Error creating dish:', error);
    res.status(500).json({ error: 'Failed to create dish' });
  }
});

router.delete('/:dishId', verifyPermissions([1]), async (req, res) => {
  const { dishId } = req.params;
  try {
    await deleteDish(dishId);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting dish:', error);
    res.status(500).send('Failed to delete dish');
  }
});

router.put('/:dishId', verifyPermissions([1]), async (req, res) => {
  const { dishId } = req.params;
  console.log(dishId)
  const { dishName, remarks, price } = req.body;
  try {
    await updateDish(dishId, dishName, remarks, price);
    res.status(200).send('Dish updated successfully');
  } catch (error) {
    console.error('Error updating dish:', error);
    res.status(500).send('Failed to update dish');
  }
});


module.exports = router;