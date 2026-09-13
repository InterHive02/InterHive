"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunicationModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const communication_controller_1 = require("./communication.controller");
const communication_service_1 = require("./communication.service");
const chat_schema_1 = require("./schemas/chat.schema");
const message_schema_1 = require("./schemas/message.schema");
const announcement_schema_1 = require("./schemas/announcement.schema");
const chat_gateway_1 = require("./gateways/chat.gateway");
const users_module_1 = require("../users/users.module");
const auth_module_1 = require("../auth/auth.module");
const redis_module_1 = require("../../common/redis/redis.module");
const user_schema_1 = require("../users/schemas/user.schema");
let CommunicationModule = class CommunicationModule {
};
exports.CommunicationModule = CommunicationModule;
exports.CommunicationModule = CommunicationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: chat_schema_1.Chat.name, schema: chat_schema_1.ChatSchema },
                { name: message_schema_1.Message.name, schema: message_schema_1.MessageSchema },
                { name: announcement_schema_1.Announcement.name, schema: announcement_schema_1.AnnouncementSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            redis_module_1.RedisModule,
        ],
        controllers: [communication_controller_1.CommunicationController],
        providers: [communication_service_1.CommunicationService, chat_gateway_1.ChatGateway],
        exports: [communication_service_1.CommunicationService, chat_gateway_1.ChatGateway],
    })
], CommunicationModule);
