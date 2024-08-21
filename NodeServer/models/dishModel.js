const pool = require('../DB');


async function getDish(id) {
    try {
        const [rows] = await pool.query("SELECT * FROM dishes WHERE id = ?", [id]);
        return rows[0];
    } catch (err) {
        console.log(err);
    }
}


async function createDish(dishName, idDishTypes, price, remarks, vegan, gluten, imageUrl) {
    try {
        const [result] = await pool.query(
            "INSERT INTO dishes (dishName, idDishTypes, price, remarks, vegan, gluten, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [dishName, idDishTypes, price, remarks, vegan ? 1 : 0, gluten ? 1 : 0, imageUrl]
        );
        
        const insertedId = result.insertId;
        const insertedDish = await getDish(insertedId); // קריאה נוספת לקבלת המנה שהוכנסה
        
        return { ...insertedDish, imageUrl }; // מחזיר את המנה עם כתובת התמונה
    } catch (err) {
        console.error('Error creating dish:', err);
        throw err;
    }
}



async function deleteDish(dishId) {
    try {
        const [result] = await pool.query(
            "DELETE FROM dishes WHERE id = ?", [dishId]
        );
        if (result.affectedRows === 0) {
            throw new Error('No rows affected');
        }
    } catch (err) {
        console.error('Error deleting dish:', err);
        throw err;
    }
}

async function updateDish(dishId, dishName, remarks, price) {
    try {
        await pool.query(
            "UPDATE dishes SET dishName = ?, remarks = ?, price = ? WHERE id = ?",
            [dishName,remarks,price, dishId]
        );        
    } catch (err) {
        console.error('Error updating dish:', err);
        throw err;
    }
}


async function getDishTypeIdByName(name) {
    try {
        const [rows] = await pool.query('SELECT id FROM dishesTypes WHERE title = ?', [name]);
        if (rows.length > 0) {
            console.log("hooo" + rows[0].id)
            return rows[0].id;
        } else {
            throw new Error('Dish type not found');
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getDish, createDish, deleteDish, updateDish, getDishTypeIdByName };