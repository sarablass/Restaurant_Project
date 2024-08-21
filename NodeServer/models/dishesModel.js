const pool = require('../DB')

async function getDishes() {
    try {
        const [rows] = await pool.query(`
            SELECT dishes.id, dishes.dishName, dishes.price, dishes.remarks, dishes.vegan, dishes.gluten, dishes.imageUrl, dishesTypes.title AS dishType
            FROM dishes
            JOIN dishesTypes ON dishes.idDishTypes = dishesTypes.id;
        `);
        return rows;
    } catch (err) {
        console.log(err);
    }
}

module.exports = { getDishes }
