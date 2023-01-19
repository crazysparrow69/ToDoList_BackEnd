// Requires
const express = require('express');
const mongoose = require('mongoose');

// Global variables
const app = express();
const PORT = 5000;

// Built-in middleware for json
app.use(express.json());

// Routing
app.use('/user', require('./routes/userRoute'));
app.use('/auth', require('./routes/authRoute'));

// Connecting
mongoose.set('strictQuery', false);
mongoose
    .connect('mongodb+srv://crazysparrow:564793@cluster0.8aeyxsx.mongodb.net/toDoList_FullStack?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected to database');
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
    })
    .catch((err) => console.log('DB error', err));

