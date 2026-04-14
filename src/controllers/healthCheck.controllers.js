import mongoose from "mongoose";
import os from "os";
import asyncHandler from "../utilities/AsyncHandler.utilities.js";
import ApiResponse from "../utilities/ApiResponse.utilities.js";

const healthCheck = asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const dbState = mongoose.connection.readyState;
    const dbStatusMap = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
    const isDbHealthy = dbState === 1;
    const healthData = {
        server: "up",
        dbStatus: dbStatusMap[dbState],
        database: isDbHealthy ? "connected" : "disconnected",
        service: "nadeem-abdun-portfolio-backend",
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(process.uptime())}s`,
        responseTime: `${Date.now() - startTime}ms`,
        system: {
            hostname: os.hostname(),
            platform: process.platform,
            nodeVersion: process.version,
            pid: process.pid,
            memoryUsage: {
                rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
                heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
            },
        },
    };
    return res
        .status(200)
        .json(new ApiResponse(200, "Health check successful", healthData));
});

export default healthCheck;