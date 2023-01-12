const express = require('express');
const router = express.Router();
const { authorizeRoles, isAuthenticatedUser } = require('../middlewares/authMiddleware')
const { createComment, getAllComments, deleteComment, updateComment } = require('../controllers/commentController')


// /api/comments
router
    .route("/")
    .post(isAuthenticatedUser, createComment)
    .get(isAuthenticatedUser, authorizeRoles('admin'), getAllComments);

// /api/comments/:id
router.route("/:id")
    .delete(isAuthenticatedUser, deleteComment)
    .put(isAuthenticatedUser, updateComment);

module.exports = router;