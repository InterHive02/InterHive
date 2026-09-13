import databaseConfig, { DatabaseConfig } from './database.config';
import jwtConfig, { JwtConfig } from './jwt.config';
import redisConfig, { RedisConfig } from './redis.config';
import cloudflareConfig, { CloudflareConfig } from './cloudflare.config';
import mailConfig, { MailConfig } from './mail.config';

export {
  databaseConfig,
  jwtConfig,
  redisConfig,
  cloudflareConfig,
  mailConfig,
  DatabaseConfig,
  JwtConfig,
  RedisConfig,
  CloudflareConfig,
  MailConfig,
};

export default [
  databaseConfig,
  jwtConfig,
  redisConfig,
  cloudflareConfig,
  mailConfig,
];
