const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require("cookie-parser");
const app = express();



const dishes = require('./routes/dishesRoute');
const orderingTables = require('./routes/orderingTablesRoute');
const login = require('./routes/loginRoute');
const orderingFood = require('./routes/orderingFoodRoute');
const dishesOrdered = require('./routes/dishesOrderedRoute');
const emailRouter = require('./routes/sendEmailRoute');
const dish = require('./routes/dishRoute');
const orderingTablesCurrentT = require('./routes/orderingTablesCurrentTRoute');
const dishesTypes = require('./routes/dishesTypesRoute')
const sendEmailNewsletter = require('./routes/sendEmailNewsletterRoute')
const userTableOrders = require('./routes/personalTableOrderRoute')
const userFoodOrders = require('./routes/personalFoodOrdersRoute')
const waiters = require('./routes/usersRoute')
const updateOrderingFood = require('./routes/updateOrderingFoodRoute')
const fullCart = require ('./routes/fullCartRoute')
const chef = require('./routes/chefRoute')
const signUp = require('./routes/signUpFormRoute')
const dishesInOrder = require('./routes/dishesInOrderRoute')
const perTableReservationDetails = require('./routes/perTableReservationDetailsRoute')
const verifyJWT = require('./middleware/verifyJWT');

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/dishes", dishes);
app.use("/login", login);
app.use("/orderingTables", orderingTables);
app.use('/send-contact-email', emailRouter);
app.use('/images', express.static(path.join(__dirname, 'pic')));
app.use('/dishesTypes', dishesTypes)
app.use('/send-email-newSletter',sendEmailNewsletter)
app.use('/signUp',signUp)

app.use(verifyJWT);
app.use("/orderingFood", orderingFood);
app.use("/dishesOrdered", dishesOrdered);
app.use('/dish', dish);
app.use('/orderingTablesCurrent', orderingTablesCurrentT);
app.use('/user-reservations', userTableOrders);
app.use('/user-orders', userFoodOrders);
app.use('/waiters',waiters)
app.use('/updateOrderingFood' , updateOrderingFood)
app.use('/fullCart' , fullCart)
app.use('/chef',chef)
app.use('/dishesInOrder',dishesInOrder)
app.use('/order-details', perTableReservationDetails)


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


