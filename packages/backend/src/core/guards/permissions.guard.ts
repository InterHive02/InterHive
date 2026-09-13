import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Permission } from '@interhive/shared';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('No user found');
    }

    // Admin has all permissions
    if (user.role === 'admin') {
      return true;
    }

    const userPermissions = this.getUserPermissions(user.role);
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission) || userPermissions.includes('*')
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Access denied. Required permissions: ${requiredPermissions.join(', ')}`
      );
    }

    return true;
  }

  private getUserPermissions(role: string): string[] {
    const permissionsMap: Record<string, string[]> = {
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
}