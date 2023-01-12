const asyncHandler = require("express-async-handler");
const ErrorHandler = require('../utils/errorHandler')
const Comment = require('../models/Comment')
const User = require('../models/User')


const createComment = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    const comment = await Comment.create({
        postId: req.body.postId,
        text: req.body.text,
        user: req.user.id,
        username: user.username
    })

    res.status(201).json({
        success: true,
        comment
    });
})

const getAllComments = asyncHandler(async (req, res, next) => {
    const comments = await Comment.find().populate("user")
    res.status(200).json({
        success: true,
        comments
    });
})

const deleteComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        return next(ErrorHandler('comment not found', 404));
    }

    if (req.user.role === 'admin' || req.user.id === comment.user.toString()) {
        await Comment.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } else {
        res.status(403).json({
            success: false,
            message: 'access denied, not allowed'
        });
    }
})

const updateComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        return next(ErrorHandler('comment not found', 404));
    }

    if (req.user.id === comment.user.toString()) {
        const updateComment = await Comment.findByIdAndUpdate(
            req.params.id,
            {
                text: req.body.text,
            },
            { new: true }
        )
        res.status(200).json({
            success: true,
            updateComment
        });
    } else {
        res.status(403).json({
            success: false,
            message: 'access denied, only user himself can edit his comment'
        });
    }
})

module.exports = {
    createComment,
    getAllComments,
    deleteComment,
    updateComment
}