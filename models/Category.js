const mongoose = require("mongoose");

// Category Schema
const CategorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        unique: [true, 'this category is exists']
    }
}, {
    timestamps: true,
});

// Category Model
module.exports = mongoose.model("Category", CategorySchema);
