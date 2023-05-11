"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChat =
  exports.sendMessage =
  exports.createChat =
  exports.getUserChats =
    void 0;
const fetch_1 = __importDefault(require("../database/fetch"));
const StatusError_1 = require("../types/StatusError");
const models_1 = require("../models");
const socket_1 = require("../socket");
const getUserChats = (req, res, next) => {
  if (!req.user) {
    const statusError = new StatusError_1.StatusError(
      "Unauthorized action",
      401
    );
    return next(statusError);
  }
  try {
    const chats = fetch_1.default.getUserChats(req.user);
    return res.status(200).json({ chats });
  } catch (error) {
    const statusError = new StatusError_1.StatusError(
      "Unauthorized action",
      401
    );
    return next(statusError);
  }
};
exports.getUserChats = getUserChats;
const createChat = (req, res, next) => {
  var _a;
  if (!req.user) {
    const statusError = new StatusError_1.StatusError(
      "Unauthorized action",
      401
    );
    return next(statusError);
  }
  const { name } = req.body;
  const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
  if (!name || !image) {
    const statusError = new StatusError_1.StatusError(
      "Chat requires a name and an image to be created",
      400
    );
    return next(statusError);
  }
  try {
    const chat = new models_1.Chat(name, image);
    fetch_1.default.createChat(req.user, chat);
    (0, socket_1.emitSocket)("chats", {
      action: "create",
      userId: req.user,
      chatId: chat.chatId,
    });
    return res.status(201).json({ message: "Chat created successfully" });
  } catch (error) {
    const statusError = new StatusError_1.StatusError(
      "Error while fetching data",
      500
    );
    return next(statusError);
  }
};
exports.createChat = createChat;
const sendMessage = (req, res, next) => {
  const { chatId } = req.params;
  if (!req.user) {
    const statusError = new StatusError_1.StatusError(
      "Unauthorized action",
      401
    );
    return next(statusError);
  }
  try {
    const chat = fetch_1.default.getUserChat(req.user, chatId);
    if (!chat) {
      const statusError = new StatusError_1.StatusError(
        "Could not find user chat",
        404
      );
      return next(statusError);
    }
    const { message } = req.body;
    if (!message) {
      const statusError = new StatusError_1.StatusError(
        "Must provide a message to send",
        400
      );
      return next(statusError);
    }
    const msg = new models_1.Message(message, false);
    fetch_1.default.sendMessage(req.user, chatId, msg);
    (0, socket_1.emitSocket)("chats", {
      action: "SentNewMessage",
      userId: req.user,
      chatId: chat.chatId,
    });
    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    const statusError = new StatusError_1.StatusError(
      "Error while fetching data",
      500
    );
    return next(statusError);
  } finally {
    setTimeout(() => sendReplyMessage(req.user, chatId), 5000);
  }
};
exports.sendMessage = sendMessage;
const deleteChat = (req, res, next) => {
  const { chatId } = req.params;
  if (!req.user) {
    const statusError = new StatusError_1.StatusError(
      "Unauthorized action",
      401
    );
    return next(statusError);
  }
  const chat = fetch_1.default.getUserChat(req.user, chatId);
  if (!chat) {
    const statusError = new StatusError_1.StatusError(
      "Could not find user chat",
      404
    );
    return next(statusError);
  }
  try {
    fetch_1.default.deleteChat(req.user, chatId);
    (0, socket_1.emitSocket)("chats", {
      action: "delete",
      userId: req.user,
      chatId: chat.chatId,
    });
    return res
      .status(201)
      .json({ message: "Chat history deleted successfully" });
  } catch (error) {
    const statusError = new StatusError_1.StatusError(
      "Error while fetching data",
      500
    );
    return next(statusError);
  }
};
exports.deleteChat = deleteChat;

const sendReplyMessage = (userId, chatId) => {
  try {
    randomChanceOfError();
    const chat = fetch_1.default.getUserChat(userId, chatId);
    if (chat) {
      const text = `Este es un mensaje de prueba! Deberías de recibir este mensaje luego de 5 segundos de haber enviado uno.`;
      const msg = new models_1.Message(text, true);
      fetch_1.default.sendMessage(userId, chatId, msg);
      (0, socket_1.emitSocket)("chats", {
        action: "ReceivedNewMessage",
        userId,
        chatId: chat.chatId,
      });
    }
  } catch (error) {
    (0, socket_1.emitSocket)("chats", {
      action: "error",
      error: "Could not fetch database while sending a reply message",
    });
  }
};
const randomChanceOfError = () => {
  const chance = randomIntFromInterval(1, 10);
  if (chance >= 8) {
    throw new Error();
  }
};
const randomIntFromInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
