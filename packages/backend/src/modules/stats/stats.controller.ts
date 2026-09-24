import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { Public } from '../../core/decorators/public.decorator';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get live platform statistics' })
  @ApiResponse({ status: 200, description: 'Live platform statistics' })
  async getStats() {
    const data = await this.statsService.getPublicStats();
    return {
      success: true,
      data,
    };
  }

  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Get live platform statistics (alias)' })
  @ApiResponse({ status: 200, description: 'Live platform statistics' })
  async getPublicStats() {
    const data = await this.statsService.getPublicStats();
    return {
      success: true,
      data,
    };
  }
}
