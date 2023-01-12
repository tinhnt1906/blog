const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

// User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    role: {
        type: String,
        default: 'user',
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    profilePhoto: {
        type: Object,
        default: {
            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",
            publicId: null,
        }
    },
    refreshToken: {
        type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Populate Posts That Belongs To This User When he/she Get his/her Profile
UserSchema.virtual("posts", {
    ref: "Post",
    foreignField: "user",
    localField: "_id",
});

UserSchema.pre("save", async function (next) {
    // Only run this function if password was moddified (not on other update functions)
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}


// User Model
module.exports = mongoose.model("User", UserSchema);