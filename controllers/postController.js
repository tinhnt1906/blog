const asyncHandler = require("express-async-handler");
const ErrorHandler = require('../utils/errorHandler')
const Post = require('../models/Post')
const path = require("path");
const fs = require("fs");
const {
    cloudinaryUploadImage,
    cloudinaryRemoveImage,
    cloudinaryRemoveMultipleImage
} = require("../utils/cloudinary");

const createPost = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorHandler('no image provided'), 400)
    }

    //Upload photo
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);

    // 4. Create new post and save it to DB
    const post = await Post.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        user: req.user.id,
        image: {
            url: result.secure_url,
            publicId: result.public_id,
        },
    });

    // 5. Send response to the client
    res.status(201).json({
        success: true,
        post
    });

    // 6. Remove image from the server
    fs.unlinkSync(imagePath);
})

const getAllPosts = asyncHandler(async (req, res, next) => {
    const POST_PER_PAGE = 3;
    const { pageNumber, category } = req.query;
    let posts;
    if (pageNumber) {
        posts = await Post.find()
            .skip((pageNumber - 1) * POST_PER_PAGE)
            .limit(POST_PER_PAGE)
            .sort({ createdAt: -1 })
            .populate('user');
    } else if (category) {
        posts = await Post.find({ category })
            .sort({ createdAt: -1 })
            .populate('user')
    } else {
        posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('user')
    }
    res.status(200).json({
        success: true,
        posts
    });
})

const getSinglePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id)
        .populate('user')
        .populate("comments");
    if (!post) {
        return next(new ErrorHandler('post not found'), 404)
    }
    res.status(200).json({
        success: true,
        post
    });
})

const getPostCount = asyncHandler(async (req, res, next) => {
    const count = await Post.countDocuments({}).exec();
    console.log(count);
    res.status(200).json({
        success: true,
        count
    });
});

const deletePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        return next(new ErrorHandler('post not found'), 404)
    }

    if (req.user.role === 'admin' || req.user.id === post.user.toString()) {
        await Post.findByIdAndDelete(req.params.id)
        await cloudinaryRemoveImage(post.image.publicId)

        // Delete all comments that belong to this post
        //await Comment.deleteMany({ postId: post._id });


        res.status(200).json({
            success: true,
            message: "post has been deleted successfully",
            // postId: post._id,
        });
    } else {
        return next(new ErrorHandler('access denied, forbidden'), 403)
    }

})

const updatePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        return next(new ErrorHandler('post not found'), 404)
    }

    if (req.user.id !== post.user.toString()) {
        return next(new ErrorHandler('access denied, you are not allowed'), 403)
    }

    const updatedPost = await Post.findById(
        req.params.id,
        {
            $set: {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
            }
        },
        { new: true }
    ).populate('user')

    res.status(200).json({
        success: true,
        updatedPost
    });
})

const updatePostImage = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorHandler('no image provided'), 400)
    }

    const post = await Post.findById(req.params.id)
    if (!post) {
        return next(new ErrorHandler('post not found'), 404)
    }

    if (req.user.id !== post.user.toString()) {
        return next(new ErrorHandler('access denied, you are not allowed'), 403)
    }

    await cloudinaryRemoveImage(post.image.publicId);

    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);

    const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                image: {
                    url: result.secure_url,
                    publicId: result.public_id,
                },
            },
        },
        { new: true }
    );

    res.status(200).json({
        success: true,
        updatedPost
    });

    fs.unlinkSync(imagePath);
})

const toggleLike = asyncHandler(async (req, res, next) => {
    const loggedInUser = req.user.id;
    const { id: postId } = req.params

    let post = await Post.findById(postId)
    if (!post) {
        return next(new ErrorHandler('post not found'), 404)
    }

    const isPostAlreadyLiked = post.likes.find(
        user => user.toString() === loggedInUser
    )

    if (isPostAlreadyLiked) {
        post = await Post.findByIdAndUpdate(
            postId,
            {
                $pull: { likes: loggedInUser }
            },
            { new: true }
        )
    } else {
        post = await Post.findByIdAndUpdate(
            postId,
            {
                $push: { likes: loggedInUser }
            },
            { new: true }
        )
    }

    res.status(200).json({
        success: true,
        post
    });
})

module.exports = {
    createPost,
    getAllPosts,
    getSinglePost,
    getPostCount,
    deletePost,
    updatePost,
    updatePostImage,
    toggleLike
}