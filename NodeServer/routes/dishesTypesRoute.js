const express = require('express');
const router = express.Router();
const { create, getSingle, getAll , updateDishType} = require('../controllers/dishesTypesController');
router.use(express.json());

router.post('/', async (req, res) => {
    try {
        const response = await create(req.body.title);
        res.status(201).send(await getSingle(response));
    } catch (error) {
        res.status(500).send('Error creating dish type');
    }
});

router.get('/', async (req, res) => {
    try {
        res.send(await getAll());
    } catch (error) {
        res.status(500).send('Error fetching dish types');
    }
});

router.put('/:dishTypeId', async (req, res) => {
    const { dishTypeId } = req.params;
    const { title } = req.body;
    try {
      await updateDishType(dishTypeId, title);
      res.status(200).send('Dish Type updated successfully');
    } catch (error) {
      console.error('Error updating dish Type:', error);
      res.status(500).send('Failed to update dish Type');
    }
  });
  
  module.exports = router;
