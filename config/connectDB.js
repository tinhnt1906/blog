const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Database error");
    }
};
module.exports = dbConnect;