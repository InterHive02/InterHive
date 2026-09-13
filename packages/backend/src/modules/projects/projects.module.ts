import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project, ProjectSchema } from './schemas/project.schema';
import { ProjectTask, ProjectTaskSchema } from './schemas/project-task.schema';
import { ProjectUpload, ProjectUploadSchema } from './schemas/project-upload.schema';
import { UsersModule } from '../users/users.module';
import { InternsModule } from '../interns/interns.module';
import { CompaniesModule } from '../companies/companies.module';
import { RedisModule } from '../../common/redis/redis.module';
import { MailModule } from '../../common/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: ProjectTask.name, schema: ProjectTaskSchema },
      { name: ProjectUpload.name, schema: ProjectUploadSchema },
    ]),
    UsersModule,
    InternsModule,
    CompaniesModule,
    RedisModule,
    MailModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}