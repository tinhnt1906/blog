const authRoute = require('./authRoute');
const userRoute = require('./userRoute');
const categoryRoute = require('./categoryRoute');
const postRoute = require('./postRoute');
const commentRoute = require('./commentRoute');


const initRoutes = (app) => {
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/users', userRoute);
    app.use('/api/v1/categories', categoryRoute);
    app.use('/api/v1/posts', postRoute);
    app.use('/api/v1/comments', commentRoute);
};

module.exports = initRoutes;