"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const uniqid_1 = __importDefault(require("uniqid"));
class Message {
    constructor(message, received) {
        this.messageId = (0, uniqid_1.default)();
        this.message = message;
        this.timeDate = new Date().toISOString();
        this.received = received;
    }
}
exports.Message = Message;
