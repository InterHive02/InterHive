import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlatformStatDocument = PlatformStat & Document;

@Schema({ timestamps: true })
export class PlatformStat {
  /** Unique identifier for each stat entry — only one row per key */
  @Prop({ required: true, unique: true, trim: true })
  key: string;

  /** Display label shown on the landing page (e.g. "Students Trained") */
  @Prop({ required: true, trim: true })
  label: string;

  /**
   * The numeric value. Admin can override this manually.
   * If null, the system falls back to the live computed value from DB.
   */
  @Prop({ type: Number, default: null })
  manualValue: number | null;

  /** Optional suffix displayed after the number (e.g. "+", "%+") */
  @Prop({ default: '+' })
  suffix: string;

  /**
   * Whether the stat is currently set to show the manual value (true)
   * or the live computed value from the database (false).
   */
  @Prop({ default: false })
  useManualValue: boolean;

  /** Last time the admin manually set a value */
  @Prop({ type: Date, default: null })
  lastManualEditAt: Date | null;

  /** Which admin email performed the last manual edit */
  @Prop({ default: null })
  lastEditedBy: string | null;

  /** Display order on landing page (lower = first) */
  @Prop({ default: 0 })
  order: number;

  /** Icon identifier hint for the frontend */
  @Prop({ default: 'users' })
  icon: string;
}

export const PlatformStatSchema = SchemaFactory.createForClass(PlatformStat);
