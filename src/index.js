const express = require('express');
const app = express();
const routes = require('../routes/router');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()

//global middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}))

//route middleware
app.use('/', routes);

//database connection
mongoose.connect(process.env.URI_CONNECT).then(() => console.log('Database is connected...')).catch((err) => console.log(err));

//server start
app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
})
