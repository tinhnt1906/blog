const express = require('express');
const router = express.Router();
const { authorizeRoles, isAuthenticatedUser } = require('../middlewares/authMiddleware')
const photoUpload = require('../middlewares/photoUploadMiddleware')
const { toggleLike, createPost, getAllPosts, getSinglePost, updatePost, updatePostImage, deletePost, getPostCount } = require('../controllers/postController')

router.route('/')
    .post(isAuthenticatedUser, photoUpload.single('image'), createPost)
    .get(getAllPosts)


router.route('/count')
    .get(isAuthenticatedUser, getPostCount)

router.route('/:id')
    .get(getSinglePost)
    .delete(isAuthenticatedUser, deletePost)
    .put(isAuthenticatedUser, updatePost)

router.route("/update-image/:id")
    .put(isAuthenticatedUser, photoUpload.single('image'), updatePostImage)

router.route('/like/:id')
    .put(isAuthenticatedUser, toggleLike)
module.exports = router;
