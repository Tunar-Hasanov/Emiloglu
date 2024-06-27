const { check, validationResult } = require("express-validator");

const registerValidation = [
    check("fullName").notEmpty().withMessage("Full name is required")
        .isString().withMessage("Full name must be a string")
        .isLength({ min: 3 }).withMessage("Full name must be at least 3 characters long"),
    check("email").notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email must be valid"),
    check("password").notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    check("phoneNumber").notEmpty().withMessage("Phone number is required")
        .isLength({ min: 9, max: 9 }).withMessage("Phone number must be exactly 10 digits long"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(412).json({
                success: false,
                message: "Validation failed",
                data: errors.array()
            });
        }
        next();
    }
];

const loginValidation = [
    check("email").notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email must be valid"),
    check("password").notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(412).json({
                success: false,
                message: "Validation failed",
                data: errors.array()
            });
        }
        next();
    }
];

module.exports = {
    registerValidation,
    loginValidation
};
