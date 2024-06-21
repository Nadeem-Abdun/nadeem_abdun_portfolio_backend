import User from "../models/user.models.js"
import ApiError from "./ApiError.utilities.js";

const generateTokens = async (userId) => {
    try {
        const userData = await User.findById(userId);
        const accessToken = await userData.generateAccessToken();
        const refreshToken = await userData.generateRefreshToken();
        await User.findByIdAndUpdate(userData._id, { $set: { refreshToken: refreshToken } });
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Error in generating tokens");
    }
}

export default generateTokens;