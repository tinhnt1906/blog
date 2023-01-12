const mongoose = require("mongoose");
const Joi = require("joi");

// Post Schema
const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 200,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        image: {
            type: Object,
            default: {
                url: "",
                publicId: null,
            },
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

//Populate Comment For This Post
PostSchema.virtual("comments", {
    ref: "Comment",
    foreignField: "postId",
    localField: "_id"
});

// Post Model
module.exports = mongoose.model("Post", PostSchema);



