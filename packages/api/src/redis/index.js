"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publisher = exports.cache = void 0;
var ioredis_1 = require("ioredis");
var publisher = new ioredis_1.default(process.env.REDIS);
exports.publisher = publisher;
var cache = new ioredis_1.default(process.env.REDIS);
exports.cache = cache;
