import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import asyncHandler from "../utilities/AsyncHandler.utilities.js";
import ApiResponse from "../utilities/ApiResponse.utilities.js";
import ApiError from "../utilities/ApiError.utilities.js";
import generateTokens from "../utilities/GenerateTokens.utilities.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        throw new ApiError(400, "All input fields are required. Please fill in all fields.");
    }
    const existingUserCheck = await User.findOne({ email: email });
    if (existingUserCheck) {
        throw new ApiError(409, "User already exists. Please log in instead of signing up.");
    }
    const newUser = await User.create({
        username: username,
        email: email,
        password: password
    });
    const payload = await User.findById(newUser._id).select("-password -refreshToken");
    if (!payload) {
        throw new ApiError(500, "Error creating the new user. Please try again.");
    }
    return res
        .status(201)
        .json(new ApiResponse(201, "User created successfully. Please log in to continue.", payload));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Both email and password are required. Please fill in all fields.");
    }
    const userData = await User.findOne({ email: email });
    if (!userData) {
        throw new ApiError(404, "User not found, Please check your credentials");
    }
    const checkCredentials = await userData.isPasswordCorrect(password);
    if (!checkCredentials) {
        throw new ApiError(401, "Invalid credentials. Please try again with valid credentials.");
    }
    const { accessToken, refreshToken } = await generateTokens(userData._id);
    const payload = await User.findById(userData._id).select("-password -refreshToken");
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: process.env.COOKIE_ACCESS_ORIGIN,
        path: process.env.COOKIE_ACCESS_PATH,
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, "Logged in successfully.", payload));
});

const logoutUser = asyncHandler(async (req, res) => {
    const loggedInUser = req.user;
    const payload = await User.findByIdAndUpdate(
        loggedInUser._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    ).select("-password -refreshToken");
    if (!payload) {
        throw new ApiError(500, "An error occurred during logout. Please try again.");
    }
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: process.env.COOKIE_ACCESS_ORIGIN,
        path: process.env.COOKIE_ACCESS_PATH,
    };
    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, "Logged out successfully.", payload));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken || req.header("Re-Authorization")?.replace("Bearer ", "");
    if (!incomingRefreshToken) {
        throw new ApiError(400, "Unauthorized request, Token not found, Please try again");
    }
    const decodeToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userData = await User.findById(decodeToken?._id);
    if (!userData) {
        throw new ApiError(400, "Invalid refresh token, User not found, Please try again");
    }
    if (incomingRefreshToken !== userData.refreshToken) {
        throw new ApiError(400, "Invalid refresh token, Not a valid user, Please try again");
    }
    const { accessToken, refreshToken } = await generateTokens(userData._id);
    const payload = await User.findById(userData._id).select("-password -refreshToken");
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: process.env.COOKIE_ACCESS_ORIGIN,
        path: process.env.COOKIE_ACCESS_PATH,
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, "Access token renewal successful", payload));

});

const updatePassword = asyncHandler(async (req, res) => {
    const loggedInUser = req.user;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Both old and new passwords are required. Please fill in all fields.");
    }
    const userData = await User.findById(loggedInUser._id);
    const checkOldPassword = await userData.isPasswordCorrect(oldPassword);
    if (!checkOldPassword) {
        throw new ApiError(400, "The old password you have entered is incorrect, Please try again");
    }
    userData.password = newPassword;
    userData.save();
    const payload = await User.findById(userData._id).select("-password -refreshToken");
    return res
        .status(200)
        .json(new ApiResponse(200, "Password updated successfully", payload));
});

const getLoggedInUser = asyncHandler(async (req, res) => {
    const loggedInUser = req.user;
    return res
        .status(200)
        .json(new ApiResponse(200, "Successfully fetched details of the currently logged-in user", loggedInUser));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const loggedInUser = req.user;
    const { username, email } = req.body;
    if (!username || !email) {
        throw new ApiError(400, "Input field cannot be empty. Please fill them in to continue");
    }
    const payload = await User.findByIdAndUpdate(loggedInUser._id, { $set: { username: username, email: email } }, { new: true }).select("-password -refreshToken");
    if (!payload) {
        throw new ApiError(500, "Error occurred while updating account details, Please try again");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Account details updated successfully", payload));
});

const getPortfolioProfile = asyncHandler(async (req, res) => {
    const { username } = req.params
    if (!username) {
        throw new ApiError(400, "Username is missing/not provided, please try again");
    }
    const payload = await User.findOne({ username: username }).select("profile");
    if (!payload) {
        throw new ApiError(500, "Error occurred while fetching portfolio profile, Please try again");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Portfolio fetched successfully", payload));
});

export { registerUser, loginUser, logoutUser, refreshAccessToken, updatePassword, getLoggedInUser, updateAccountDetails, getPortfolioProfile }