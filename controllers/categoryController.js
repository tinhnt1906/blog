const Category = require('../models/Category')
const asyncHandler = require('express-async-handler');
const ErrorHandler = require('../utils/errorHandler')


const countCategories = asyncHandler(async (req, res, next) => {
    const count = await Category.count();
    res.status(200).json(count);
})

const createCategory = asyncHandler(async (req, res, next) => {
    const { title } = req.body
    const category = await Category.create({
        title,
        user: req.user.id
    });
    res.status(200).json({ success: true, category })
})

const getCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.find();
    if (!categories)
        return res.status(404).json({ message: "list categories is empty" });

    res.status(200).json({ success: true, categories })

})

const getCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category)
        return next(new ErrorHandler(`category not found`, 404))

    res.status(200).json({ success: true, category })
})

const deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category)
        return next(new ErrorHandler(`category not found`, 404))
    await Category.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: 'delete category successfully',
    })
})

const updateCategory = asyncHandler(async (req, res, next) => {
    let category = await Category.findById(req.params.id);
    if (!category) {
        return next(new ErrorHandler('Category not found', 404))
    }
    category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            user: req.user.id
        },
        { new: true, runValidators: true }
    )
    res.status(201).json({
        success: true,
        category
    });
})

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    deleteCategory,
    updateCategory,
    countCategories
}
