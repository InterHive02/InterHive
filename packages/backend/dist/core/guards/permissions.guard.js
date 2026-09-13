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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
let PermissionsGuard = class PermissionsGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermissions) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            throw new common_1.ForbiddenException('No user found');
        }
        if (user.role === 'admin') {
            return true;
        }
        const userPermissions = this.getUserPermissions(user.role);
        const hasAllPermissions = requiredPermissions.every((permission) => userPermissions.includes(permission) || userPermissions.includes('*'));
        if (!hasAllPermissions) {
            throw new common_1.ForbiddenException(`Access denied. Required permissions: ${requiredPermissions.join(', ')}`);
        }
        return true;
    }
    getUserPermissions(role) {
        const permissionsMap = {
            admin: ['*'],
            hr: [
                'view_users',
                'manage_users',
                'view_interns',
                'manage_interns',
                'view_companies',
                'manage_companies',
                'view_assessments',
                'manage_assessments',
                'view_trainings',
                'manage_trainings',
                'view_reports',
                'manage_reports',
                'view_analytics',
            ],
            manager: [
                'view_users',
                'view_interns',
                'manage_team_interns',
                'view_projects',
                'manage_projects',
                'view_assessments',
                'evaluate_interns',
                'view_trainings',
                'manage_team_training',
                'view_reports',
                'view_team_reports',
            ],
            intern: [
                'view_profile',
                'update_profile',
                'view_assessments',
                'take_assessments',
                'view_trainings',
                'enroll_training',
                'view_projects',
                'submit_project',
                'view_opportunities',
                'apply_opportunities',
                'view_attendance',
                'manage_attendance',
                'view_communications',
                'send_messages',
            ],
            company: [
                'view_company_profile',
                'update_company_profile',
                'post_requirements',
                'view_applications',
                'review_applications',
                'view_matches',
                'schedule_interviews',
                'view_hire_interns',
                'view_analytics',
            ],
        };
        return permissionsMap[role] || [];
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], PermissionsGuard);
