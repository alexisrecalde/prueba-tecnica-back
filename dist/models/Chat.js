"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const uniqid_1 = __importDefault(require("uniqid"));
class Chat {
    constructor(name, image) {
        this.chatId = (0, uniqid_1.default)();
        this.name = name;
        this.image = image;
        this.messages = [];
    }
}
exports.Chat = Chat;
