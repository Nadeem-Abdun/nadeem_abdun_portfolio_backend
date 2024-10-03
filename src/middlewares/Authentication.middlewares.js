import jwt from "jsonwebtoken";
import asyncHandler from "../utilities/AsyncHandler.utilities.js";
import ApiError from "../utilities/ApiError.utilities.js";
import User from "../models/user.models.js";

const verifyUserAccess = asyncHandler(async (req, res, next) => {
    try {
        const userToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!userToken) {
            throw new ApiError(401, "Unauthorized Request, Access Token Not Found");
        }
        const decodedAccessData = await jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedAccessData._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Unauthorized Request, Invalid Access Token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Error in verifying access token");
    }
});

export default verifyUserAccess;