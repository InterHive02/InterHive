import React, { useState, useEffect } from 'react';
import {
  Tag,
  IndianRupee,
  BadgePercent,
  TrendingUp,
  Percent,
  Calendar,
  Users,
  Search,
  Filter,
  Download,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Edit2,
  Trash2,
  Pause,
  Play,
  RotateCcw,
  FileText,
  DollarSign,
  BarChart3,
  Layers,
  Sparkles,
  HelpCircle,
  Check,
  X,
  CreditCard,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { pricingApi } from '../../../api/endpoints/pricing-revenue.api';
import {
  ProgramPricingItem,
  CouponItem,
  DiscountCampaignItem,
  OrderItem,
  RefundItem,
  RevenueAnalyticsOverview,
} from '@interhive/shared';

type PricingTab = 'overview' | 'programs' | 'coupons' | 'campaigns' | 'transactions' | 'refunds';

export const AdminPricingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PricingTab>('overview');
  const [loading, setLoading] = useState(false);

  // Data States
  const [overview, setOverview] = useState<RevenueAnalyticsOverview | null>(null);
  const [programs, setPrograms] = useState<ProgramPricingItem[]>([]);
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [campaigns, setCampaigns] = useState<DiscountCampaignItem[]>([]);
  const [transactions, setTransactions] = useState<OrderItem[]>([]);
  const [refunds, setRefunds] = useState<RefundItem[]>([]);

  // Filters
  const [txSearch, setTxSearch] = useState('');
  const [txStatusFilter, setTxStatusFilter] = useState('ALL');
  const [txProgramFilter, setTxProgramFilter] = useState('ALL');

  // Modals
  const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<ProgramPricingItem | null>(null);
  const [editPriceForm, setEditPriceForm] = useState({
    originalPrice: 0,
    promotionalPrice: 0,
    taxPercentage: 18,
    taxIncluded: false,
    changeReason: '',
  });

  const [isCreateCouponModalOpen, setIsCreateCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    discountValue: 10,
    maxDiscountAmount: 2000,
    minOrderValue: 2000,
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
    totalUsageLimit: 200,
    perUserLimit: 1,
    allowStacking: false,
    firstTimeOnly: false,
  });

  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    description: '',
    campaignType: 'CUSTOM' as const,
    discountType: 'PERCENTAGE' as const,
    discountValue: 15,
    maxDiscount: 3000,
    minOrderValue: 3000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    budgetCap: 50000,
  });

  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundForm, setRefundForm] = useState({
    orderId: '',
    amount: 0,
    reason: '',
  });

  // Load Data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [ovRes, progRes, cpnRes, cmpRes, txRes, rfndRes] = await Promise.all([
        pricingApi.getRevenueOverview().catch(() => ({ success: false, data: null })),
        pricingApi.getAdminPrograms().catch(() => ({ success: false, data: [] })),
        pricingApi.getAdminCoupons().catch(() => ({ success: false, data: [] })),
        pricingApi.getAdminCampaigns().catch(() => ({ success: false, data: [] })),
        pricingApi.getTransactions().catch(() => ({ success: false, data: [] })),
        pricingApi.getRefunds().catch(() => ({ success: false, data: [] })),
      ]);

      if (ovRes.data) setOverview(ovRes.data);
      if (progRes.data) setPrograms(progRes.data);
      if (cpnRes.data) setCoupons(cpnRes.data);
      if (cmpRes.data) setCampaigns(cmpRes.data);
      if (txRes.data) setTransactions(txRes.data);
      if (rfndRes.data) setRefunds(rfndRes.data);
    } catch (err) {
      console.error('Failed to load pricing data:', err);
      toast.error('Failed to fetch pricing records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Program Price Update
  const handleOpenEditPrice = (prog: ProgramPricingItem) => {
    setSelectedProgram(prog);
    setEditPriceForm({
      originalPrice: prog.originalPrice,
      promotionalPrice: prog.promotionalPrice,
      taxPercentage: prog.taxPercentage,
      taxIncluded: prog.taxIncluded,
      changeReason: '',
    });
    setIsEditPriceModalOpen(true);
  };

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) return;

    try {
      await pricingApi.updateProgramPricing(selectedProgram.id, editPriceForm);
      toast.success(`Updated pricing for ${selectedProgram.title}`);
      setIsEditPriceModalOpen(false);
      loadAllData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update pricing.');
    }
  };

  const handleToggleProgramActive = async (prog: ProgramPricingItem) => {
    try {
      await pricingApi.toggleProgramActive(prog.id, !prog.isActive);
      toast.success(`${prog.title} is now ${!prog.isActive ? 'Active' : 'Inactive'}`);
      loadAllData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to toggle status.');
    }
  };

  // Coupon Handlers
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pricingApi.createCoupon(couponForm);
      toast.success(`Coupon ${couponForm.code.toUpperCase()} created successfully!`);
      setIsCreateCouponModalOpen(false);
      setCouponForm({
        code: '',
        name: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        maxDiscountAmount: 2000,
        minOrderValue: 2000,
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
        totalUsageLimit: 200,
        perUserLimit: 1,
        allowStacking: false,
        firstTimeOnly: false,
      });
      loadAllData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create coupon.');
    }
  };

  const handleTogglePauseCoupon = async (cpn: CouponItem) => {
    try {
      await pricingApi.togglePauseCoupon(cpn.id, !cpn.isPaused);
      toast.success(`Coupon ${cpn.code} is now ${!cpn.isPaused ? 'Paused' : 'Active'}`);
      loadAllData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to toggle coupon.');
    }
  };

  const handleDeleteCoupon = async (cpn: CouponItem) => {
    if (!window.confirm(`Are you sure you want to delete or deactivate coupon "${cpn.code}"?`)) return;
    try {
      const res = await pricingApi.deleteCoupon(cpn.id);
      toast.success(res.message);
      loadAllData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete coupon.');
    }
  };

  // Campaign Handlers
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pricingApi.createCampaign(campaignForm);
      toast.success(`Campaign ${campaignForm.name} created!`);
      setIsCreateCampaignModalOpen(false);
      loadAllData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create campaign.');
    }
  };

  // Refund Handlers
  const handleCreateRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pricingApi.createRefund(refundForm);
      toast.success('Refund request registered.');
      setIsRefundModalOpen(false);
      setRefundForm({ orderId: '', amount: 0, reason: '' });
      loadAllData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create refund request.');
    }
  };

  const handleApproveRefund = async (refundId: string) => {
    if (!window.confirm('Approve and process this refund through the gateway?')) return;
    try {
      await pricingApi.approveRefund(refundId);
      toast.success('Refund processed successfully.');
      loadAllData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to approve refund.');
    }
  };

  const handleRejectRefund = async (refundId: string) => {
    const reason = window.prompt('Enter reason for rejecting this refund:');
    if (!reason) return;
    try {
      await pricingApi.rejectRefund(refundId, reason);
      toast.success('Refund rejected.');
      loadAllData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reject refund.');
    }
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    if (txStatusFilter !== 'ALL' && t.status !== txStatusFilter) return false;
    if (txProgramFilter !== 'ALL' && t.programKey !== txProgramFilter) return false;
    if (txSearch.trim()) {
      const q = txSearch.toLowerCase();
      const match =
        t.orderNumber?.toLowerCase().includes(q) ||
        t.studentName?.toLowerCase().includes(q) ||
        t.studentEmail?.toLowerCase().includes(q) ||
        t.couponCode?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#2D3347] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/40">
              Revenue & Monetization
            </span>
            <span className="text-xs text-slate-400 font-medium">Razorpay Gateway Integration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Pricing, Discounts & Revenue Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Control program prices, automated launch discounts, coupon codes, student referrals, transactions, and refunds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={pricingApi.getExportCsvUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#1A1D27] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#2D3347] text-xs font-bold shadow-xs transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </a>
          <button
            type="button"
            onClick={loadAllData}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
            title="Refresh records"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-[#2D3347] pb-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Revenue Overview', icon: BarChart3 },
          { id: 'programs', label: 'Program Pricing', icon: Tag, count: programs.length },
          { id: 'coupons', label: 'Coupon Codes', icon: BadgePercent, count: coupons.length },
          { id: 'campaigns', label: 'Campaigns', icon: Sparkles, count: campaigns.length },
          { id: 'transactions', label: 'Transactions Ledger', icon: FileText, count: transactions.length },
          { id: 'refunds', label: 'Refunds', icon: RotateCcw, count: refunds.filter((r) => r.status === 'PENDING').length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as PricingTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─────────────────── TAB 1: REVENUE OVERVIEW ─────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1D27] border border-slate-200 dark:border-[#2D3347] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <IndianRupee className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                ₹{(overview?.totalRevenue || 0).toLocaleString('en-IN')}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <span className="text-emerald-600 font-bold">Net: ₹{(overview?.netRevenue || 0).toLocaleString('en-IN')}</span>
                <span>after refunds</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1D27] border border-slate-200 dark:border-[#2D3347] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Order Value</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                ₹{(overview?.grossOrderValue || 0).toLocaleString('en-IN')}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Total discounts given: ₹{(overview?.totalDiscounts || 0).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1D27] border border-slate-200 dark:border-[#2D3347] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Paid Enrollments</span>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {overview?.paidOrders || 0}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                {overview?.pendingOrders || 0} pending checkout orders
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1D27] border border-slate-200 dark:border-[#2D3347] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Order Value</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                ₹{(overview?.averageOrderValue || 0).toLocaleString('en-IN')}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Total refunds processed: ₹{(overview?.totalRefunds || 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Program Breakdown & Monthly Chart Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Program Revenue Breakdown */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-[#1A1D27] border border-slate-200 dark:border-[#2D3347] shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Revenue by Program Track
              </h4>
              <div className="space-y-3">
                {overview?.programBreakdown && overview.programBreakdown.length > 0 ? (
                  overview.programBreakdown.map((item) => {
                    const percent =
                      overview.totalRevenue > 0 ? Math.round((item.revenue / overview.totalRevenue) * 100) : 0;
                    return (
                      <div key={item.programKey} className="p-3 rounded-xl bg-slate-50 dark:bg-[#12151E] border border-slate-200/60 dark:border-[#2D3347]/60 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-800 dark:text-slate-200">{item.title}</span>
                          <span className="text-emerald-600">₹{item.revenue.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{item.orderCount} paid students</span>
                          <span>{percent}% of revenue</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">No program revenue recorded yet.</p>
                )}
              </div>
            </div>

            {/* Active Coupon Performance */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-[#1A1D27] border border-slate-200 dark:border-[#2D3347] shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Top Performing Coupons
              </h4>
              <div className="space-y-2.5">
                {overview?.couponPerformance && overview.couponPerformance.length > 0 ? (
                  overview.couponPerformance.map((c) => (
                    <div
                      key={c.code}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#12151E] border border-slate-200/60 dark:border-[#2D3347]/60 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md font-mono font-black bg-blue-100 text-blue-800 border border-blue-200">
                          {c.code}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">{c.usageCount} redemptions</span>
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        ₹{c.discountTotal.toLocaleString('en-IN')} saved
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">No coupon redemption data yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────── TAB 2: PROGRAM PRICING ─────────────────── */}
      {activeTab === 'programs' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Configure original base prices, promotional rates, GST taxes, and installment payment structures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#1A1D27] border border-slate-200 dark:border-[#2D3347] shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-400 transition"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        prog.isActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {prog.isActive ? 'Active for Sale' : 'Disabled'}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">v{prog.pricingVersion}</span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{prog.title}</h3>
                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{prog.duration}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">{prog.description}</p>

                  {/* Price Box */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#12151E] border border-slate-200 dark:border-[#2D3347] flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Launch Price</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        ₹{prog.promotionalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Original</span>
                      <span className="text-sm font-semibold text-slate-400 line-through">
                        ₹{prog.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Tax & Installments info */}
                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div className="flex justify-between">
                      <span>GST Tax:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {prog.taxPercentage}% ({prog.taxIncluded ? 'Included' : 'Added at checkout'})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Plans:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {prog.paymentPlans?.length || 1} options available
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditPrice(prog)}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Pricing</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleProgramActive(prog)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      prog.isActive
                        ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                        : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    {prog.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────── TAB 3: COUPONS ─────────────────── */}
      {activeTab === 'coupons' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Create, edit, pause, and track redemption limits for student promotional coupon codes.
            </p>
            <button
              type="button"
              onClick={() => setIsCreateCouponModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Coupon</span>
            </button>
          </div>

          <div className="bg-white dark:bg-[#1A1D27] rounded-2xl border border-slate-200 dark:border-[#2D3347] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#12151E] text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-[#2D3347]">
                  <tr>
                    <th className="p-4">Coupon Code</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4">Limits (Used / Max)</th>
                    <th className="p-4">Validity</th>
                    <th className="p-4">Stacking</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {coupons.map((cpn) => {
                    const isExpired = new Date(cpn.expiryDate) < new Date();
                    return (
                      <tr key={cpn.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                        <td className="p-4">
                          <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded border border-blue-200/60">
                            {cpn.code}
                          </span>
                          <span className="block text-[11px] text-slate-500 mt-1 font-medium">{cpn.name}</span>
                        </td>
                        <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                          {cpn.discountType === 'PERCENTAGE' ? `${cpn.discountValue}%` : `₹${cpn.discountValue}`}
                          {cpn.maxDiscountAmount > 0 && (
                            <span className="block text-[10px] text-slate-400 font-normal">
                              Cap: ₹{cpn.maxDiscountAmount}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {cpn.usedCount} / {cpn.totalUsageLimit}
                          </span>
                          <span className="block text-[10px] text-slate-400">Max {cpn.perUserLimit} per student</span>
                        </td>
                        <td className="p-4 text-slate-500">
                          <span>{new Date(cpn.startDate).toLocaleDateString()}</span>
                          <span className="text-slate-300 mx-1">→</span>
                          <span className={isExpired ? 'text-rose-500 font-bold' : ''}>
                            {new Date(cpn.expiryDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              cpn.allowStacking ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {cpn.allowStacking ? 'Allowed' : 'No Stacking'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              isExpired
                                ? 'bg-rose-100 text-rose-800'
                                : cpn.isPaused
                                ? 'bg-amber-100 text-amber-800'
                                : cpn.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isExpired ? 'Expired' : cpn.isPaused ? 'Paused' : cpn.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleTogglePauseCoupon(cpn)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                            title={cpn.isPaused ? 'Resume Coupon' : 'Pause Coupon'}
                          >
                            {cpn.isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-amber-600" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCoupon(cpn)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition cursor-pointer"
                            title="Delete or Deactivate Coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────── TAB 4: CAMPAIGNS ─────────────────── */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Automatic promotional discounts (Early Bird, First Batch Launch, Festival) evaluated during checkout.
            </p>
            <button
              type="button"
              onClick={() => setIsCreateCampaignModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaigns.map((cmp) => (
              <div
                key={cmp.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#1A1D27] border border-slate-200 dark:border-[#2D3347] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                    {cmp.campaignType}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cmp.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cmp.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white">{cmp.name}</h4>
                <p className="text-xs text-slate-500">{cmp.description || 'Promotional launch offer'}</p>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#12151E] border border-slate-200 dark:border-[#2D3347] flex justify-between text-xs font-bold">
                  <span>Discount:</span>
                  <span className="text-emerald-600">
                    {cmp.discountType === 'PERCENTAGE' ? `${cmp.discountValue}%` : `₹${cmp.discountValue}`}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Budget Spend:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      ₹{cmp.currentSpend.toLocaleString('en-IN')} / ₹{cmp.budgetCap.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Validity:</span>
                    <span>
                      {new Date(cmp.startDate).toLocaleDateString()} – {new Date(cmp.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────── TAB 5: TRANSACTIONS LEDGER ─────────────────── */}
      {activeTab === 'transactions' && (
        <div className="space-y-4 animate-fade-in">
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1D27] border border-slate-200 dark:border-[#2D3347] shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by order number, student name, email, coupon..."
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                className="w-full bg-transparent border-0 text-xs focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={txStatusFilter}
                onChange={(e) => setTxStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#2D3347] bg-white dark:bg-[#12151E] text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">All Statuses</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="REFUNDED">Refunded</option>
              </select>

              <select
                value={txProgramFilter}
                onChange={(e) => setTxProgramFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#2D3347] bg-white dark:bg-[#12151E] text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">All Programs</option>
                <option value="ONE_YEAR">1-Year Program</option>
                <option value="TWO_YEAR">2-Year Program</option>
                <option value="THREE_YEAR">3-Year Program</option>
                <option value="FOUR_YEAR">4-Year Program</option>
                <option value="PPO">PPO Program</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white dark:bg-[#1A1D27] rounded-2xl border border-slate-200 dark:border-[#2D3347] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#12151E] text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-[#2D3347]">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Student</th>
                    <th className="p-4">Program</th>
                    <th className="p-4">Original</th>
                    <th className="p-4">Discounts</th>
                    <th className="p-4">Final Paid</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTransactions.map((tx) => {
                    const discountTotal =
                      (tx.automaticDiscount || 0) + (tx.couponDiscount || 0) + (tx.referralDiscount || 0);
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                        <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">{tx.orderNumber}</td>
                        <td className="p-4">
                          <span className="font-bold text-slate-900 dark:text-white block">{tx.studentName}</span>
                          <span className="text-[11px] text-slate-400">{tx.studentEmail}</span>
                        </td>
                        <td className="p-4 font-semibold text-slate-800 dark:text-slate-300">
                          <span>{tx.programTitle}</span>
                          <span className="block text-[10px] text-slate-400">{tx.paymentPlan} Plan</span>
                        </td>
                        <td className="p-4 text-slate-500">₹{tx.originalPrice?.toLocaleString('en-IN')}</td>
                        <td className="p-4 text-emerald-600 font-medium">
                          -₹{discountTotal.toLocaleString('en-IN')}
                          {tx.couponCode && (
                            <span className="block text-[10px] text-slate-400 font-mono">[{tx.couponCode}]</span>
                          )}
                        </td>
                        <td className="p-4 font-black text-slate-900 dark:text-white">
                          ₹{tx.finalPayableAmount?.toLocaleString('en-IN')}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              tx.status === 'PAID'
                                ? 'bg-emerald-100 text-emerald-800'
                                : tx.status === 'REFUNDED'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 whitespace-nowrap">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────── TAB 6: REFUNDS ─────────────────── */}
      {activeTab === 'refunds' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Manage refund requests, verify payments, approve gateway refunds, or reject with recorded reasons.
            </p>
            <button
              type="button"
              onClick={() => setIsRefundModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Record Refund Request</span>
            </button>
          </div>

          <div className="bg-white dark:bg-[#1A1D27] rounded-2xl border border-slate-200 dark:border-[#2D3347] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#12151E] text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-[#2D3347]">
                <tr>
                  <th className="p-4">Refund #</th>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Processed At</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {refunds.map((rf) => (
                  <tr key={rf.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">{rf.refundNumber}</td>
                    <td className="p-4 font-mono text-slate-500">{rf.orderId}</td>
                    <td className="p-4 font-black text-slate-900 dark:text-white">₹{rf.amount?.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-slate-600 max-w-xs truncate">{rf.reason}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          rf.status === 'PROCESSED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rf.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rf.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {rf.processedAt ? new Date(rf.processedAt).toLocaleDateString() : 'Pending'}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {rf.status === 'PENDING' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApproveRefund(rf.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectRefund(rf.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────── MODAL: EDIT PROGRAM PRICING ─────────────────── */}
      {isEditPriceModalOpen && selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1A1D27] border border-slate-200 dark:border-[#2D3347] rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Edit Pricing — {selectedProgram.title}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditPriceModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePrice} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editPriceForm.originalPrice}
                    onChange={(e) => setEditPriceForm({ ...editPriceForm, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2D3347] bg-white dark:bg-[#12151E] text-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Launch / Promotional (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editPriceForm.promotionalPrice}
                    onChange={(e) => setEditPriceForm({ ...editPriceForm, promotionalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2D3347] bg-white dark:bg-[#12151E] text-xs font-bold text-emerald-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    GST Tax Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editPriceForm.taxPercentage}
                    onChange={(e) => setEditPriceForm({ ...editPriceForm, taxPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2D3347] bg-white dark:bg-[#12151E] text-xs font-semibold"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="taxIncluded"
                    checked={editPriceForm.taxIncluded}
                    onChange={(e) => setEditPriceForm({ ...editPriceForm, taxIncluded: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <label htmlFor="taxIncluded" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Tax Already Included
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Reason for Price Adjustment (Audit Trail)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Approved launch cohort discount for Batch 2027"
                  value={editPriceForm.changeReason}
                  onChange={(e) => setEditPriceForm({ ...editPriceForm, changeReason: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2D3347] bg-white dark:bg-[#12151E] text-xs"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditPriceModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  Save Price Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────── MODAL: CREATE COUPON ─────────────────── */}
      {isCreateCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1A1D27] border border-slate-200 dark:border-[#2D3347] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Create New Coupon Code</h3>
              <button
                type="button"
                onClick={() => setIsCreateCouponModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Coupon Code</label>
                  <input
                    type="text"
                    placeholder="e.g. SUMMER25"
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2D3347] bg-white dark:bg-[#12151E] text-xs font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Coupon Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Special 25%"
                    value={couponForm.name}
                    onChange={(e) => setCouponForm({ ...couponForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2D3347] bg-white dark:bg-[#12151E] text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2D3347] bg-white dark:bg-[#12151E] text-xs font-semibold"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Value</label>
                  <input
                    type="number"
                    min="1"
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2D3347] bg-white dark:bg-[#12151E] text-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={couponForm.maxDiscountAmount}
                    onChange={(e) => setCouponForm({ ...couponForm, maxDiscountAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2D3347] bg-white dark:bg-[#12151E] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={couponForm.minOrderValue}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2D3347] bg-white dark:bg-[#12151E] text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Total Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={couponForm.totalUsageLimit}
                    onChange={(e) => setCouponForm({ ...couponForm, totalUsageLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2D3347] bg-white dark:bg-[#12151E] text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={couponForm.startDate}
                    onChange={(e) => setCouponForm({ ...couponForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2D3347] bg-white dark:bg-[#12151E] text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={couponForm.expiryDate}
                    onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2D3347] bg-white dark:bg-[#12151E] text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={couponForm.allowStacking}
                    onChange={(e) => setCouponForm({ ...couponForm, allowStacking: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Allow Stacking with Automatic Campaigns</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateCouponModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────── MODAL: CREATE REFUND REQUEST ─────────────────── */}
      {isRefundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1A1D27] border border-slate-200 dark:border-[#2D3347] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Record Refund Request</h3>
              <button
                type="button"
                onClick={() => setIsRefundModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRefund} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Order ID</label>
                <input
                  type="text"
                  placeholder="Paste Order ID or select from transactions"
                  value={refundForm.orderId}
                  onChange={(e) => setRefundForm({ ...refundForm, orderId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2D3347] bg-white dark:bg-[#12151E] text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Refund Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  value={refundForm.amount}
                  onChange={(e) => setRefundForm({ ...refundForm, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2D3347] bg-white dark:bg-[#12151E] text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Reason for Refund
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain why the student is requesting a refund..."
                  value={refundForm.reason}
                  onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#2D3347] bg-white dark:bg-[#12151E] text-xs"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRefundModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
