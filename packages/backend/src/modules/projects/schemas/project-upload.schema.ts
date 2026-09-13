import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectUploadDocument = ProjectUpload & Document;

@Schema({ timestamps: true })
export class ProjectUpload {
  @Prop({
    type: Types.ObjectId,
    ref: 'Project',
    required: true,
  })
  projectId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'ProjectTask',
  })
  taskId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  uploadedBy: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  fileName: string;

  @Prop({
    type: Number,
    required: true,
  })
  fileSize: number;

  @Prop({
    type: String,
    required: true,
  })
  fileType: string;

  @Prop({
    type: String,
    required: true,
  })
  fileUrl: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  uploadDate: Date;

  @Prop({
    type: String,
    enum: ['draft', 'submitted', 'reviewed', 'approved', 'rejected'],
    default: 'draft',
  })
  status: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'rejected';

  @Prop({
    type: String,
  })
  feedback: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  reviewedBy: Types.ObjectId;

  @Prop({
    type: Date,
  })
  reviewedAt: Date;
}

export const ProjectUploadSchema = SchemaFactory.createForClass(ProjectUpload);