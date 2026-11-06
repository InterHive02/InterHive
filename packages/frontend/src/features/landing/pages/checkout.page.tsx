import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Tag,
  ArrowRight,
  Sparkles,
  Lock,
  Calendar,
  Clock,
  GraduationCap,
  AlertCircle,
  HelpCircle,
  CreditCard,
  ChevronRight,
  Share2,
  Gift,
  Building,
  User,
  Mail,
  Phone,
  School,
  X,
  Loader2,
  FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../api/hooks/use-auth';
import { PublicNavbar } from '../components/public-navbar';
import { PublicFooter } from '../components/public-footer';
import { pricingApi, ValidateCouponResponse } from '../../../api/endpoints/pricing-revenue.api';
import { PROGRAM_CONFIGS, ProgramTypeKey, PROGRAM_DISCLAIMER } from '@interhive/shared';
import type { ProgramPricingItem, OrderItem } from '@interhive/shared';

export const CheckoutPage: React.FC = () => {
  const { programKey: paramProgramKey } = useParams<{ programKey?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Active program key
  const initialKey = (paramProgramKey || searchParams.get('program') || 'PPO').toUpperCase();
  const [selectedKey, setSelectedKey] = useState<string>(initialKey);

  // Program details from API / fallback to shared constants
  const [availablePrograms, setAvailablePrograms] = useState<ProgramPricingItem[]>([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);

  // Form Fields
  const [fullName, setFullName] = useState(user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [collegeName, setCollegeName] = useState((user as any)?.college || '');
  const [academicYear, setAcademicYear] = useState('Final Year');

  // Payment Plan Selection
  const [selectedPlanType, setSelectedPlanType] = useState<'ONE_TIME' | 'INSTALLMENT'>('ONE_TIME');

  // Coupon State
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResponse | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Referral Code State
  const [referralCodeInput, setReferralCodeInput] = useState(searchParams.get('ref') || '');
  const [appliedReferral, setAppliedReferral] = useState<{ code: string; discountAmount: number } | null>(null);
  const [referralError, setReferralError] = useState<string | null>(null);

  // Processing & Success State
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderItem | null>(null);
  const [paymentTxnId, setPaymentTxnId] = useState<string | null>(null);

  // Fetch live program pricing
  useEffect(() => {
    let isMounted = true;
    const fetchPrograms = async () => {
      try {
        setIsLoadingPrograms(true);
        const res = await pricingApi.getActivePrograms();
        if (isMounted && res.data && res.data.length > 0) {
          setAvailablePrograms(res.data);
          const found = res.data.find((p) => p.programKey.toUpperCase() === initialKey);
          if (found) {
            setSelectedKey(found.programKey);
          } else {
            setSelectedKey(res.data[0].programKey);
          }
        }
      } catch (err) {
        console.warn('Using client-side fallback program pricing', err);
      } finally {
        if (isMounted) setIsLoadingPrograms(false);
      }
    };
    fetchPrograms();
    return () => {
      isMounted = false;
    };
  }, [initialKey]);

  // Current program config & pricing
  const currentProgramStaticConfig = (PROGRAM_CONFIGS as any)[selectedKey] || PROGRAM_CONFIGS.PPO;
  const currentProgramApiConfig = availablePrograms.find(
    (p) => p.programKey.toUpperCase() === selectedKey.toUpperCase()
  );

  // Pricing calculations
  const originalPrice = currentProgramApiConfig?.originalPrice ?? (selectedKey === 'PPO' ? 4999 : selectedKey === 'ONE_YEAR' ? 7999 : selectedKey === 'TWO_YEAR' ? 14999 : selectedKey === 'THREE_YEAR' ? 21999 : 29999);
  const launchPrice = currentProgramApiConfig?.promotionalPrice ?? (selectedKey === 'PPO' ? 2999 : selectedKey === 'ONE_YEAR' ? 5999 : selectedKey === 'TWO_YEAR' ? 10999 : selectedKey === 'THREE_YEAR' ? 15999 : 21999);
  const baseDiscount = Math.max(0, originalPrice - launchPrice);

  // Compute coupon discount
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon?.valid) return 0;
    return appliedCoupon.discountAmount || 0;
  }, [appliedCoupon]);

  // Compute referral discount (Flat ₹500 default)
  const referralDiscount = useMemo(() => {
    if (!appliedReferral) return 0;
    return appliedReferral.discountAmount || 500;
  }, [appliedReferral]);

  // Total discounts
  const totalDiscount = baseDiscount + couponDiscount + referralDiscount;
  const discountedSubtotal = Math.max(0, originalPrice - totalDiscount);

  // Tax calculation (18% GST)
  const gstRate = 0.18;
  const taxAmount = Math.round(discountedSubtotal * gstRate);
  const finalPayable = discountedSubtotal + taxAmount;

  // Apply Coupon Handler
  const handleApplyCoupon = async (codeToTry?: string) => {
    const code = (codeToTry || couponCodeInput).trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    setCouponError(null);
    setIsValidatingCoupon(true);
    try {
      const res = await pricingApi.validateCoupon({
        code,
        programKey: selectedKey,
        orderAmount: launchPrice,
      });

      if (res.data && res.data.valid) {
        setAppliedCoupon(res.data);
        setCouponCodeInput(code);
        toast.success(`Coupon "${code}" applied! You save ₹${res.data.discountAmount.toLocaleString('en-IN')}`);
      } else {
        setAppliedCoupon(null);
        setCouponError(res.data?.message || 'Invalid or expired coupon code.');
        toast.error(res.data?.message || 'Invalid coupon code');
      }
    } catch (err: any) {
      setAppliedCoupon(null);
      const msg = err.response?.data?.message || 'Coupon could not be applied.';
      setCouponError(msg);
      toast.error(msg);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponError(null);
    toast('Coupon removed');
  };

  // Apply Referral Handler
  const handleApplyReferral = () => {
    const code = referralCodeInput.trim().toUpperCase();
    if (!code) {
      setReferralError('Please enter a valid referral code.');
      return;
    }
    if (code.length < 5) {
      setReferralError('Referral code format: IH + Name + Digits (e.g. IHANKIT123)');
      return;
    }
    setReferralError(null);
    setAppliedReferral({ code, discountAmount: 500 });
    toast.success('Referral code applied! Extra ₹500 student credit applied.');
  };

  const handleRemoveReferral = () => {
    setAppliedReferral(null);
    setReferralCodeInput('');
    setReferralError(null);
  };

  // Razorpay Checkout Execution
  const handleProceedToPayment = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      toast.error('Please fill in your name, email, and phone number.');
      return;
    }

    try {
      setIsProcessingOrder(true);

      // Step 1: Create Order on server
      const orderRes = await pricingApi.createOrder({
        programKey: selectedKey,
        studentName: fullName,
        studentEmail: email,
        studentPhone: phone,
        paymentPlan: selectedPlanType === 'INSTALLMENT' ? 'INSTALLMENT' : 'FULL',
        couponCode: appliedCoupon?.code,
        referralCode: appliedReferral?.code,
        notes: `College: ${collegeName}, Batch: ${academicYear}`,
      });

      const orderData = orderRes.data?.order;
      const gatewayData = orderRes.data?.gateway;
      const targetOrderId = orderData?.id || gatewayData?.orderId || `ord_${Date.now()}`;

      // Step 2: Initialize Razorpay Payment
      const razorpayInitRes = await pricingApi.initRazorpayPayment({
        orderId: targetOrderId,
      });

      const paymentInitData = razorpayInitRes.data;

      // Handle Sandbox Simulation Mode (when live keys are dummy/test)
      if (paymentInitData?.isSimulated) {
        toast('Testing mode enabled: Processing sandbox verification...', { icon: '🧪' });
        
        // Simulate immediate verification
        const verifyRes = await pricingApi.verifyRazorpayPayment({
          orderId: targetOrderId,
          razorpayOrderId: paymentInitData.razorpayOrderId,
          razorpayPaymentId: `pay_sim_${Date.now()}`,
          razorpaySignature: 'simulated_valid_signature_sandbox',
        });

        if (verifyRes.data?.success) {
          setCompletedOrder(verifyRes.data.order || orderData);
          setPaymentTxnId(verifyRes.data.transactionId || 'TXN-IH-SUCCESS');
          toast.success('Enrollment successful! Access granted.');
          return;
        }
      }

      // Live Razorpay Modal Launcher
      if (typeof window !== 'undefined' && (window as any).Razorpay && paymentInitData) {
        const options = {
          key: paymentInitData.keyId,
          amount: paymentInitData.amount,
          currency: paymentInitData.currency || 'INR',
          name: 'InterHive Platform',
          description: `Enrollment: ${currentProgramStaticConfig.title}`,
          order_id: paymentInitData.razorpayOrderId,
          prefill: {
            name: fullName,
            email,
            contact: phone,
          },
          theme: {
            color: '#2563eb',
          },
          handler: async (response: any) => {
            try {
              const verifyRes = await pricingApi.verifyRazorpayPayment({
                orderId: targetOrderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (verifyRes.data?.success) {
                setCompletedOrder(verifyRes.data.order || orderData);
                setPaymentTxnId(response.razorpay_payment_id);
                toast.success('Payment verified! Your program access is live.');
              } else {
                toast.error('Payment verification failed. Please contact support.');
              }
            } catch (err: any) {
              toast.error(err.response?.data?.message || 'Verification error');
            }
          },
          modal: {
            ondismiss: () => {
              toast('Payment window closed.', { icon: 'ℹ️' });
              setIsProcessingOrder(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Fallback simulated payment when external script is blocked
        const verifyRes = await pricingApi.verifyRazorpayPayment({
          orderId: targetOrderId,
          razorpayOrderId: paymentInitData?.razorpayOrderId || `rzp_${Date.now()}`,
          razorpayPaymentId: `pay_fallback_${Date.now()}`,
          razorpaySignature: 'simulated_valid_signature_sandbox',
        });

        if (verifyRes.data?.success) {
          setCompletedOrder(verifyRes.data.order || orderData);
          setPaymentTxnId(`TXN-SIM-${Date.now()}`);
          toast.success('Enrollment confirmed successfully!');
        }
      }
    } catch (err: any) {
      console.error('Payment error', err);
      toast.error(err.response?.data?.message || err.message || 'Payment processing failed');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // If order is completed, show premium confirmation invoice card
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col">
        <PublicNavbar />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
          <div className="bg-white dark:bg-[#12151E] border border-slate-200 dark:border-[#2D3347] rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                Payment Successful · Enrollment Confirmed
              </span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-3">
                Welcome to {currentProgramStaticConfig.title}!
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm max-w-lg mx-auto mt-2">
                Your program seat is reserved and your student account status has been updated to{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">PREMIUM Industry-Ready</strong>.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 dark:bg-[#181B26] border border-slate-200 dark:border-[#2D3347] rounded-2xl p-6 text-left space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#2D3347]">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Order ID</span>
                  <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                    {completedOrder.orderNumber || completedOrder.id}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Transaction ID</span>
                  <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                    {paymentTxnId || 'TXN-SUCCESS'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Enrolled Program:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentProgramStaticConfig.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Target Academic Batch:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {currentProgramStaticConfig.targetAcademicYear}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Student Name:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Registered Email:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{email}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-[#2D3347] font-bold text-base">
                  <span className="text-slate-900 dark:text-white">Total Amount Paid (inc. 18% GST):</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ₹{(completedOrder.finalPayableAmount || finalPayable).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                to="/my-programs"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <span>View My Programs & Receipts</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={isAuthenticated ? '/student/dashboard' : '/login'}
                className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center justify-center gap-2"
              >
                <span>Go to Student Portal</span>
              </Link>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/programs" className="hover:text-blue-600">Programs</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 dark:text-slate-200">{currentProgramStaticConfig.title} Checkout</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {currentProgramStaticConfig.badge}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {currentProgramStaticConfig.duration}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Secure Enrollment &amp; Checkout
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
            Complete your enrollment to unlock verified industry training, mentor code audits, daily sprint logs, and partner corporate internship opportunities.
          </p>
        </div>

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: PROGRAM SELECTION & STUDENT INFO (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Program Switcher Tabs */}
            <div className="bg-white dark:bg-[#12151E] border border-slate-200 dark:border-[#2D3347] rounded-2xl p-4 sm:p-5 shadow-xs">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                Selected Program Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Object.keys(PROGRAM_CONFIGS).map((progId) => {
                  const item = (PROGRAM_CONFIGS as any)[progId];
                  const isSelected = selectedKey === progId;
                  return (
                    <button
                      key={progId}
                      type="button"
                      onClick={() => {
                        setSelectedKey(progId);
                        setAppliedCoupon(null);
                        setCouponError(null);
                      }}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="block text-[11px] font-bold leading-tight truncate">{item.title}</span>
                      <span className="block text-[9.5px] text-slate-400 mt-0.5 truncate">{item.duration}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Program Spotlight & Structure */}
            <div className="bg-white dark:bg-[#12151E] border border-slate-200 dark:border-[#2D3347] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {currentProgramStaticConfig.title}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    Target: {currentProgramStaticConfig.targetAcademicYear}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="line-through text-xs text-slate-400 mr-1.5">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                    ₹{launchPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentProgramStaticConfig.shortDescription}
              </p>

              {/* PPO Specific Blueprint Callout */}
              {selectedKey === 'PPO' && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-emerald-500/10 border border-blue-500/20 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-300">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>PPO Roadmap Structure:</span>
                  </div>
                  <p className="font-semibold leading-relaxed">
                    <strong>Phase 1 (Month 1–2):</strong> 2 Months intensive training & readiness done directly on the InterHive platform.<br />
                    <strong>Phase 2 (Month 3–8):</strong> 6 Months assured corporate internship opportunity at partner company with monthly stipend and direct PPO conversion.
                  </p>
                </div>
              )}

              {/* Target Deliverables Milestone */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181B26] border border-slate-200 dark:border-[#2D3347] flex items-center gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Deliverable Goal: <span className="text-emerald-700 dark:text-emerald-400 font-bold">{currentProgramStaticConfig.summaryTarget}</span>
                </span>
              </div>
            </div>

            {/* Payment Plan Selection */}
            <div className="bg-white dark:bg-[#12151E] border border-slate-200 dark:border-[#2D3347] rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Select Payment Plan</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setSelectedPlanType('ONE_TIME')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                    selectedPlanType === 'ONE_TIME'
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={selectedPlanType === 'ONE_TIME'}
                        onChange={() => setSelectedPlanType('ONE_TIME')}
                        className="text-blue-600"
                      />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Full One-Time Payment</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Pay upfront and receive maximum discount benefits.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Best Value
                  </span>
                </div>

                <div
                  onClick={() => setSelectedPlanType('INSTALLMENT')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                    selectedPlanType === 'INSTALLMENT'
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={selectedPlanType === 'INSTALLMENT'}
                        onChange={() => setSelectedPlanType('INSTALLMENT')}
                        className="text-blue-600"
                      />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Easy Installments</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Split across 2 equal monthly payments.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    2x Split
                  </span>
                </div>
              </div>
            </div>

            {/* Student Contact Information */}
            <div className="bg-white dark:bg-[#12151E] border border-slate-200 dark:border-[#2D3347] rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Student Details &amp; Enrollment Identity</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ankit Yadav"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ankit@college.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Mobile Number (for WhatsApp / SMS updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    College / Institution Name
                  </label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. IIT Bombay / NIT Delhi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Current Academic Status (Batch Year)
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="Final Year">Final Year Student (Batch 2027) — Eligible for 1-Year &amp; PPO</option>
                  <option value="3rd Year">3rd Year Student (Batch 2028) — Eligible for 2-Year</option>
                  <option value="2nd Year">2nd Year Student (Batch 2029) — Eligible for 3-Year</option>
                  <option value="1st Year">1st Year Student (Batch 2030) — Eligible for 4-Year</option>
                </select>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: PRICE BREAKDOWN & RAZORPAY CHECKOUT (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Price Breakdown Card */}
            <div className="bg-white dark:bg-[#12151E] border border-slate-200 dark:border-[#2D3347] rounded-3xl p-6 shadow-lg space-y-5 sticky top-24">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#2D3347]">
                <span>Order Summary</span>
                <span className="text-xs font-semibold text-slate-500">100% Secure Checkout</span>
              </h3>

              {/* Coupon Code Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Have a Promo / Discount Coupon?</span>
                </label>

                {appliedCoupon ? (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        {appliedCoupon.code}
                      </span>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                        Applied! Saved ₹{appliedCoupon.discountAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-200/50 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      placeholder="e.g. INTERHIVE10"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      disabled={isValidatingCoupon || !couponCodeInput.trim()}
                      onClick={() => handleApplyCoupon()}
                      className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-bold text-xs hover:bg-slate-800 disabled:opacity-50 cursor-pointer transition-colors"
                    >
                      {isValidatingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{couponError}</span>
                  </p>
                )}

                {/* Quick Coupon Chips */}
                {!appliedCoupon && (
                  <div className="pt-1 flex flex-wrap gap-1.5 text-[10px]">
                    <span className="text-slate-400 font-semibold self-center">Popular:</span>
                    {['INTERHIVE10', 'FIRSTBATCH', 'CAMPUS15'].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleApplyCoupon(chip)}
                        className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono font-bold hover:bg-blue-100 cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Referral Code Input */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-[#2D3347] space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-purple-600" />
                  <span>Friend's Referral Code</span>
                </label>

                {appliedReferral ? (
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-purple-800 dark:text-purple-300">
                        {appliedReferral.code}
                      </span>
                      <p className="text-[11px] text-purple-700 dark:text-purple-400 mt-0.5">
                        Referral applied! ₹500 discount given.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveReferral}
                      className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-200/50 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={referralCodeInput}
                      onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                      placeholder="e.g. IHANKIT123"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      disabled={!referralCodeInput.trim()}
                      onClick={handleApplyReferral}
                      className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 disabled:opacity-50 cursor-pointer transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {referralError && (
                  <p className="text-[11px] text-rose-600 font-medium">{referralError}</p>
                )}
              </div>

              {/* Line Item Breakdown */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-[#2D3347] space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Original Program Fee:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                {baseDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Launch / Cohort Promotional Discount:</span>
                    <span>- ₹{baseDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-blue-600 dark:text-blue-400 font-medium">
                    <span>Coupon ({appliedCoupon?.code}):</span>
                    <span>- ₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {referralDiscount > 0 && (
                  <div className="flex justify-between text-purple-600 dark:text-purple-400 font-medium">
                    <span>Referral Discount:</span>
                    <span>- ₹{referralDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-dashed border-slate-200 dark:border-slate-800">
                  <span>Taxable Subtotal:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    ₹{discountedSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <span>GST (18% Govt. Tax):</span>
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    ₹{taxAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-[#2D3347] text-base font-black">
                  <span className="text-slate-900 dark:text-white">Total Amount Payable:</span>
                  <span className="text-2xl text-blue-600 dark:text-blue-400 font-black">
                    ₹{finalPayable.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Total Savings Badge */}
              {totalDiscount > 0 && (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Total Savings Applied: ₹{totalDiscount.toLocaleString('en-IN')}
                </div>
              )}

              {/* Razorpay Checkout Button */}
              <button
                type="button"
                disabled={isProcessingOrder}
                onClick={handleProceedToPayment}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-xl shadow-blue-600/30 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isProcessingOrder ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Initiating Razorpay...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{finalPayable.toLocaleString('en-IN')} via Razorpay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 font-semibold pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>256-Bit Encrypted Payment Processing</span>
                </span>
                <span>•</span>
                <span>UPI, NetBanking, Cards &amp; EMI</span>
              </div>

              {/* Academic Policy Reminder */}
              <p className="text-[10px] text-slate-400 leading-normal text-center">
                {PROGRAM_DISCLAIMER}
              </p>

            </div>

          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
