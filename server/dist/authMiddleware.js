"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = (req, res, next) => {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Bearer token
    if (!token)
        return res.sendStatus(403); // Forbidden if no token is provided
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403); // Forbidden if token is invalid
        req.user = user; // Attach the user object to the request
        next();
    });
};
exports.authenticateJWT = authenticateJWT;
