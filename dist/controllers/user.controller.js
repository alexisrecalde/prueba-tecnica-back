"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInUser = exports.createUser = exports.deleteUser = exports.getUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fetch_1 = __importDefault(require("../database/fetch"));
const User_1 = require("../models/User");
const socket_1 = require("../socket");
const StatusError_1 = require("../types/StatusError");
const { sign } = jsonwebtoken_1.default;
const getUser = (req, res, next) => {
   
    if (!req.user) {
        const statusError = new StatusError_1.StatusError('Unauthorized action', 401);
        return next(statusError);
    }
    try {
        const user = fetch_1.default.getUser(req.user);
        if (!user) {
            const statusError = new StatusError_1.StatusError('User not found', 404);
            return next(statusError);
        }
        return res.status(200).json(user);
    }
    catch (error) {
        const statusError = new StatusError_1.StatusError('Error while fetching data', 500);
        return next(statusError);
    }
};
exports.getUser = getUser;
const deleteUser = (req, res, next) => {
    if (!req.user) {
        const statusError = new StatusError_1.StatusError('Unauthorized action', 401);
        return next(statusError);
    }
    try {
        fetch_1.default.deleteUser(req.user);
        (0, socket_1.emitSocket)('users', { action: 'delete', userId: req.user });
        return res.status(201).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        const statusError = new StatusError_1.StatusError('Error while fetching data', 500);
        return next(statusError);
    }
};
exports.deleteUser = deleteUser;
const createUser = (req, res, next) => {
    var _a;
    const { name, lastName, email, password } = req.body;
    const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    if (!image) {
        const statusError = new StatusError_1.StatusError('Missing image file', 422);
        return next(statusError);
    }
    if (!validAttributes(name, lastName, email, password, image)) {
        return res.status(400).json({
            message: 'Bad Request: Make sure all attributes and their types are OK',
            attributes: { name, lastName, email, password },
        });
    }
    try {
        if (fetch_1.default.getUserByEmail(email)) {
            const statusError = new StatusError_1.StatusError('User already registered', 409);
            return next(statusError);
        }
        const user = new User_1.User(name, lastName, email, password, image);
        fetch_1.default.createUser(user);
        (0, socket_1.emitSocket)('users', { action: 'register', userId: user.userId });
        return res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        const statusError = new StatusError_1.StatusError('Error while fetching data', 500);
        return next(statusError);
    }
};
exports.createUser = createUser;
const logInUser = (req, res, next) => {
    const { email, password } = req.body;
    if (!validAttributes('x', 'x', email, password, 'x')) {
        return res.status(400).json({
            message: 'Bad Request: Make sure all attributes and their types are OK',
            attributes: { email, password },
        });
    }
    try {
        const ok = fetch_1.default.existsUser(email, password);
        if (!ok) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }
        const { userId } = fetch_1.default.getUserByEmail(email);
        const token = sign({
            userId,
        }, 'toremsoftware', { expiresIn: '1h' });
        return res.status(201).json({ message: 'Logged In successfully', userId, token });
    }
    catch (error) {
        const statusError = new StatusError_1.StatusError('Error while fetching data', 500);
        return next(statusError);
    }
};
exports.logInUser = logInUser;
const validAttributes = (email, password, name, lastName, image) => {
    return (typeof email == 'string' &&
        typeof password == 'string' &&
        (name !== null && name !== void 0 ? name : typeof name == 'string') &&
        (lastName !== null && lastName !== void 0 ? lastName : typeof lastName == 'string') &&
        (image !== null && image !== void 0 ? image : typeof image == 'string'));
};
