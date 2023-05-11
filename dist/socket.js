"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitSocket = exports.getIO = exports.init = void 0;
const socket_io_1 = require("socket.io");
let io;
function init(httpServer) {
    io = new socket_io_1.Server(httpServer, {
        method: 'GET',
        cors: {
            origin: '*',
        },
    });
    return io;
}
exports.init = init;
function getIO() {
    if (!io) {
        throw new Error('Socket IO not defined!');
    }
    return io;
}
exports.getIO = getIO;
function emitSocket(type, params) {
    try {
        getIO().emit(type, params);
    }
    catch (error) {
        console.log(error);
    }
}
exports.emitSocket = emitSocket;
