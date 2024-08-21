const pool = require('../DB');

async function getSingleDishesType(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM dishesTypes WHERE id = ?', [id]);
        return rows[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function createDishesType(title) {
    try {
        const [result] = await pool.query(
            'INSERT INTO dishesTypes (title) VALUES(?)', [title]
        );
        return result.insertId;
    } catch (err) {
        console.error('Error creating dishes type:', err);
        throw err;
    }
}

async function getAllDishesTypes() {
    try {
        const [rows] = await pool.query('SELECT * FROM dishesTypes');
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


async function updateDishType(id, title) {
  try {
    await pool.query(
      'UPDATE dishesTypes SET title = ? WHERE id = ?',
      [title, id]
    );
  } catch (err) {
    console.error('Error updating dish type:', err);
    throw err;
  }
}

module.exports = { getSingleDishesType, createDishesType, getAllDishesTypes, updateDishType };
