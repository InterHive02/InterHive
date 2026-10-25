import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Star,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Save,
  X
} from 'lucide-react';
import { contentApi, PartnerItem, TestimonialItem } from '../../../api/endpoints/content.api';
import { toast } from 'react-hot-toast';

export const LandingContentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'partners' | 'testimonials'>('partners');
  
  // Data states
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);
  const [partnerForm, setPartnerForm] = useState<Partial<PartnerItem>>({
    name: '',
    logo: '',
    website: '',
    partnershipTier: 'MOU Placement Partner',
    isActive: true,
  });

  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<Partial<TestimonialItem>>({
    name: '',
    college: '',
    branch: '',
    company: '',
    role: '',
    package: '',
    rating: 5,
    review: '',
    isPublished: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [partnersRes, testimonialsRes] = await Promise.allSettled([
        contentApi.getAdminPartners(),
        contentApi.getAdminTestimonials(),
      ]);

      if (partnersRes.status === 'fulfilled' && partnersRes.value.data?.data) {
        setPartners(partnersRes.value.data.data);
      }
      if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value.data?.data) {
        setTestimonials(testimonialsRes.value.data.data);
      }
    } catch {
      // Failed to load
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ──────────────── Partner Actions ────────────────

  const handleOpenAddPartner = () => {
    setEditingPartner(null);
    setPartnerForm({
      name: '',
      logo: '',
      website: '',
      partnershipTier: 'MOU Placement Partner',
      isActive: true,
    });
    setIsPartnerModalOpen(true);
  };

  const handleOpenEditPartner = (p: PartnerItem) => {
    setEditingPartner(p);
    setPartnerForm({
      name: p.name,
      logo: p.logo,
      website: p.website,
      partnershipTier: p.partnershipTier,
      isActive: p.isActive,
    });
    setIsPartnerModalOpen(true);
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.name?.trim()) {
      toast.error('Partner company name is required');
      return;
    }

    try {
      if (editingPartner?._id) {
        await contentApi.updatePartner(editingPartner._id, partnerForm);
        toast.success('Partner company updated');
      } else {
        await contentApi.createPartner(partnerForm);
        toast.success('Partner company added to landing page');
      }
      setIsPartnerModalOpen(false);
      loadData();
    } catch {
      toast.error('Failed to save partner company');
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this partner company?')) return;
    try {
      await contentApi.deletePartner(id);
      toast.success('Partner company removed');
      loadData();
    } catch {
      toast.error('Failed to delete partner company');
    }
  };

  const handleTogglePartnerActive = async (p: PartnerItem) => {
    if (!p._id) return;
    try {
      await contentApi.updatePartner(p._id, { isActive: !p.isActive });
      toast.success(p.isActive ? 'Partner hidden from landing page' : 'Partner published to landing page');
      loadData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  // ──────────────── Testimonial Actions ────────────────

  const handleOpenAddTestimonial = () => {
    setEditingTestimonial(null);
    setTestimonialForm({
      name: '',
      college: '',
      branch: '',
      company: '',
      role: '',
      package: '',
      rating: 5,
      review: '',
      isPublished: true,
    });
    setIsTestimonialModalOpen(true);
  };

  const handleOpenEditTestimonial = (t: TestimonialItem) => {
    setEditingTestimonial(t);
    setTestimonialForm({
      name: t.name,
      college: t.college,
      branch: t.branch,
      company: t.company,
      role: t.role,
      package: t.package,
      rating: t.rating,
      review: t.review,
      isPublished: t.isPublished,
    });
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.name?.trim() || !testimonialForm.college?.trim() || !testimonialForm.review?.trim()) {
      toast.error('Name, College, and Review are required');
      return;
    }

    try {
      if (editingTestimonial?._id) {
        await contentApi.updateTestimonial(editingTestimonial._id, testimonialForm);
        toast.success('Review updated');
      } else {
        await contentApi.createTestimonial(testimonialForm);
        toast.success('Review published to landing page');
      }
      setIsTestimonialModalOpen(false);
      loadData();
    } catch {
      toast.error('Failed to save review');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student review?')) return;
    try {
      await contentApi.deleteTestimonial(id);
      toast.success('Review removed');
      loadData();
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const handleToggleTestimonialPublished = async (t: TestimonialItem) => {
    if (!t._id) return;
    try {
      await contentApi.updateTestimonial(t._id, { isPublished: !t.isPublished });
      toast.success(t.isPublished ? 'Review hidden from landing page' : 'Review visible on landing page');
      loadData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
      
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Landing Page Content & Social Proof
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Manage genuine partner companies and verified student reviews displayed publicly on the landing page.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('partners')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'partners'
                ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Partner Companies ({partners.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('testimonials')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'testimonials'
                ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-xs'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Student Reviews ({testimonials.length})</span>
          </button>
        </div>
      </div>

      {/* ──────────────── TAB 1: PARTNERS ──────────────── */}
      {activeTab === 'partners' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                Active Partner Companies
              </h4>
              <p className="text-xs text-gray-500">
                The partner company section only renders on the landing page when real partners are added below.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddPartner}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Partner Company</span>
            </button>
          </div>

          {partners.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-center space-y-3 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-gray-900 dark:text-white text-sm">
                  No Partner Companies Added
                </h5>
                <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                  The partner logo section on your landing page is currently hidden to ensure zero fake or misleading company claims. When you sign real MOUs or hire partner companies, add them here to show them publicly!
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddPartner}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>Add Your First Partner</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {partners.map((p) => (
                <div
                  key={p._id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-black text-gray-700 dark:text-gray-200 shrink-0 overflow-hidden">
                      {p.logo ? (
                        <img src={p.logo} alt={p.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <span>{p.name.slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-black text-gray-900 dark:text-white truncate">
                        {p.name}
                      </h5>
                      <span className="text-[10px] text-gray-500 block truncate">
                        {p.partnershipTier}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTogglePartnerActive(p)}
                      title={p.isActive ? 'Hide from landing page' : 'Publish to landing page'}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        p.isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {p.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditPartner(p)}
                      title="Edit Partner"
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => p._id && handleDeletePartner(p._id)}
                      title="Delete Partner"
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ──────────────── TAB 2: TESTIMONIALS ──────────────── */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                Student Testimonials & Reviews
              </h4>
              <p className="text-xs text-gray-500">
                The reviews section only renders on the landing page when real verified student reviews are published below.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddTestimonial}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student Review</span>
            </button>
          </div>

          {testimonials.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-center space-y-3 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Star className="w-6 h-6 fill-amber-500" />
              </div>
              <div>
                <h5 className="font-bold text-gray-900 dark:text-white text-sm">
                  No Student Reviews Added
                </h5>
                <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                  The student reviews section on your landing page is currently hidden to ensure complete honesty. Once students complete your cohorts and receive placements or internships, add their real reviews and offer details here!
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddTestimonial}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>Add Your First Review</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <div
                  key={t._id}
                  className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 flex flex-col justify-between space-y-3 shadow-2xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-sm font-black text-gray-900 dark:text-white">
                            {t.name}
                          </h5>
                          {t.isPublished && (
                            <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                              Published
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {t.college} {t.branch ? `• ${t.branch}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleTestimonialPublished(t)}
                          title={t.isPublished ? 'Hide review' : 'Publish review'}
                          className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                            t.isPublished ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          {t.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditTestimonial(t)}
                          title="Edit Review"
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => t._id && handleDeleteTestimonial(t._id)}
                          title="Delete Review"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center text-amber-500">
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        {t.company} {t.package ? `(${t.package})` : ''}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-relaxed line-clamp-3">
                      "{t.review}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ──────────────── MODAL 1: ADD / EDIT PARTNER ──────────────── */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
              <h4 className="text-base font-black text-gray-900 dark:text-white">
                {editingPartner ? 'Edit Partner Company' : 'Add Partner Company'}
              </h4>
              <button
                type="button"
                onClick={() => setIsPartnerModalOpen(false)}
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={partnerForm.name || ''}
                  onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                  placeholder="e.g. Acme Tech"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Logo URL (Optional)
                </label>
                <input
                  type="url"
                  value={partnerForm.logo || ''}
                  onChange={(e) => setPartnerForm({ ...partnerForm, logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Partnership Tier / Type
                </label>
                <input
                  type="text"
                  value={partnerForm.partnershipTier || ''}
                  onChange={(e) => setPartnerForm({ ...partnerForm, partnershipTier: e.target.value })}
                  placeholder="e.g. MOU Enterprise Partner"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  value={partnerForm.website || ''}
                  onChange={(e) => setPartnerForm({ ...partnerForm, website: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="partnerActive"
                  checked={partnerForm.isActive ?? true}
                  onChange={(e) => setPartnerForm({ ...partnerForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="partnerActive" className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Visible on public landing page
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────── MODAL 2: ADD / EDIT TESTIMONIAL ──────────────── */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[90dvh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 shrink-0">
              <h4 className="text-base font-black text-gray-900 dark:text-white">
                {editingTestimonial ? 'Edit Student Review' : 'Add Student Review'}
              </h4>
              <button
                type="button"
                onClick={() => setIsTestimonialModalOpen(false)}
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="p-5 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={testimonialForm.name || ''}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    College / University *
                  </label>
                  <input
                    type="text"
                    required
                    value={testimonialForm.college || ''}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, college: e.target.value })}
                    placeholder="e.g. Pune University"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Academic Year / Branch
                  </label>
                  <input
                    type="text"
                    value={testimonialForm.branch || ''}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, branch: e.target.value })}
                    placeholder="e.g. 3rd Year CSE"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Company Placed / Matched *
                  </label>
                  <input
                    type="text"
                    required
                    value={testimonialForm.company || ''}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                    placeholder="e.g. TechCorp"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Role / Position
                  </label>
                  <input
                    type="text"
                    value={testimonialForm.role || ''}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                    placeholder="e.g. Full Stack Intern"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    PPO Package / Stipend
                  </label>
                  <input
                    type="text"
                    value={testimonialForm.package || ''}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, package: e.target.value })}
                    placeholder="e.g. ₹10 LPA PPO"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTestimonialForm({ ...testimonialForm, rating: star })}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (testimonialForm.rating || 5)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Student Review / Quote *
                </label>
                <textarea
                  required
                  rows={4}
                  value={testimonialForm.review || ''}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, review: e.target.value })}
                  placeholder="Write the student's genuine experience with InterHive..."
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="testimonialPublished"
                  checked={testimonialForm.isPublished ?? true}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="testimonialPublished" className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Published on public landing page
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
