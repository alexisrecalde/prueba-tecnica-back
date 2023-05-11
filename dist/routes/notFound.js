"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notFound_1 = require("../controllers/notFound");
const router = (0, express_1.Router)();
router.use('/', notFound_1.notFound);
exports.default = router;
