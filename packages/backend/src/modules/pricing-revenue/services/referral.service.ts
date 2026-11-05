import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Referral, ReferralDocument } from '../schemas/referral.schema';

@Injectable()
export class ReferralService {
  constructor(@InjectModel(Referral.name) private readonly referralModel: Model<ReferralDocument>) {}

  async getOrCreateStudentReferral(studentId: string, studentName: string): Promise<Referral> {
    let referral = await this.referralModel.findOne({ studentId }).exec();
    if (!referral) {
      // Generate clean memorable code: e.g. "IH" + first 4 letters of name + 3 random digits
      const sanitizedName = (studentName || 'STUDENT')
        .replace(/[^a-zA-Z]/g, '')
        .toUpperCase()
        .slice(0, 4);
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const generatedCode = `IH${sanitizedName}${randomSuffix}`;

      referral = await this.referralModel.create({
        studentId,
        referralCode: generatedCode,
        walletBalance: 0,
        totalEarned: 0,
        referralsCount: 0,
        rewardPerReferral: 300,
        studentDiscountAmount: 500,
        history: [],
      });
    }
    return referral;
  }

  async validateReferralCode(code: string, studentId?: string) {
    const normalizedCode = code.trim().toUpperCase();
    const referral = await this.referralModel.findOne({ referralCode: normalizedCode }).exec();

    if (!referral) {
      throw new BadRequestException('Invalid referral code.');
    }

    if (studentId && referral.studentId === studentId) {
      throw new BadRequestException('Self-referrals are not permitted. Please share your code with peers.');
    }

    return {
      isValid: true,
      referralCode: referral.referralCode,
      discountAmount: referral.studentDiscountAmount || 500,
      referrerStudentId: referral.studentId,
    };
  }

  async creditReferralReward(referralCode: string, referredStudentId: string, referredStudentName: string, orderId: string) {
    const referral = await this.referralModel.findOne({ referralCode: referralCode.toUpperCase() }).exec();
    if (!referral) return;

    const reward = referral.rewardPerReferral || 300;
    const historyItem = {
      id: `ref_rew_${Date.now()}`,
      referredStudentId,
      referredStudentName,
      rewardAmount: reward,
      orderId,
      date: new Date(),
      status: 'CREDITED' as const,
    };

    await this.referralModel.findByIdAndUpdate(referral._id, {
      $inc: {
        walletBalance: reward,
        totalEarned: reward,
        referralsCount: 1,
      },
      $push: { history: historyItem },
    });
  }

  async getStudentReferralInfo(studentId: string, studentName = 'Student') {
    const ref = await this.getOrCreateStudentReferral(studentId, studentName);
    return {
      referralCode: ref.referralCode,
      walletBalance: ref.walletBalance,
      totalEarned: ref.totalEarned,
      referralsCount: ref.referralsCount,
      rewardPerReferral: ref.rewardPerReferral,
      studentDiscountAmount: ref.studentDiscountAmount,
      history: ref.history || [],
    };
  }
}
