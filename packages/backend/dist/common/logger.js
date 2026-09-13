"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const common_1 = require("@nestjs/common");
exports.logger = {
    setContext: (ctx) => { },
    log: (msg, ...args) => common_1.Logger.log(msg, ...args),
    error: (msg, ...args) => common_1.Logger.error(msg, ...args),
    warn: (msg, ...args) => common_1.Logger.warn(msg, ...args),
    debug: (msg, ...args) => common_1.Logger.debug(msg, ...args),
};
