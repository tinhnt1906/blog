const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const User = require('../models/User')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const ErrorHandler = require('../utils/errorHandler')

const {
    cloudinaryUploadImage,
    cloudinaryRemoveImage,
    cloudinaryRemoveMultipleImage
} = require("../utils/cloudinary");



const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().populate('posts');
    res.status(200).json({ success: true, users })
})

const getUser = asyncHandler(async (req, res, next) => {
    const users = await User.findById(req.params.id).populate('posts');
    res.status(200).json({ success: true, users })
})

const deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user)
        return next(new ErrorHandler(`user not found`, 404))

    //lay tat ca posts thuoc ve nguoi dung
    const posts = await Post.find({ user: user._id });

    // lay publicIds thuoc ve posts
    const publicIds = await posts?.map(post => post.image.publicId);

    // xoa tat ca hinh anh cua posts thuoc ve user
    if (publicIds?.length > 0) {
        await cloudinaryRemoveMultipleImage(publicIds)
    }

    // xoa avatar nguoi dung
    if (user.profilePhoto.publicId !== null) {
        await cloudinaryRemoveImage(user.profilePhoto.publicId);
    }

    // xoa user posts va comments
    await Post.deleteMany({ user: user._id })
    await Comment.deleteMany({ user: user._id })

    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: 'delete user successfully',
    })
})

const updateUser = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler('user not found', 404))
    }
    user = await user.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                username: req.body.username,
                password: req.body.password,
            },
        },
        { new: true, runValidators: true }
    )
    res.status(201).json({
        success: true,
        user
    });
})


const profilePhotoUpload = asyncHandler(async (req, res) => {
    // 1. Validation
    if (!req.file) {
        return next(new ErrorHandler('no file provided', 404))
    }

    // 2. Get the path to the image
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

    // 3. Upload to cloudinary
    const result = await cloudinaryUploadImage(imagePath);

    // 4. Get the user from DB
    const user = await User.findById(req.user.id);

    // 5. Delete the old profile photo if exist
    if (user.profilePhoto?.publicId !== null) {
        await cloudinaryRemoveImage(user.profilePhoto.publicId);
    }

    // 6. Change the profilePhoto field in the DB
    user.profilePhoto = {
        url: result.secure_url,
        publicId: result.public_id,
    };
    await user.save();

    // 7. Send response to client
    res.status(200).json({
        success: true,
        message: "your profile photo uploaded successfully",
        profilePhoto: { url: result.secure_url, publicId: result.public_id },
    });

    // 8. Remove image from the server
    fs.unlinkSync(imagePath);
});


const countUsers = asyncHandler(async (req, res, next) => {
    const countUsers = await User.count();

    res.status(200).json({ success: true, countUsers })
})


module.exports = {
    getAllUsers, getUser, deleteUser, updateUser, countUsers, profilePhotoUpload
}
