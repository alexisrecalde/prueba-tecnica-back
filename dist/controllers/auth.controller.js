"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const StatusError_1 = require("../types/StatusError");
const { verify } = jsonwebtoken_1.default;
const isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const statusError = new StatusError_1.StatusError(
      "Unauthorized action",
      401
    );
    return next(statusError);
  }
  let decodedToken;
  try {
    const token = authHeader.split(" ")[1];
    decodedToken = verify(token, "toremsoftware");
  } catch (error) {
    const statusError = new StatusError_1.StatusError(
      "Unauthorized action",
      401
    );
    return next(statusError);
  }
  if (!decodedToken) {
    const statusError = new StatusError_1.StatusError(
      "Unauthorized action",
      401
    );
    return next(statusError);
  }
  req.user = decodedToken.userId;
  next();
};
exports.isAuth = isAuth;
