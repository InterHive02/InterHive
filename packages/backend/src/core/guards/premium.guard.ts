import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole, UserAccessLevel } from '@interhive/shared';

@Injectable()
export class PremiumGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // Administrative & enterprise roles have premium workspace access
    const elevatedRoles: string[] = [
      UserRole.ADMIN,
      UserRole.HR,
      UserRole.MANAGER,
      UserRole.COMPANY,
    ];

    if (elevatedRoles.includes(user.role)) {
      return true;
    }

    // Reject free students or basic access level
    if (
      user.role === UserRole.STUDENT ||
      user.accessLevel === 'BASIC' ||
      user.accessLevel === UserAccessLevel.BASIC
    ) {
      throw new ForbiddenException(
        'Premium access required. Only selected and active Premium Interns can access this feature.',
      );
    }

    // Allow active Premium Interns
    if (
      user.role === UserRole.INTERN &&
      (user.accessLevel === 'PREMIUM' || user.accessLevel === UserAccessLevel.PREMIUM)
    ) {
      return true;
    }

    throw new ForbiddenException(
      'Access denied. Premium Intern status is required.',
    );
  }
}
