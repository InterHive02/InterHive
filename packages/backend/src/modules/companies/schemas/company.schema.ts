import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CompanyStatus } from '@interhive/shared';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
  @Prop({
    type: {
      name: { type: String, required: true },
      legalName: { type: String, required: true },
      registrationNumber: { type: String, required: true, unique: true },
      industry: [{ type: String, required: true }],
      size: { type: Number },
      foundedYear: { type: Number },
      website: { type: String },
      description: { type: String },
      logo: { type: String },
      coverImage: { type: String },
    },
  })
  companyInfo: {
    name: string;
    legalName: string;
    registrationNumber: string;
    industry: string[];
    size?: number;
    foundedYear?: number;
    website?: string;
    description?: string;
    logo?: string;
    coverImage?: string;
  };

  @Prop({
    type: {
      primaryContact: {
        email: { type: String, required: true },
        phone: { type: String },
        address: {
          street: { type: String },
          city: { type: String },
          state: { type: String },
          country: { type: String },
          zipCode: { type: String },
        },
      },
      hrContact: {
        email: { type: String },
        phone: { type: String },
      },
      technicalContact: {
        email: { type: String },
        phone: { type: String },
      },
    },
  })
  contact: {
    primaryContact: {
      email: string;
      phone?: string;
      address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
      };
    };
    hrContact?: {
      email?: string;
      phone?: string;
    };
    technicalContact?: {
      email?: string;
      phone?: string;
    };
  };

  @Prop({
    type: String,
    enum: ['pending', 'verified', 'active', 'suspended', 'inactive'],
    default: 'pending',
  })
  status: CompanyStatus;

  @Prop({
    type: {
      plan: { type: String, enum: ['basic', 'premium', 'enterprise', 'custom'], default: 'basic' },
      tier: { type: Number, default: 1 },
      startDate: { type: Date },
      endDate: { type: Date },
      features: [{ type: String }],
      price: { type: Number },
      currency: { type: String, default: 'INR' },
      status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
      autoRenew: { type: Boolean, default: true },
    },
  })
  subscription: {
    plan: 'basic' | 'premium' | 'enterprise' | 'custom';
    tier: number;
    startDate?: Date;
    endDate?: Date;
    features: string[];
    price: number;
    currency: string;
    status: 'active' | 'expired' | 'cancelled';
    autoRenew: boolean;
  };

  @Prop({
    type: [{
      userId: { type: String },
      score: { type: Number },
      feedback: { type: String },
      categories: {
        communication: { type: Number },
        technicalSkills: { type: Number },
        professionalism: { type: Number },
        punctuality: { type: Number },
        initiative: { type: Number },
      },
      createdAt: { type: Date, default: Date.now },
    }],
  })
  ratings: {
    userId: string;
    score: number;
    feedback: string;
    categories: {
      communication: number;
      technicalSkills: number;
      professionalism: number;
      punctuality: number;
      initiative: number;
    };
    createdAt: Date;
  }[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);