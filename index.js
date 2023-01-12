const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDB = require('./config/connectDB')
const errorMiddleware = require("./middlewares/errorMiddleware");
const initRoutes = require('./routes')
const ApiError = require('./utils/apiError');
const path = require('path');
const cloudinary = require('cloudinary')

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

// Connect with db
connectDB();

//routes 
initRoutes(app)

// Global error handling middleware for express

// app.all('*', (req, res, next) => {
//     next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
// });


app.use(errorMiddleware)
// Running The Server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running  at PORT ${PORT}`);
});