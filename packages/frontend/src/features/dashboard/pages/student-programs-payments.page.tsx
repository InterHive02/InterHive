import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  CreditCard,
  Download,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Gift,
  GraduationCap,
  Receipt
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../api/hooks/use-auth';
import { pricingApi } from '../../../api/endpoints/pricing-revenue.api';
import { PROGRAM_CONFIGS, ProgramTypeKey } from '@interhive/shared';
import type { OrderItem, ReferralInfo } from '@interhive/shared';

export const StudentProgramsPaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Active Program from user profile or fallback
  const userProgramKey = ((user as any)?.programType || 'PPO').toUpperCase();
  const programConfig = (PROGRAM_CONFIGS as any)[userProgramKey] || PROGRAM_CONFIGS.PPO;
  const isPremium = (user as any)?.accessLevel === 'premium' || orders.some((o) => o.status === 'PAID');

  useEffect(() => {
    let isMounted = true;
    const loadStudentData = async () => {
      try {
        setIsLoading(true);
        const [ordersRes, refRes] = await Promise.allSettled([
          pricingApi.getMyOrders(),
          pricingApi.getMyReferralInfo(),
        ]);

        if (isMounted) {
          if (ordersRes.status === 'fulfilled' && ordersRes.value.data) {
            setOrders(ordersRes.value.data);
          }
          if (refRes.status === 'fulfilled' && refRes.value.data) {
            setReferralInfo(refRes.value.data);
          }
        }
      } catch (err) {
        console.warn('Could not load orders / referral info', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadStudentData();
    return () => {
      isMounted = false;
    };
  }, []);

  const referralCode = referralInfo?.referralCode || `IH${(user?.firstName || 'STUDENT').toUpperCase().slice(0, 5)}${Math.floor(100 + Math.random() * 900)}`;
  const referralLink = `${window.location.origin}/checkout/${userProgramKey}?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    toast.success('Referral code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey! Check out InterHive's Industry Readiness & PPO Program. Use my referral code ${referralCode} to get an instant ₹500 discount on enrollment: ${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-[#2D3347]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              My Programs &amp; Payments
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isPremium
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
              }`}
            >
              {isPremium ? 'PREMIUM ACCESS' : 'EXPLORER ACCESS'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage your program enrollment, payment transactions, official invoices, and referral rewards.
          </p>
        </div>

        <Link
          to={`/checkout/${userProgramKey}`}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          <span>Checkout / Upgrade Program</span>
        </Link>
      </div>

      {/* Grid: Program Status & Referral Wallet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* CURRENT PROGRAM ENROLLMENT CARD (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#12151E] border border-slate-200 dark:border-[#2D3347] rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <GraduationCap className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Enrolled Program
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {programConfig.title}
                </h3>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
              {programConfig.badge}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {programConfig.shortDescription}
          </p>

          {/* If PPO Program, highlight the 2-phase architecture */}
          {userProgramKey === 'PPO' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-emerald-500/10 border border-blue-500/20 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-700 dark:text-blue-300">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>PPO Journey Architecture</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/70 dark:bg-[#181B26]/80 border border-slate-200/80 dark:border-[#2D3347]">
                  <span className="font-bold text-blue-600 dark:text-blue-400 block text-[11px]">Phase 1 (Month 1–2)</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5">2 Months Training &amp; Readiness at InterHive Platform</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/70 dark:bg-[#181B26]/80 border border-slate-200/80 dark:border-[#2D3347]">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block text-[11px]">Phase 2 (Month 3–8)</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5">6 Months Corporate Internship at Partner Company</p>
                </div>
              </div>
            </div>
          )}

          {/* Key Milestones */}
          <div className="pt-2 border-t border-slate-200/80 dark:border-[#2D3347] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Duration: <strong className="text-slate-900 dark:text-white">{programConfig.duration}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Target: <strong className="text-slate-900 dark:text-white">{programConfig.summaryTarget}</strong></span>
            </div>
          </div>
        </div>

        {/* REFERRAL REWARDS CARD (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#12151E] border border-slate-200 dark:border-[#2D3347] rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#2D3347]">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                <Gift className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Student Referral Center
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Refer &amp; Earn Rewards
                </h3>
              </div>
            </div>

            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              ₹300 / Referral
            </span>
          </div>

          {/* Referral Stats Banner */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#181B26] border border-slate-200 dark:border-[#2D3347] text-center">
              <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                ₹{referralInfo?.walletBalance || 0}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">
                Wallet Reward Credit
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#181B26] border border-slate-200 dark:border-[#2D3347] text-center">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {referralInfo?.referralsCount || 0}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">
                Friends Enrolled
              </span>
            </div>
          </div>

          {/* Referral Code & Copy Link */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Your Unique Referral Code
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono font-bold text-sm tracking-wide text-slate-800 dark:text-slate-200">
                {referralCode}
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-purple-600" />
              <span>{copiedLink ? 'Link Copied' : 'Share Link'}</span>
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>WhatsApp</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed text-center">
            Friends get an instant <strong>₹500 discount</strong> using your code. You receive <strong>₹300 wallet reward</strong> credited upon their enrollment!
          </p>
        </div>

      </div>

      {/* ORDERS & PAYMENT RECEIPTS TABLE */}
      <div className="bg-white dark:bg-[#12151E] border border-slate-200 dark:border-[#2D3347] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#2D3347]">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-600" />
              <span>Payment History &amp; Official Invoices</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Download tax invoices and view payment breakdown for your records.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {orders.length} Transaction{orders.length === 1 ? '' : 's'}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <CreditCard className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No orders found yet
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When you enroll in any industry-readiness program, your transaction ledger and downloadable GST invoices will be accessible here.
            </p>
            <Link
              to={`/checkout/${userProgramKey}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs"
            >
              <span>Browse Programs &amp; Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-y border-slate-200 dark:border-[#2D3347]">
                <tr>
                  <th className="py-3 px-4">Order / Invoice #</th>
                  <th className="py-3 px-4">Program</th>
                  <th className="py-3 px-4">Plan Type</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#2D3347]/60">
                {orders.map((order) => (
                  <tr key={order.id || (order as any)._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {order.orderNumber || (order as any)._id?.slice(-8).toUpperCase() || 'ORD-TXN'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {(PROGRAM_CONFIGS as any)[order.programKey]?.title || order.programTitle || order.programKey}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px]">
                        {order.paymentPlan === 'INSTALLMENT' ? 'Installment' : 'One-Time'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      ₹{order.finalPayableAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : order.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer inline-flex items-center gap-1"
                        title="Download Invoice"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
