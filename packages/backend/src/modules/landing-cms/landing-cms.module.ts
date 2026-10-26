import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LandingCmsController } from './landing-cms.controller';
import { LandingCmsService } from './landing-cms.service';
import { LandingPageConfig, LandingPageConfigSchema } from './schemas/landing-page-config.schema';
import { LandingPageRevision, LandingPageRevisionSchema } from './schemas/landing-page-revision.schema';
import { MediaAsset, MediaAssetSchema } from './schemas/media-asset.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LandingPageConfig.name, schema: LandingPageConfigSchema },
      { name: LandingPageRevision.name, schema: LandingPageRevisionSchema },
      { name: MediaAsset.name, schema: MediaAssetSchema },
    ]),
  ],
  controllers: [LandingCmsController],
  providers: [LandingCmsService],
  exports: [LandingCmsService],
})
export class LandingCmsModule {}
