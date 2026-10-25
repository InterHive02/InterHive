import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial, TestimonialDocument } from './schemas/testimonial.schema';
import { Partner, PartnerDocument } from './schemas/partner.schema';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Testimonial.name)
    private readonly testimonialModel: Model<TestimonialDocument>,
    @InjectModel(Partner.name)
    private readonly partnerModel: Model<PartnerDocument>,
  ) {}

  // ─────────────────── Public Testimonials ───────────────────

  async getPublishedTestimonials(): Promise<Testimonial[]> {
    return this.testimonialModel
      .find({ isPublished: true })
      .sort({ order: 1, createdAt: -1 })
      .lean()
      .exec();
  }

  // ─────────────────── Admin Testimonials CRUD ───────────────────

  async getAllTestimonials(): Promise<Testimonial[]> {
    return this.testimonialModel
      .find()
      .sort({ order: 1, createdAt: -1 })
      .lean()
      .exec();
  }

  async createTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
    const created = new this.testimonialModel(data);
    return created.save();
  }

  async updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial> {
    const updated = await this.testimonialModel
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec();
    if (!updated) throw new NotFoundException('Testimonial not found');
    return updated;
  }

  async deleteTestimonial(id: string): Promise<{ success: boolean }> {
    const res = await this.testimonialModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Testimonial not found');
    return { success: true };
  }

  // ─────────────────── Public Partners ───────────────────

  async getActivePartners(): Promise<Partner[]> {
    return this.partnerModel
      .find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean()
      .exec();
  }

  // ─────────────────── Admin Partners CRUD ───────────────────

  async getAllPartners(): Promise<Partner[]> {
    return this.partnerModel
      .find()
      .sort({ order: 1, createdAt: -1 })
      .lean()
      .exec();
  }

  async createPartner(data: Partial<Partner>): Promise<Partner> {
    const created = new this.partnerModel(data);
    return created.save();
  }

  async updatePartner(id: string, data: Partial<Partner>): Promise<Partner> {
    const updated = await this.partnerModel
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec();
    if (!updated) throw new NotFoundException('Partner company not found');
    return updated;
  }

  async deletePartner(id: string): Promise<{ success: boolean }> {
    const res = await this.partnerModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Partner company not found');
    return { success: true };
  }
}
