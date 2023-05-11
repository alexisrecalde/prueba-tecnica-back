"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importStar(require("multer"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const uniqid_1 = __importDefault(require("uniqid"));
const cors_1 = __importDefault(require("cors"));
const socket_1 = require("./socket");
const user_1 = __importDefault(require("./routes/user"));
const chat_1 = __importDefault(require("./routes/chat"));
const notFound_1 = __importDefault(require("./routes/notFound"));
const app = (0, express_1.default)();
const options = {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
    credentials: true,
    origin: '*',
    preflightContinue: false,
};
app.use((0, cors_1.default)(options));
const fileStorage = (0, multer_1.diskStorage)({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        callback(null, `${(0, uniqid_1.default)()}-${file.originalname}`);
    },
});
const fileFilter = (req, file, callback) => {
    let ok = /^image\/(png|jpg|jpeg)/.test(file.mimetype);
    callback(null, ok);
};
app.use(body_parser_1.default.json());
app.use((0, multer_1.default)({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express_1.default.static(path_1.default.join(__dirname, '..', 'images')));
app.use(user_1.default);
app.use(chat_1.default);
app.use(notFound_1.default);
app.use((error, req, res, next) => {
    var _a;
    const statusError = error;
    const status = (_a = statusError.status) !== null && _a !== void 0 ? _a : 500;
    const message = statusError.message;
    return res.status(status).json({ message });
});
const port = 8080;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
    const io = (0, socket_1.init)(server);
    io.on('connection', () => {
        console.log('Client connected!');
    });
});
