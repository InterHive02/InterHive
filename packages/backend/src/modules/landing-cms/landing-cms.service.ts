import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEFAULT_LANDING_CMS_CONFIG, LandingPageConfig as ILandingConfig } from '@interhive/shared';
import { LandingPageConfig, LandingPageConfigDocument } from './schemas/landing-page-config.schema';
import { LandingPageRevision, LandingPageRevisionDocument } from './schemas/landing-page-revision.schema';
import { MediaAsset, MediaAssetDocument } from './schemas/media-asset.schema';

@Injectable()
export class LandingCmsService {
  private readonly logger = new Logger(LandingCmsService.name);

  constructor(
    @InjectModel(LandingPageConfig.name)
    private readonly configModel: Model<LandingPageConfigDocument>,
    @InjectModel(LandingPageRevision.name)
    private readonly revisionModel: Model<LandingPageRevisionDocument>,
    @InjectModel(MediaAsset.name)
    private readonly mediaModel: Model<MediaAssetDocument>,
  ) {}

  // ─────────────────── Ensure baseline seed rows exist ───────────────────
  async ensureBaseline(): Promise<void> {
    const published = await this.configModel.findOne({ type: 'published' });
    if (!published) {
      this.logger.log('Seeding initial published landing page CMS config...');
      await this.configModel.create({
        type: 'published',
        version: 1,
        isPublished: true,
        publishedAt: new Date(),
        publishedBy: 'system@interhive.in',
        lastEditedBy: 'System Seed',
        data: DEFAULT_LANDING_CMS_CONFIG,
      });
    }

    const draft = await this.configModel.findOne({ type: 'draft' });
    if (!draft) {
      this.logger.log('Seeding initial draft landing page CMS config...');
      await this.configModel.create({
        type: 'draft',
        version: 1,
        isPublished: false,
        lastEditedBy: 'System Seed',
        data: DEFAULT_LANDING_CMS_CONFIG,
      });
    }
  }

  // ─────────────────── Public: Fetch published landing config ───────────────────
  async getPublishedConfig(): Promise<ILandingConfig> {
    await this.ensureBaseline();
    const doc = await this.configModel.findOne({ type: 'published' }).lean();
    if (!doc || !doc.data) {
      return DEFAULT_LANDING_CMS_CONFIG;
    }
    return {
      ...doc.data,
      version: doc.version,
      isPublished: true,
      publishedAt: doc.publishedAt?.toISOString(),
      publishedBy: doc.publishedBy,
    };
  }

  // ─────────────────── Admin: Fetch draft config ───────────────────
  async getDraftConfig(): Promise<ILandingConfig> {
    await this.ensureBaseline();
    const doc = await this.configModel.findOne({ type: 'draft' }).lean();
    if (!doc || !doc.data) {
      return DEFAULT_LANDING_CMS_CONFIG;
    }
    return {
      ...doc.data,
      version: doc.version,
      isPublished: false,
      lastEditedBy: doc.lastEditedBy,
      updatedAt: (doc as any).updatedAt?.toISOString(),
    };
  }

  // ─────────────────── Admin: Save draft config ───────────────────
  async saveDraft(data: Partial<ILandingConfig>, editorEmail: string): Promise<ILandingConfig> {
    await this.ensureBaseline();
    let draft = await this.configModel.findOne({ type: 'draft' });
    if (!draft) {
      draft = new this.configModel({ type: 'draft', version: 1 });
    }

    // Merge or replace config payload safely
    draft.data = {
      ...(draft.data || DEFAULT_LANDING_CMS_CONFIG),
      ...data,
      updatedAt: new Date().toISOString(),
    };
    draft.lastEditedBy = editorEmail || 'admin';
    await draft.save();

    this.logger.log(`Landing page draft saved by ${editorEmail}`);
    return this.getDraftConfig();
  }

  // ─────────────────── Admin: Publish draft ───────────────────
  async publishDraft(publisherEmail: string, notes?: string): Promise<{ success: boolean; version: number; config: ILandingConfig }> {
    await this.ensureBaseline();
    const draft = await this.configModel.findOne({ type: 'draft' });
    if (!draft || !draft.data) {
      throw new BadRequestException('No draft found to publish.');
    }

    const currentPublished = await this.configModel.findOne({ type: 'published' });
    const nextVersion = (currentPublished?.version || draft.version || 1) + 1;

    const publishedPayload: ILandingConfig = {
      ...draft.data,
      version: nextVersion,
      isPublished: true,
      publishedAt: new Date().toISOString(),
      publishedBy: publisherEmail,
      lastEditedBy: publisherEmail,
    };

    // 1. Update published document
    if (currentPublished) {
      currentPublished.version = nextVersion;
      currentPublished.isPublished = true;
      currentPublished.publishedAt = new Date();
      currentPublished.publishedBy = publisherEmail;
      currentPublished.lastEditedBy = publisherEmail;
      currentPublished.data = publishedPayload;
      await currentPublished.save();
    } else {
      await this.configModel.create({
        type: 'published',
        version: nextVersion,
        isPublished: true,
        publishedAt: new Date(),
        publishedBy: publisherEmail,
        lastEditedBy: publisherEmail,
        data: publishedPayload,
      });
    }

    // 2. Also keep draft synchronized with version number
    draft.version = nextVersion;
    draft.data = publishedPayload;
    draft.lastEditedBy = publisherEmail;
    await draft.save();

    // 3. Save snapshot to revision history
    await this.revisionModel.create({
      version: nextVersion,
      publishedBy: publisherEmail,
      publishedAt: new Date(),
      notes: notes || `Published version ${nextVersion}`,
      config: publishedPayload,
    });

    this.logger.log(`Landing page v${nextVersion} published by ${publisherEmail}`);
    return { success: true, version: nextVersion, config: publishedPayload };
  }

  // ─────────────────── Admin: Get revisions ───────────────────
  async getRevisions(): Promise<any[]> {
    return this.revisionModel.find().sort({ version: -1 }).limit(30).lean();
  }

  // ─────────────────── Admin: Restore a revision ───────────────────
  async restoreRevision(revisionId: string, restorerEmail: string): Promise<ILandingConfig> {
    const revision = await this.revisionModel.findById(revisionId);
    if (!revision || !revision.config) {
      throw new NotFoundException('Revision not found.');
    }

    const currentPublished = await this.configModel.findOne({ type: 'published' });
    const nextVersion = (currentPublished?.version || revision.version) + 1;

    const restoredConfig: ILandingConfig = {
      ...revision.config,
      version: nextVersion,
      isPublished: true,
      publishedAt: new Date().toISOString(),
      publishedBy: restorerEmail,
      lastEditedBy: `Restored v${revision.version} by ${restorerEmail}`,
    };

    // Update published
    if (currentPublished) {
      currentPublished.version = nextVersion;
      currentPublished.publishedAt = new Date();
      currentPublished.publishedBy = restorerEmail;
      currentPublished.data = restoredConfig;
      await currentPublished.save();
    }

    // Update draft
    let draft = await this.configModel.findOne({ type: 'draft' });
    if (draft) {
      draft.version = nextVersion;
      draft.data = restoredConfig;
      draft.lastEditedBy = restorerEmail;
      await draft.save();
    }

    // Record new revision
    await this.revisionModel.create({
      version: nextVersion,
      publishedBy: restorerEmail,
      publishedAt: new Date(),
      notes: `Restored from revision v${revision.version}`,
      config: restoredConfig,
    });

    this.logger.log(`Landing page restored to v${revision.version} as new v${nextVersion} by ${restorerEmail}`);
    return restoredConfig;
  }

  // ─────────────────── Admin: Reset to default baseline ───────────────────
  async resetToDefaults(resetterEmail: string): Promise<ILandingConfig> {
    await this.ensureBaseline();
    const currentPublished = await this.configModel.findOne({ type: 'published' });
    const nextVersion = (currentPublished?.version || 1) + 1;

    const defaultConfig: ILandingConfig = {
      ...DEFAULT_LANDING_CMS_CONFIG,
      version: nextVersion,
      isPublished: true,
      publishedAt: new Date().toISOString(),
      publishedBy: resetterEmail,
      lastEditedBy: `Reset to defaults by ${resetterEmail}`,
    };

    if (currentPublished) {
      currentPublished.version = nextVersion;
      currentPublished.data = defaultConfig;
      currentPublished.publishedAt = new Date();
      currentPublished.publishedBy = resetterEmail;
      await currentPublished.save();
    }

    let draft = await this.configModel.findOne({ type: 'draft' });
    if (draft) {
      draft.version = nextVersion;
      draft.data = defaultConfig;
      draft.lastEditedBy = resetterEmail;
      await draft.save();
    }

    await this.revisionModel.create({
      version: nextVersion,
      publishedBy: resetterEmail,
      publishedAt: new Date(),
      notes: 'System reset to InterHive default code baseline',
      config: defaultConfig,
    });

    this.logger.log(`Landing page reset to codebase defaults by ${resetterEmail}`);
    return defaultConfig;
  }

  // ─────────────────── Media Library Management ───────────────────
  async uploadMedia(file: Express.Multer.File, altText: string, uploaderEmail?: string): Promise<MediaAssetDocument> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    // Convert file buffer to base64 data URL for cross-environment persistence
    const base64Data = file.buffer.toString('base64');
    const dataUrl = `data:${file.mimetype};base64,${base64Data}`;

    const asset = new this.mediaModel({
      filename: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
      originalName: file.originalname,
      url: dataUrl,
      mimeType: file.mimetype,
      size: file.size,
      altText: altText || file.originalname,
      uploadedBy: uploaderEmail || 'admin',
    });

    await asset.save();
    this.logger.log(`Media asset uploaded: ${asset.originalName} (${asset.size} bytes) by ${uploaderEmail}`);
    return asset;
  }

  async getMediaList(): Promise<any[]> {
    return this.mediaModel.find().sort({ createdAt: -1 }).limit(100).lean();
  }

  async deleteMedia(id: string): Promise<{ success: boolean; message: string }> {
    const asset = await this.mediaModel.findByIdAndDelete(id);
    if (!asset) {
      throw new NotFoundException('Media asset not found');
    }
    return { success: true, message: 'Media asset deleted successfully' };
  }
}
