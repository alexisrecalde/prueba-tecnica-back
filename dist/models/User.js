"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const uniqid_1 = __importDefault(require("uniqid"));
class User {
    constructor(name, lastName, email, password, image) {
        this.userId = (0, uniqid_1.default)();
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.image = image;
        this.chats = [];
    }
}
exports.User = User;
