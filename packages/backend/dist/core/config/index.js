"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailConfig = exports.cloudflareConfig = exports.redisConfig = exports.jwtConfig = exports.databaseConfig = void 0;
const database_config_1 = __importDefault(require("./database.config"));
exports.databaseConfig = database_config_1.default;
const jwt_config_1 = __importDefault(require("./jwt.config"));
exports.jwtConfig = jwt_config_1.default;
const redis_config_1 = __importDefault(require("./redis.config"));
exports.redisConfig = redis_config_1.default;
const cloudflare_config_1 = __importDefault(require("./cloudflare.config"));
exports.cloudflareConfig = cloudflare_config_1.default;
const mail_config_1 = __importDefault(require("./mail.config"));
exports.mailConfig = mail_config_1.default;
exports.default = [
    database_config_1.default,
    jwt_config_1.default,
    redis_config_1.default,
    cloudflare_config_1.default,
    mail_config_1.default,
];
