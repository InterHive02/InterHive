import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    this.logger.log(
      `↗️ ${method} ${url} - ${ip} - ${userAgent} - Started`
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const duration = Date.now() - startTime;
          this.logger.log(
            `✅ ${method} ${url} - ${response.statusCode} - ${duration}ms - Completed`
          );
        },
        error: (error) => {
          const response = context.switchToHttp().getResponse();
          const duration = Date.now() - startTime;
          this.logger.error(
            `❌ ${method} ${url} - ${response.statusCode} - ${duration}ms - Error: ${error.message}`
          );
        },
      })
    );
  }
}