import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { MatchingService } from './matching.service';
import { MatchRequestDto } from './dto/match-request.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { UserRole } from '@interhive/shared';
import { User } from '../users/schemas/user.schema';

@ApiTags('Matching')
@Controller('matching')
@ApiBearerAuth()
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post('find-matches')
  @ApiOperation({ summary: 'Find matches for an intern or company' })
  @ApiResponse({ status: 200, description: 'Matches found successfully' })
  async findMatches(
    @CurrentUser() user: User,
    @Body() matchRequestDto: MatchRequestDto,
  ) {
    return this.matchingService.findMatches(user.id, matchRequestDto);
  }

  @Get('my-matches')
  @ApiOperation({ summary: 'Get all matches for current user' })
  @ApiResponse({ status: 200, description: 'Matches retrieved successfully' })
  async getMyMatches(
    @CurrentUser() user: User,
    @Query('status') status?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.matchingService.getMyMatches(user.id, status, page, limit);
  }

  @Get('stats/overview')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Get matching statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats() {
    return this.matchingService.getStats();
  }

  @Post('batch-match')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Batch match multiple interns to a requirement' })
  @ApiResponse({ status: 200, description: 'Batch matching completed' })
  async batchMatch(
    @Body('requirementId') requirementId: string,
    @Body('internIds') internIds: string[],
  ) {
    return this.matchingService.batchMatch(requirementId, internIds);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get match by ID' })
  @ApiResponse({ status: 200, description: 'Match retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async getMatch(@Param('id') id: string) {
    return this.matchingService.getMatch(id);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Accept a match' })
  @ApiResponse({ status: 200, description: 'Match accepted successfully' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async acceptMatch(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    return this.matchingService.acceptMatch(user.id, id);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject a match' })
  @ApiResponse({ status: 200, description: 'Match rejected successfully' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async rejectMatch(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    return this.matchingService.rejectMatch(user.id, id);
  }

  @Post(':id/schedule-interview')
  @ApiOperation({ summary: 'Schedule interview for a match' })
  @ApiResponse({ status: 200, description: 'Interview scheduled successfully' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async scheduleInterview(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body('interviewDate') interviewDate: Date,
    @Body('interviewType') interviewType: string,
    @Body('meetingLink') meetingLink?: string,
  ) {
    return this.matchingService.scheduleInterview(
      user.id,
      id,
      interviewDate,
      interviewType,
      meetingLink,
    );
  }

  @Post(':id/offer')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Make an offer for a match' })
  @ApiResponse({ status: 200, description: 'Offer made successfully' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async makeOffer(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() offerData: any,
  ) {
    return this.matchingService.makeOffer(user.id, id, offerData);
  }

  @Post(':id/hire')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Hire intern from match' })
  @ApiResponse({ status: 200, description: 'Hired successfully' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async hireIntern(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    return this.matchingService.hireIntern(user.id, id);
  }
}