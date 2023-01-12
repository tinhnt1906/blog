const express = require('express');
const router = express.Router();
const { countCategories, createCategory, getCategories, getCategory, deleteCategory, updateCategory } = require('../controllers/categoryController')
const { authorizeRoles, isAuthenticatedUser } = require('../middlewares/authMiddleware')



router.route('/')
    .post(isAuthenticatedUser, createCategory)
    .get(isAuthenticatedUser, getCategories)

router.route('/count')
    .get(isAuthenticatedUser, countCategories)

router.route('/:id')
    .get(isAuthenticatedUser, getCategory)
    .delete(isAuthenticatedUser, deleteCategory)
    .put(isAuthenticatedUser, updateCategory)



module.exports = router;
