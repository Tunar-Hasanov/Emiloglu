const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../db/models/user_model.js');
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = "d0d9dc77406ef8cf1f1d461335680c2699db2354816c8077526441907d76d647";

const register = asyncHandler(async (req, res) => {
    const { fullName, email, password, phoneNumber } = req.body;

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(403).json({
                message: "Email already used"
            });
        }

        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            userId,
            fullName,
            email,
            password: hashedPassword,
            phoneNumber
        });

        const savedUser = await user.save();
        return res.status(201).json({
            message: 'User successfully created!',
            result: savedUser,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Authentication Failed"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Authentication Failed"
            });
        }

        const jwtToken = jwt.sign(
            { email: user.email, userId: user.userId },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            accessToken: jwtToken,
            userId: user.userId,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

const userProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.findOne({ userId: id });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            message: `User ${user.fullName}`,
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

const users = asyncHandler(async (req, res) => {
    try {
        const allUsers = await userModel.find();
        return res.status(200).json({
            data: allUsers,
            success: true,
            message: "Users list"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = {
    register,
    login,
    userProfile,
    users
};
