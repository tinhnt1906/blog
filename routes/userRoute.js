const express = require('express');
const router = express.Router();
const { getAllUsers, getUser, deleteUser, updateUser, countUsers, profilePhotoUpload } = require('../controllers/userController')
const { isAuthenticatedUser, authorizeRoles, isCurrentUserOrAdmin } = require('../middlewares/authMiddleware')
const photoUpload = require("../middlewares/photoUploadMiddleware");



// /api/users/count
router.route('/count')
    .get(isAuthenticatedUser, countUsers);

router.route('/')
    .get(isAuthenticatedUser, getAllUsers)

router.route('/:id')
    .get(isAuthenticatedUser, getUser)
    .delete(isCurrentUserOrAdmin, deleteUser)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)


// /api/users/profile/profile-photo-upload
router
    .route("/profile/profile-photo-upload")
    .post(isAuthenticatedUser, photoUpload.single("image"), profilePhotoUpload);




module.exports = router;
