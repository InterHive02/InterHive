"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const matching_service_1 = require("./matching.service");
const match_request_dto_1 = require("./dto/match-request.dto");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const current_user_decorator_1 = require("../../core/decorators/current-user.decorator");
const shared_1 = require("@interhive/shared");
const user_schema_1 = require("../users/schemas/user.schema");
let MatchingController = class MatchingController {
    constructor(matchingService) {
        this.matchingService = matchingService;
    }
    async findMatches(user, matchRequestDto) {
        return this.matchingService.findMatches(user.id, matchRequestDto);
    }
    async getMyMatches(user, status, page = 1, limit = 10) {
        return this.matchingService.getMyMatches(user.id, status, page, limit);
    }
    async getMatch(id) {
        return this.matchingService.getMatch(id);
    }
    async acceptMatch(user, id) {
        return this.matchingService.acceptMatch(user.id, id);
    }
    async rejectMatch(user, id) {
        return this.matchingService.rejectMatch(user.id, id);
    }
    async scheduleInterview(user, id, interviewDate, interviewType, meetingLink) {
        return this.matchingService.scheduleInterview(user.id, id, interviewDate, interviewType, meetingLink);
    }
    async makeOffer(user, id, offerData) {
        return this.matchingService.makeOffer(user.id, id, offerData);
    }
    async hireIntern(user, id) {
        return this.matchingService.hireIntern(user.id, id);
    }
    async getStats() {
        return this.matchingService.getStats();
    }
    async batchMatch(requirementId, internIds) {
        return this.matchingService.batchMatch(requirementId, internIds);
    }
};
exports.MatchingController = MatchingController;
__decorate([
    (0, common_1.Post)('find-matches'),
    (0, swagger_1.ApiOperation)({ summary: 'Find matches for an intern or company' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Matches found successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User,
        match_request_dto_1.MatchRequestDto]),
    __metadata("design:returntype", Promise)
], MatchingController.prototype, "findMatches", null);
__decorate([
    (0, common_1.Get)('my-matches'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all matches for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Matches retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, Number, Number]),
    __metadata("design:returntype", Promise)
], MatchingController.prototype, "getMyMatches", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get match by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Match retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Match not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchingController.prototype, "getMatch", null);
__decorate([
    (0, common_1.Post)(':id/accept'),
    (0, swagger_1.ApiOperation)({ summary: 'Accept a match' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Match accepted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Match not found' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], MatchingController.prototype, "acceptMatch", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a match' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Match rejected successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Match not found' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], MatchingController.prototype, "rejectMatch", null);
__decorate([
    (0, common_1.Post)(':id/schedule-interview'),
    (0, swagger_1.ApiOperation)({ summary: 'Schedule interview for a match' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Interview scheduled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Match not found' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('interviewDate')),
    __param(3, (0, common_1.Body)('interviewType')),
    __param(4, (0, common_1.Body)('meetingLink')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, Date, String, String]),
    __metadata("design:returntype", Promise)
], MatchingController.prototype, "scheduleInterview", null);
__decorate([
    (0, common_1.Post)(':id/offer'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Make an offer for a match' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Offer made successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Match not found' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, Object]),
    __metadata("design:returntype", Promise)
], MatchingController.prototype, "makeOffer", null);
__decorate([
    (0, common_1.Post)(':id/hire'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Hire intern from match' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hired successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Match not found' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], MatchingController.prototype, "hireIntern", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get matching statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MatchingController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('batch-match'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Batch match multiple interns to a requirement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Batch matching completed' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)('requirementId')),
    __param(1, (0, common_1.Body)('internIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], MatchingController.prototype, "batchMatch", null);
exports.MatchingController = MatchingController = __decorate([
    (0, swagger_1.ApiTags)('Matching'),
    (0, common_1.Controller)('matching'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [matching_service_1.MatchingService])
], MatchingController);
