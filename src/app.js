import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { API_V1_BASEPATH } from "./utilities/constants.utilities.js";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb",
}));

app.use(express.static("public"));

app.use(cookieParser());

// Sample Route
app.get("/", (req, res) => {
    res.send("Your are on the server sample test link");
});

// Server Routes
import userRouter from "./routes/user.routes.js";
import aboutMeRouter from "./routes/aboutMe.routes.js";

app.use(`${API_V1_BASEPATH}/users`, userRouter);
app.use(`${API_V1_BASEPATH}/aboutMe`, aboutMeRouter);

export { app }