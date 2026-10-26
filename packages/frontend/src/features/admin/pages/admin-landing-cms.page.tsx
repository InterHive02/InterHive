import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  LayoutTemplate,
  Type,
  Image as ImageIcon,
  Palette,
  Compass,
  Link2,
  FileSpreadsheet,
  Share2,
  Settings,
  Eye,
  History,
  RotateCcw,
  Save,
  Send,
  Upload,
  Trash2,
  Plus,
  Check,
  X,
  AlertCircle,
  Copy,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { landingCmsApi } from '../../../api/endpoints/landing-cms.api';
import {
  LandingPageConfig,
  MediaAssetItem,
  LandingRevisionItem,
  DEFAULT_LANDING_CMS_CONFIG,
  FaqItem,
} from '@interhive/shared';

type CmsTab =
  | 'overview'
  | 'sections'
  | 'content'
  | 'media'
  | 'navigation'
  | 'theme'
  | 'buttons'
  | 'forms'
  | 'seo'
  | 'advanced'
  | 'preview'
  | 'history'
  | 'reset';

export const AdminLandingCmsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CmsTab>('overview');
  const [config, setConfig] = useState<LandingPageConfig>(DEFAULT_LANDING_CMS_CONFIG);
  const [initialConfig, setInitialConfig] = useState<LandingPageConfig>(DEFAULT_LANDING_CMS_CONFIG);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishNotes, setPublishNotes] = useState<string>('');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);

  // Media Library state
  const [mediaList, setMediaList] = useState<MediaAssetItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Revision history state
  const [revisions, setRevisions] = useState<LandingRevisionItem[]>([]);
  const [revisionsLoading, setRevisionsLoading] = useState<boolean>(false);

  // Preview viewport
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Check if draft has unsaved changes in memory
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(config) !== JSON.stringify(initialConfig);
  }, [config, initialConfig]);

  // Load initial draft config from backend
  const loadDraft = async () => {
    setIsLoading(true);
    try {
      const res = await landingCmsApi.getDraftConfig();
      if (res.data?.data) {
        setConfig(res.data.data);
        setInitialConfig(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch draft config from backend, using baseline:', err);
      setConfig(DEFAULT_LANDING_CMS_CONFIG);
      setInitialConfig(DEFAULT_LANDING_CMS_CONFIG);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDraft();
  }, []);

  // Load media library when media tab active
  useEffect(() => {
    if (activeTab === 'media') {
      loadMedia();
    } else if (activeTab === 'history') {
      loadRevisions();
    }
  }, [activeTab]);

  const loadMedia = async () => {
    setMediaLoading(true);
    try {
      const res = await landingCmsApi.getMediaList();
      if (res.data?.data) {
        setMediaList(res.data.data);
      }
    } catch {
      // media fetch fallback
    } finally {
      setMediaLoading(false);
    }
  };

  const loadRevisions = async () => {
    setRevisionsLoading(true);
    try {
      const res = await landingCmsApi.getRevisions();
      if (res.data?.data) {
        setRevisions(res.data.data);
      }
    } catch {
      // revisions fetch fallback
    } finally {
      setRevisionsLoading(false);
    }
  };

  // Save Draft (does NOT publish live)
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const res = await landingCmsApi.saveDraft(config);
      if (res.data?.data) {
        setConfig(res.data.data);
        setInitialConfig(res.data.data);
      }
      toast.success('Landing page draft saved successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save draft.');
    } finally {
      setIsSaving(false);
    }
  };

  // Publish Draft Live
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Save draft first
      await landingCmsApi.saveDraft(config);
      const res = await landingCmsApi.publishDraft(publishNotes.trim() || undefined);
      if (res.data?.data) {
        setConfig(res.data.data);
        setInitialConfig(res.data.data);
      }
      toast.success(`Published live as Version ${res.data?.data?.version || 'new'}!`);
      setIsPublishModalOpen(false);
      setPublishNotes('');
      // Trigger update event for open tabs
      window.dispatchEvent(new Event('landing-cms-published'));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to publish live.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Restore Revision
  const handleRestoreRevision = async (revId: string, revVer: number) => {
    if (!window.confirm(`Are you sure you want to restore Version ${revVer}? This will become the new published version.`)) {
      return;
    }
    try {
      const res = await landingCmsApi.restoreRevision(revId);
      if (res.data?.data) {
        setConfig(res.data.data);
        setInitialConfig(res.data.data);
      }
      toast.success(`Restored Version ${revVer} successfully!`);
      loadRevisions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to restore revision.');
    }
  };

  // Reset to Defaults
  const handleResetToDefaults = async () => {
    if (
      !window.confirm(
        'Are you sure you want to reset all landing page content to InterHive default code values? This cannot be undone, though past versions remain in revision history.'
      )
    ) {
      return;
    }
    try {
      const res = await landingCmsApi.resetToDefaults();
      if (res.data?.data) {
        setConfig(res.data.data);
        setInitialConfig(res.data.data);
      }
      toast.success('Reset to codebase defaults complete!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset.');
    }
  };

  // Upload Media Asset
  const handleMediaUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error('Please select an image file to upload.');
      return;
    }
    setIsUploading(true);
    try {
      await landingCmsApi.uploadMedia(uploadFile, uploadAlt);
      toast.success('Image uploaded to Media Library!');
      setUploadFile(null);
      setUploadAlt('');
      loadMedia();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Media Asset
  const handleDeleteMedia = async (id: string) => {
    if (!window.confirm('Delete this media asset?')) return;
    try {
      await landingCmsApi.deleteMedia(id);
      toast.success('Media asset deleted.');
      loadMedia();
    } catch {
      toast.error('Failed to delete media asset.');
    }
  };

  // Section visibility toggle
  const toggleSectionVisibility = (secId: string) => {
    setConfig((prev) => {
      const updatedMeta = prev.sectionsMeta.map((s) => (s.id === secId ? { ...s, isVisible: !s.isVisible } : s));
      return { ...prev, sectionsMeta: updatedMeta };
    });
  };

  // Move section reorder
  const moveSectionOrder = (index: number, direction: 'up' | 'down') => {
    setConfig((prev) => {
      const newMeta = [...prev.sectionsMeta];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newMeta.length) return prev;
      const temp = newMeta[index];
      newMeta[index] = newMeta[targetIndex];
      newMeta[targetIndex] = temp;
      // Re-assign order index
      return {
        ...prev,
        sectionsMeta: newMeta.map((s, idx) => ({ ...s, order: idx + 1 })),
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm font-bold text-slate-500">Loading Landing Page CMS Workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ──────────────── TOP APP BAR ──────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Maintain Landing Page
                </h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  Version {config.version}
                </span>
                {hasUnsavedChanges && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 animate-pulse">
                    Unsaved Draft Changes
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Dynamic CMS: Edit headlines, images, background banners, sections, theme colors, FAQs, and SEO without code changes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setActiveTab('preview')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Preview</span>
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => setIsPublishModalOpen(true)}
            disabled={isPublishing}
            className="px-5 py-2 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isPublishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Publish Live</span>
          </button>
        </div>
      </div>

      {/* ──────────────── 13-SUBMODULE TABS NAVIGATION ──────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'overview', label: '1. Overview', icon: Layers },
          { id: 'sections', label: '2. Page Sections', icon: LayoutTemplate },
          { id: 'content', label: '3. Content Editor', icon: Type },
          { id: 'media', label: '4. Media Library', icon: ImageIcon },
          { id: 'navigation', label: '5. Nav & Footer', icon: Compass },
          { id: 'theme', label: '6. Theme & Colors', icon: Palette },
          { id: 'buttons', label: '7. Buttons & CTAs', icon: Link2 },
          { id: 'forms', label: '8. Forms & Alerts', icon: FileSpreadsheet },
          { id: 'seo', label: '9. SEO & Social', icon: Share2 },
          { id: 'advanced', label: '10. Advanced Settings', icon: Settings },
          { id: 'preview', label: '11. Live Preview', icon: Eye },
          { id: 'history', label: '12. Revisions', icon: History },
          { id: 'reset', label: '13. Recovery', icon: RotateCcw },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CmsTab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white dark:bg-[#121526] text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ──────────────── TAB 1: OVERVIEW ──────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs font-bold text-slate-400">Current CMS Version</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">v{config.version}</p>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Live & Database Synced
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs font-bold text-slate-400">Total Active Sections</span>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {config.sectionsMeta.filter((s) => s.isVisible).length} / {config.sectionsMeta.length}
              </p>
              <span className="text-[11px] font-semibold text-slate-500 mt-2 block">
                Order and visibility configurable
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs font-bold text-slate-400">Last Published By</span>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-1 truncate">
                {config.publishedBy || 'admin@interhive.in'}
              </p>
              <span className="text-[11px] text-slate-400 mt-2 block">
                {config.publishedAt ? new Date(config.publishedAt).toLocaleDateString() : 'Initial Release'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-xs font-bold text-slate-400">Hero Background Mode</span>
              <p className="text-base font-black text-purple-600 mt-1 capitalize">
                {config.hero?.background?.type || 'Image'}
              </p>
              <span className="text-[11px] text-slate-400 mt-2 block truncate">
                {config.hero?.background?.url ? 'Custom Asset Configured' : 'Default Asset'}
              </span>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveTab('content')}
              className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/60 dark:border-blue-900/40 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3">
                <Type className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white">Edit Headlines & Text</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Update the hero headline, PPO explanation, feature lists, and testimonials.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('media')}
              className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-fuchsia-50/50 dark:from-purple-950/20 dark:to-fuchsia-950/20 border border-purple-200/60 dark:border-purple-900/40 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3">
                <ImageIcon className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white">Change Hero Background</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Upload custom campus photography, graphics, or set full-bleed gradient overlays.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('sections')}
              className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/60 dark:border-emerald-900/40 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
                <LayoutTemplate className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white">Reorder Page Sections</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Show/hide entire blocks, move sections up or down, or customize landing flow.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 2: PAGE SECTIONS ──────────────── */}
      {activeTab === 'sections' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">Landing Page Sections Manager</h2>
              <p className="text-xs text-slate-500">
                Control the exact order and visibility of every block rendered on the public landing page.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {config.sectionsMeta.filter((s) => s.isVisible).length} Visible Sections
            </span>
          </div>

          <div className="space-y-2.5">
            {config.sectionsMeta.map((sec, idx) => (
              <div
                key={sec.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{sec.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">id: {sec.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Reorder Buttons */}
                  <button
                    type="button"
                    onClick={() => moveSectionOrder(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                    title="Move section up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSectionOrder(idx, 'down')}
                    disabled={idx === config.sectionsMeta.length - 1}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                    title="Move section down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Show/Hide Switch */}
                  <button
                    type="button"
                    onClick={() => toggleSectionVisibility(sec.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-black transition-colors cursor-pointer flex items-center gap-1 ${
                      sec.isVisible
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {sec.isVisible ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    <span>{sec.isVisible ? 'Visible' : 'Hidden'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────── TAB 3: CONTENT EDITOR ──────────────── */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Hero Content Editor */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Hero Section Content</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Announcement Badge</label>
                <input
                  type="text"
                  value={config.hero.badgeText}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, hero: { ...p.hero, badgeText: e.target.value } }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">PPO Definition Callout</label>
                <input
                  type="text"
                  value={config.hero.ppoDefinition}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, hero: { ...p.hero, ppoDefinition: e.target.value } }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Primary Headline Main</label>
                <input
                  type="text"
                  value={config.hero.headlineMain}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, hero: { ...p.hero, headlineMain: e.target.value } }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Headline Gradient Accent</label>
                <input
                  type="text"
                  value={config.hero.headlineGradient}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, hero: { ...p.hero, headlineGradient: e.target.value } }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Hero Description Paragraph</label>
              <textarea
                rows={2}
                value={config.hero.description}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, hero: { ...p.hero, description: e.target.value } }))
                }
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-blue-500"
              />
            </div>
          </div>

          {/* Journey Section Editor */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-600" />
              <span>Journey to a PPO (7 Steps & Pills)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Journey Section Title</label>
                <input
                  type="text"
                  value={config.journey.title}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, journey: { ...p.journey, title: e.target.value } }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Journey Subtitle</label>
                <input
                  type="text"
                  value={config.journey.subtitle}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, journey: { ...p.journey, subtitle: e.target.value } }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>

            {/* Steps list */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">7 Progression Steps</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {config.journey.steps.map((st, sIdx) => (
                  <div
                    key={st.stepNumber}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-blue-600">Step {st.stepNumber}</span>
                    </div>
                    <input
                      type="text"
                      value={st.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig((p) => {
                          const steps = [...p.journey.steps];
                          steps[sIdx] = { ...steps[sIdx], title: val };
                          return { ...p, journey: { ...p.journey, steps } };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                    />
                    <input
                      type="text"
                      value={st.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig((p) => {
                          const steps = [...p.journey.steps];
                          steps[sIdx] = { ...steps[sIdx], description: val };
                          return { ...p, journey: { ...p.journey, steps } };
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Editor */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>Frequently Asked Questions</span>
              </h2>
              <button
                type="button"
                onClick={() => {
                  const newItem: FaqItem = {
                    question: 'New Question?',
                    answer: 'Provide clear, honest answer here.',
                  };
                  setConfig((p) => ({ ...p, faq: { ...p.faq, items: [...p.faq.items, newItem] } }));
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-900/30 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add FAQ Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {config.faq.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400">FAQ #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setConfig((p) => ({
                          ...p,
                          faq: { ...p.faq, items: p.faq.items.filter((_, i) => i !== idx) },
                        }));
                      }}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfig((p) => {
                        const items = [...p.faq.items];
                        items[idx] = { ...items[idx], question: val };
                        return { ...p, faq: { ...p.faq, items } };
                      });
                    }}
                    placeholder="Question"
                    className="w-full px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                  <textarea
                    rows={2}
                    value={item.answer}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfig((p) => {
                        const items = [...p.faq.items];
                        items[idx] = { ...items[idx], answer: val };
                        return { ...p, faq: { ...p.faq, items } };
                      });
                    }}
                    placeholder="Answer"
                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 4: MEDIA & BACKGROUND LIBRARY ──────────────── */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          {/* Hero Background Control Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>Hero Section Background Image & Overlay</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Background Mode</label>
                <select
                  value={config.hero.background.type}
                  onChange={(e) =>
                    setConfig((p) => ({
                      ...p,
                      hero: { ...p.hero, background: { ...p.hero.background, type: e.target.value as any } },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  <option value="image">Image (Campus / Architecture / Tech)</option>
                  <option value="gradient">Gradient Only</option>
                  <option value="color">Solid Clean Canvas</option>
                </select>

                <div className="pt-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Image Opacity ({Math.round(config.hero.background.opacity * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={config.hero.background.opacity}
                    onChange={(e) =>
                      setConfig((p) => ({
                        ...p,
                        hero: {
                          ...p.hero,
                          background: { ...p.hero.background, opacity: parseFloat(e.target.value) },
                        },
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Current Hero Background URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.hero.background.url}
                    onChange={(e) =>
                      setConfig((p) => ({
                        ...p,
                        hero: { ...p.hero, background: { ...p.hero.background, url: e.target.value } },
                      }))
                    }
                    placeholder="/interhive_full_bg.png or https://..."
                    className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setConfig((p) => ({
                        ...p,
                        hero: { ...p.hero, background: { ...p.hero.background, url: '/interhive_full_bg.png' } },
                      }))
                    }
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    Reset to Default
                  </button>
                </div>

                {/* Preview Thumbnail */}
                <div className="h-28 w-full rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative bg-slate-100 dark:bg-slate-900">
                  <img
                    src={config.hero.background.url || '/interhive_full_bg.png'}
                    alt="Hero background preview"
                    className="w-full h-full object-cover"
                    style={{ opacity: config.hero.background.opacity }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent flex items-center px-4">
                    <span className="text-xs font-black text-white bg-slate-900/60 px-2.5 py-1 rounded-md">
                      Live Preview Thumbnail
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload New Asset Form */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Upload New Media Asset</span>
            </h2>

            <form onSubmit={handleMediaUpload} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Select Image File</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Alt Text / Description</label>
                <input
                  type="text"
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  placeholder="e.g. Modern Tech Campus Hero Banner"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading || !uploadFile}
                className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>Upload to Media Library</span>
              </button>
            </form>
          </div>

          {/* Media Assets Gallery */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 dark:text-white">Media Library Assets</h2>
              <span className="text-xs text-slate-400 font-bold">{mediaList.length} Uploaded Assets</span>
            </div>

            {mediaLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : mediaList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaList.map((asset) => (
                  <div
                    key={asset._id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-900 group relative flex flex-col justify-between"
                  >
                    <div className="h-32 w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                      <img src={asset.url} alt={asset.altText} className="w-full h-full object-cover" />
                    </div>

                    <div className="p-3 space-y-2">
                      <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate" title={asset.originalName}>
                        {asset.originalName}
                      </p>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {Math.round(asset.size / 1024)} KB • {asset.mimeType.split('/')[1]?.toUpperCase()}
                      </span>

                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(asset.url);
                            toast.success('Asset URL copied to clipboard!');
                          }}
                          className="flex-1 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-[10px] font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setConfig((p) => ({
                              ...p,
                              hero: { ...p.hero, background: { ...p.hero.background, url: asset.url } },
                            }));
                            toast.success('Set as Hero Background!');
                          }}
                          className="py-1 px-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold cursor-pointer"
                          title="Apply as hero background"
                        >
                          Set Hero
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteMedia(asset._id)}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                No custom assets uploaded yet. Upload an image above to populate the media library.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ──────────────── TAB 5: NAVIGATION & FOOTER ──────────────── */}
      {activeTab === 'navigation' && (
        <div className="space-y-6">
          {/* Navbar */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Public Navbar Configuration</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Brand Name</label>
                <input
                  type="text"
                  value={config.navbar.brandName}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, navbar: { ...p.navbar, brandName: e.target.value } }))
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Navbar CTA Text</label>
                <input
                  type="text"
                  value={config.navbar.ctaButtonText}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, navbar: { ...p.navbar, ctaButtonText: e.target.value } }))
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>

            {/* Menu Links */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-700 dark:text-slate-300">Navigation Menu Items</span>
                <button
                  type="button"
                  onClick={() => {
                    const newLink = {
                      label: 'New Link',
                      href: '#',
                      order: config.navbar.links.length + 1,
                      isVisible: true,
                    };
                    setConfig((p) => ({
                      ...p,
                      navbar: { ...p.navbar, links: [...p.navbar.links, newLink] },
                    }));
                  }}
                  className="text-xs font-bold text-blue-600 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Link
                </button>
              </div>

              <div className="space-y-2">
                {config.navbar.links.map((link, lIdx) => (
                  <div
                    key={lIdx}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60"
                  >
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig((p) => {
                          const links = [...p.navbar.links];
                          links[lIdx] = { ...links[lIdx], label: val };
                          return { ...p, navbar: { ...p.navbar, links } };
                        });
                      }}
                      className="w-36 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig((p) => {
                          const links = [...p.navbar.links];
                          links[lIdx] = { ...links[lIdx], href: val };
                          return { ...p, navbar: { ...p.navbar, links } };
                        });
                      }}
                      className="flex-1 px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setConfig((p) => ({
                          ...p,
                          navbar: { ...p.navbar, links: p.navbar.links.filter((_, i) => i !== lIdx) },
                        }));
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white">Public Footer Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Brand Tagline</label>
                <input
                  type="text"
                  value={config.footer.tagline}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, footer: { ...p.footer, tagline: e.target.value } }))
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Copyright Line</label>
                <input
                  type="text"
                  value={config.footer.copyrightText}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, footer: { ...p.footer, copyrightText: e.target.value } }))
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 6: THEME & APPEARANCE ──────────────── */}
      {activeTab === 'theme' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-600" />
              <span>Theme Tokens & Brand Colors</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize colors dynamically across all landing page buttons, gradients, badges, and cards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Primary Brand Color</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.theme.primaryColor}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, theme: { ...p.theme, primaryColor: e.target.value } }))
                  }
                  className="w-8 h-8 rounded-lg cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={config.theme.primaryColor}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, theme: { ...p.theme, primaryColor: e.target.value } }))
                  }
                  className="flex-1 px-2 py-1 rounded text-xs font-mono border"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Secondary Accent</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.theme.secondaryColor}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, theme: { ...p.theme, secondaryColor: e.target.value } }))
                  }
                  className="w-8 h-8 rounded-lg cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={config.theme.secondaryColor}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, theme: { ...p.theme, secondaryColor: e.target.value } }))
                  }
                  className="flex-1 px-2 py-1 rounded text-xs font-mono border"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Tertiary Gradient</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.theme.accentColor}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, theme: { ...p.theme, accentColor: e.target.value } }))
                  }
                  className="w-8 h-8 rounded-lg cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={config.theme.accentColor}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, theme: { ...p.theme, accentColor: e.target.value } }))
                  }
                  className="flex-1 px-2 py-1 rounded text-xs font-mono border"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Canvas Surface Color</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.theme.surfaceColor}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, theme: { ...p.theme, surfaceColor: e.target.value } }))
                  }
                  className="w-8 h-8 rounded-lg cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={config.theme.surfaceColor}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, theme: { ...p.theme, surfaceColor: e.target.value } }))
                  }
                  className="flex-1 px-2 py-1 rounded text-xs font-mono border"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Card Border Radius</label>
              <select
                value={config.theme.borderRadius}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, theme: { ...p.theme, borderRadius: e.target.value } }))
                }
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <option value="rounded-xl">Standard (rounded-xl)</option>
                <option value="rounded-2xl">Modern Soft (rounded-2xl)</option>
                <option value="rounded-3xl">Pill / Deep Curved (rounded-3xl)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Global Animations</label>
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setConfig((p) => ({
                      ...p,
                      theme: { ...p.theme, enableAnimations: !p.theme.enableAnimations },
                    }))
                  }
                  className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                    config.theme.enableAnimations ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {config.theme.enableAnimations ? 'Animations Enabled' : 'Animations Disabled'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 7: BUTTONS & CTAS ──────────────── */}
      {activeTab === 'buttons' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Link2 className="w-4 h-4 text-blue-600" />
            <span>Interactive CTA Buttons & Handlers</span>
          </h2>

          <div className="space-y-3">
            {config.hero.ctaButtons.map((btn, bIdx) => (
              <div
                key={bIdx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center"
              >
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Button #{bIdx + 1} Label</label>
                  <input
                    type="text"
                    value={btn.text}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfig((p) => {
                        const ctaButtons = [...p.hero.ctaButtons];
                        ctaButtons[bIdx] = { ...ctaButtons[bIdx], text: val };
                        return { ...p, hero: { ...p.hero, ctaButtons } };
                      });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Action Type</label>
                  <select
                    value={btn.action}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setConfig((p) => {
                        const ctaButtons = [...p.hero.ctaButtons];
                        ctaButtons[bIdx] = { ...ctaButtons[bIdx], action: val };
                        return { ...p, hero: { ...p.hero, ctaButtons } };
                      });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border"
                  >
                    <option value="modal_application">Open Application Modal</option>
                    <option value="modal_quiz">Open 2-Min Quiz Modal</option>
                    <option value="modal_video">Open Video Modal</option>
                    <option value="link">Custom URL Link</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Visibility</label>
                  <button
                    type="button"
                    onClick={() => {
                      setConfig((p) => {
                        const ctaButtons = [...p.hero.ctaButtons];
                        ctaButtons[bIdx] = { ...ctaButtons[bIdx], isVisible: !ctaButtons[bIdx].isVisible };
                        return { ...p, hero: { ...p.hero, ctaButtons } };
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      btn.isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {btn.isVisible ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────── TAB 8: FORMS & ALERTS ──────────────── */}
      {activeTab === 'forms' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Cohort Lead Alerts & Newsletter Settings</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Newsletter Card Badge</label>
              <input
                type="text"
                value={config.newsletter.badge}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, newsletter: { ...p.newsletter, badge: e.target.value } }))
                }
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Newsletter Headline</label>
              <input
                type="text"
                value={config.newsletter.title}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, newsletter: { ...p.newsletter, title: e.target.value } }))
                }
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Submit Button Label</label>
              <input
                type="text"
                value={config.newsletter.buttonText}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, newsletter: { ...p.newsletter, buttonText: e.target.value } }))
                }
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Input Placeholder</label>
              <input
                type="text"
                value={config.newsletter.placeholder}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, newsletter: { ...p.newsletter, placeholder: e.target.value } }))
                }
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border"
              />
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 9: SEO & SOCIAL ──────────────── */}
      {activeTab === 'seo' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-blue-600" />
            <span>Search Engine Optimization & Social Sharing Metadata</span>
          </h2>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Page Meta Title</label>
              <input
                type="text"
                value={config.seo.metaTitle}
                onChange={(e) => setConfig((p) => ({ ...p, seo: { ...p.seo, metaTitle: e.target.value } }))}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Meta Description</label>
              <textarea
                rows={2}
                value={config.seo.metaDescription}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, seo: { ...p.seo, metaDescription: e.target.value } }))
                }
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border"
              />
            </div>

            {/* Google SERP Search Snippet Simulation */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Google SERP Snippet Preview</span>
              <p className="text-xs text-blue-700 dark:text-blue-400 hover:underline cursor-pointer font-bold truncate">
                {config.seo.metaTitle}
              </p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400">https://interhive.in</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                {config.seo.metaDescription}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 10: ADVANCED SETTINGS ──────────────── */}
      {activeTab === 'advanced' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-600" />
            <span>Advanced Configuration & JSON Backup</span>
          </h2>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Raw JSON Inspection</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                  toast.success('Full CMS JSON configuration copied to clipboard!');
                }}
                className="text-xs font-bold text-blue-600 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> Copy JSON
              </button>
            </div>
            <textarea
              rows={8}
              readOnly
              value={JSON.stringify(config, null, 2)}
              className="w-full p-3 rounded-xl font-mono text-[10px] bg-slate-900 text-emerald-400 border border-slate-800"
            />
          </div>
        </div>
      )}

      {/* ──────────────── TAB 11: LIVE PREVIEW ──────────────── */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-black text-slate-700 dark:text-slate-300">Live Preview Frame</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewViewport('desktop')}
                className={`p-1.5 rounded-lg cursor-pointer ${
                  previewViewport === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-500'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport('tablet')}
                className={`p-1.5 rounded-lg cursor-pointer ${
                  previewViewport === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-500'
                }`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport('mobile')}
                className={`p-1.5 rounded-lg cursor-pointer ${
                  previewViewport === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-500'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-center bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[600px] overflow-hidden">
            <div
              className="transition-all duration-300 bg-white dark:bg-[#0c0e17] rounded-xl shadow-2xl overflow-hidden border border-slate-300 dark:border-slate-700 flex flex-col"
              style={{
                width: previewViewport === 'desktop' ? '100%' : previewViewport === 'tablet' ? '768px' : '375px',
                height: '650px',
              }}
            >
              <div className="bg-slate-800 text-white px-3 py-1.5 text-[10px] font-mono flex items-center justify-between">
                <span>InterHive Preview Sandbox • {previewViewport.toUpperCase()}</span>
                <span className="text-emerald-400">● LIVE CMS SYNC</span>
              </div>
              <iframe
                src="/?preview=draft"
                title="Live Landing Page Preview"
                className="w-full flex-1 border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 12: REVISION HISTORY ──────────────── */}
      {activeTab === 'history' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <span>Published Revisions & Audit History</span>
            </h2>
            <span className="text-xs text-slate-400 font-bold">{revisions.length} Snapshots Stored</span>
          </div>

          {revisionsLoading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : revisions.length > 0 ? (
            <div className="space-y-3">
              {revisions.map((rev) => (
                <div
                  key={rev._id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800">
                        Version {rev.version}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {rev.notes || `Published Release`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      By {rev.publishedBy || 'admin'} • {new Date(rev.publishedAt).toLocaleString()}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRestoreRevision(rev._id, rev.version)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border hover:bg-slate-50 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                    <span>Restore This Version</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              No previous revisions saved yet. Whenever you click "Publish Live", a snapshot is archived here.
            </div>
          )}
        </div>
      )}

      {/* ──────────────── TAB 13: RESET & RECOVERY ──────────────── */}
      {activeTab === 'reset' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121526] border border-rose-200 dark:border-rose-950/40 space-y-4">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertCircle className="w-5 h-5" />
            <h2 className="text-base font-black">Reset to InterHive Verified Codebase Baseline</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            If unwanted configuration changes have occurred, you can safely revert the entire landing page back to the verified default code baseline. This resets headlines, colors, sections, and FAQ items without deleting media assets or student application data.
          </p>

          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Landing Page to Code Defaults</span>
          </button>
        </div>
      )}

      {/* ──────────────── PUBLISH LIVE CONFIRMATION MODAL ──────────────── */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#121526] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Publish Landing Page Live</h3>
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This will update the live public website at <strong>interhive.in</strong>. A snapshot will be saved in Revision History for recovery.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Release Notes / Change Summary (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Updated hero background and PPO curriculum details"
                value={publishNotes}
                onChange={(e) => setPublishNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className="px-5 py-2 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isPublishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Confirm & Publish Live</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
