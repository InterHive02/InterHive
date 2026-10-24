import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
  issuer: string;
  audience: string;
}

export default registerAs('jwt', (): JwtConfig => {
  const isProduction = process.env.NODE_ENV === 'production';
  const defaultSecret = 'interhive-secret-key';
  const defaultRefreshSecret = 'interhive-refresh-secret-key';

  const secret = process.env.JWT_SECRET || defaultSecret;
  const refreshSecret = process.env.JWT_REFRESH_SECRET || defaultRefreshSecret;

  if (isProduction && (secret === defaultSecret || secret.length < 32)) {
    throw new Error(
      'CRITICAL SECURITY CONFIGURATION ERROR: JWT_SECRET must be set to a cryptographically secure key of at least 32 characters in production.',
    );
  }

  if (isProduction && (refreshSecret === defaultRefreshSecret || refreshSecret.length < 32)) {
    throw new Error(
      'CRITICAL SECURITY CONFIGURATION ERROR: JWT_REFRESH_SECRET must be set to a cryptographically secure key of at least 32 characters in production.',
    );
  }

  return {
    secret,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshSecret,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    issuer: process.env.JWT_ISSUER || 'interhive',
    audience: process.env.JWT_AUDIENCE || 'interhive-users',
  };
});