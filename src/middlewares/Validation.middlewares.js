import ApiError from "../utilities/ApiError.utilities.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const MAX_FIELD_LENGTH = 255;

export const validateRegistration = (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || typeof username !== "string" || username.trim().length < 3 || username.trim().length > MAX_FIELD_LENGTH) {
        throw new ApiError(400, "Username must be between 3 and 255 characters.");
    }
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
        throw new ApiError(400, "A valid email address is required.");
    }
    if (!password || typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
        throw new ApiError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
    }
    req.body.username = username.trim();
    req.body.email = email.trim();
    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
        throw new ApiError(400, "A valid email address is required.");
    }
    if (!password || typeof password !== "string" || password.length === 0) {
        throw new ApiError(400, "Password is required.");
    }
    req.body.email = email.trim();
    next();
};

export const validateContactForm = (req, res, next) => {
    const { visitorName, visitorEmail, visitorMessage } = req.body;
    if (!visitorName || typeof visitorName !== "string" || visitorName.trim().length === 0 || visitorName.trim().length > MAX_FIELD_LENGTH) {
        throw new ApiError(400, "Visitor name is required and must be under 255 characters.");
    }
    if (visitorEmail && (typeof visitorEmail !== "string" || !EMAIL_REGEX.test(visitorEmail.trim()))) {
        throw new ApiError(400, "A valid visitor email address is required.");
    }
    if (visitorMessage && (typeof visitorMessage !== "string" || visitorMessage.trim().length > 2000)) {
        throw new ApiError(400, "Message must be under 2000 characters.");
    }
    req.body.visitorName = visitorName.trim();
    if (visitorEmail) req.body.visitorEmail = visitorEmail.trim();
    if (visitorMessage) req.body.visitorMessage = visitorMessage.trim();
    next();
};
