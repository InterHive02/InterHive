import { Logger as NestLogger } from '@nestjs/common';

export const logger = {
  setContext: (ctx: any) => {},
  log: (msg: any, ...args: any[]) => NestLogger.log(msg, ...args),
  error: (msg: any, ...args: any[]) => NestLogger.error(msg, ...args),
  warn: (msg: any, ...args: any[]) => NestLogger.warn(msg, ...args),
  debug: (msg: any, ...args: any[]) => NestLogger.debug(msg, ...args),
};
