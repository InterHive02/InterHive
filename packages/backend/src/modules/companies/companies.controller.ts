import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateCompanyRequirementDto } from './dto/company-requirement.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { Public } from '../../core/decorators/public.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { UserRole } from '@interhive/shared';
import { User } from '../users/schemas/user.schema';

@ApiTags('Companies')
@Controller('companies')
@ApiBearerAuth()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Public()
  @Post('inquiry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit company inquiry' })
  @ApiResponse({ status: 200, description: 'Inquiry submitted successfully' })
  async sendInquiry(
    @Body() body: {
      companyName: string;
      contactPerson: string;
      email: string;
      phone: string;
      techStack?: string;
      internCount?: string;
      message?: string;
    },
  ) {
    return this.companiesService.sendCompanyInquiry(body);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Create company' })
  @ApiResponse({ status: 201, description: 'Company created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Company already exists' })
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  @ApiResponse({ status: 200, description: 'Companies retrieved successfully' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('industry') industry?: string,
    @Query('status') status?: string,
  ) {
    return this.companiesService.findAll({ page, limit, search, industry, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiResponse({ status: 200, description: 'Company retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async findById(@Param('id') id: string) {
    return this.companiesService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Update company' })
  @ApiResponse({ status: 200, description: 'Company updated successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async update(@Param('id') id: string, @Body() updateCompanyDto: any) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete company' })
  @ApiResponse({ status: 204, description: 'Company deleted successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async delete(@Param('id') id: string) {
    await this.companiesService.delete(id);
  }

  // Company Requirements
  @Post(':id/requirements')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Create company requirement' })
  @ApiResponse({ status: 201, description: 'Requirement created successfully' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async createRequirement(
    @Param('id') companyId: string,
    @Body() createRequirementDto: CreateCompanyRequirementDto,
  ) {
    return this.companiesService.createRequirement(companyId, createRequirementDto);
  }

  @Get(':id/requirements')
  @ApiOperation({ summary: 'Get company requirements' })
  @ApiResponse({ status: 200, description: 'Requirements retrieved successfully' })
  async getRequirements(
    @Param('id') companyId: string,
    @Query('status') status?: string,
  ) {
    return this.companiesService.getRequirements(companyId, status);
  }

  @Put('requirements/:requirementId')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Update company requirement' })
  @ApiResponse({ status: 200, description: 'Requirement updated successfully' })
  @ApiResponse({ status: 404, description: 'Requirement not found' })
  async updateRequirement(
    @Param('requirementId') requirementId: string,
    @Body() updateRequirementDto: any,
  ) {
    return this.companiesService.updateRequirement(requirementId, updateRequirementDto);
  }

  @Delete('requirements/:requirementId')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete company requirement' })
  @ApiResponse({ status: 204, description: 'Requirement deleted successfully' })
  @ApiResponse({ status: 404, description: 'Requirement not found' })
  async deleteRequirement(@Param('requirementId') requirementId: string) {
    await this.companiesService.deleteRequirement(requirementId);
  }

  // Matching
  @Get(':id/matches')
  @ApiOperation({ summary: 'Get matched interns for company' })
  @ApiResponse({ status: 200, description: 'Matches retrieved successfully' })
  async getMatches(
    @Param('id') companyId: string,
    @Query('requirementId') requirementId?: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.companiesService.getMatches(companyId, requirementId, limit);
  }

  // Collaboration
  @Post(':id/onboard')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Onboard company' })
  @ApiResponse({ status: 200, description: 'Company onboarded successfully' })
  async onboard(@Param('id') companyId: string) {
    return this.companiesService.onboard(companyId);
  }

  @Get('stats/overview')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Get company statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats() {
    return this.companiesService.getStats();
  }
}