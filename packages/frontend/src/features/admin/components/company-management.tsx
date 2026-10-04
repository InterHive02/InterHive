import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, CheckCircle, XCircle, Building2, X, AlertTriangle } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  legalName: string;
  logo?: string;
  industry: string[];
  size: number;
  website: string;
  email: string;
  phone: string;
  status: 'pending' | 'verified' | 'active' | 'suspended' | 'inactive';
  createdAt: Date;
  requirements: number;
  hires: number;
}

interface CompanyManagementProps {
  companies: Company[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAdd?: (data: Omit<Company, 'id' | 'createdAt' | 'requirements' | 'hires' | 'status'>) => Promise<void> | void;
  onVerify?: (id: string) => void;
  onSuspend?: (id: string) => void;
}

const INDUSTRY_OPTIONS = [
  'Technology', 'Software', 'FinTech', 'EdTech', 'HealthTech', 'E-Commerce',
  'Consulting', 'Banking & Finance', 'Media & Entertainment', 'Retail',
  'Manufacturing', 'Logistics', 'Government', 'NGO / Non-Profit', 'Other',
];

const SIZE_OPTIONS = [
  { label: '1–10 (Startup)', value: 10 },
  { label: '11–50 (Small)', value: 50 },
  { label: '51–200 (Mid-size)', value: 200 },
  { label: '201–500 (Growing)', value: 500 },
  { label: '501–1000 (Large)', value: 1000 },
  { label: '1000+ (Enterprise)', value: 5000 },
];

export const CompanyManagement: React.FC<CompanyManagementProps> = ({
  companies,
  onEdit,
  onDelete,
  onAdd,
  onVerify,
  onSuspend,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterIndustry, setFilterIndustry] = useState<string>('all');

  // Add company modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    legalName: '',
    industry: [] as string[],
    size: 50,
    website: '',
    email: '',
    phone: '',
    logo: '',
  });
  const [addError, setAddError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'active': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'suspended': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />;
      case 'suspended': return <XCircle className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const allIndustries = Array.from(new Set(companies.flatMap(c => c.industry)));

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || company.status === filterStatus;
    const matchesIndustry = filterIndustry === 'all' || company.industry.includes(filterIndustry);
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const toggleIndustry = (ind: string) => {
    setAddForm(prev => ({
      ...prev,
      industry: prev.industry.includes(ind)
        ? prev.industry.filter(i => i !== ind)
        : [...prev.industry, ind],
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    if (!addForm.name.trim()) { setAddError('Company name is required.'); return; }
    if (!addForm.legalName.trim()) { setAddError('Legal name is required.'); return; }
    if (addForm.industry.length === 0) { setAddError('Please select at least one industry.'); return; }
    if (!addForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addForm.email)) {
      setAddError('Please enter a valid email address.');
      return;
    }

    setIsAdding(true);
    try {
      await onAdd?.({
        name: addForm.name.trim(),
        legalName: addForm.legalName.trim(),
        industry: addForm.industry,
        size: addForm.size,
        website: addForm.website.trim(),
        email: addForm.email.trim(),
        phone: addForm.phone.trim(),
        logo: addForm.logo.trim() || undefined,
      });
      setShowAddModal(false);
      setAddForm({ name: '', legalName: '', industry: [], size: 50, website: '', email: '', phone: '', logo: '' });
    } catch (err: any) {
      setAddError(err?.response?.data?.message || 'Failed to add company. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Company Management
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[150px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
          >
            <option value="all">All Industries</option>
            {allIndustries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Stacked Card View (< 640px) */}
      <div className="block sm:hidden space-y-3">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} width={36} height={36} loading="lazy" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {company.name[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{company.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{company.legalName}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-lg shrink-0 ${getStatusColor(company.status)}`}>
                {getStatusIcon(company.status)}
                {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span>{company.requirements} Reqs</span>
                <span>•</span>
                <span>{company.hires} Hires</span>
              </div>
              <div className="flex items-center gap-1">
                {onEdit && (
                  <button onClick={() => onEdit(company.id)} aria-label="Edit company" className="p-2 min-h-[36px] min-w-[36px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-lg bg-gray-50 dark:bg-gray-700">
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => setDeleteTarget({ id: company.id, name: company.name })} aria-label="Delete company" className="p-2 min-h-[36px] min-w-[36px] text-red-400 hover:text-red-600 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Company</th>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Industry</th>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Requirements</th>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Hires</th>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Joined</th>
              <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} width={32} height={32} loading="lazy" className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {company.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{company.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{company.legalName}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {company.industry.slice(0, 2).map(industry => (
                      <span key={industry} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded-lg text-gray-600 dark:text-gray-300">
                        {industry}
                      </span>
                    ))}
                    {company.industry.length > 2 && (
                      <span className="text-xs text-gray-400">+{company.industry.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg ${getStatusColor(company.status)}`}>
                    {getStatusIcon(company.status)}
                    {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{company.requirements}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{company.hires}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                  {new Date(company.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    {onEdit && (
                      <button onClick={() => onEdit(company.id)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {company.status === 'pending' && onVerify && (
                      <button onClick={() => onVerify(company.id)} className="p-1.5 text-green-400 hover:text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" title="Verify">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {company.status !== 'suspended' ? (
                      onSuspend && (
                        <button onClick={() => onSuspend(company.id)} className="p-1.5 text-yellow-400 hover:text-yellow-600 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors" title="Suspend">
                          <XCircle className="w-4 h-4" />
                        </button>
                      )
                    ) : (
                      onVerify && (
                        <button onClick={() => onVerify(company.id)} className="p-1.5 text-green-400 hover:text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" title="Restore">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )
                    )}
                    {onDelete && (
                      <button
                        onClick={() => setDeleteTarget({ id: company.id, name: company.name })}
                        className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Remove company"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No companies found</p>
        </div>
      )}

      {/* ── ADD COMPANY MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90dvh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add New Company</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Fill in the company details below</p>
              </div>
              <button
                onClick={() => { setShowAddModal(false); setAddError(null); }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form body */}
            <form id="add-company-form" onSubmit={handleAddSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" required maxLength={100} value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. TechNova Solutions" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    Legal Name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" required maxLength={150} value={addForm.legalName} onChange={e => setAddForm(p => ({ ...p, legalName: e.target.value }))} placeholder="e.g. TechNova Solutions Pvt. Ltd." className={inputCls} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                  Industry <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRY_OPTIONS.map(ind => {
                    const selected = addForm.industry.includes(ind);
                    return (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => toggleIndustry(ind)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${selected ? 'bg-primary text-white border-primary' : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-primary'}`}
                      >
                        {ind}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Company Size</label>
                <select value={addForm.size} onChange={e => setAddForm(p => ({ ...p, size: Number(e.target.value) }))} className={inputCls}>
                  {SIZE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Website</label>
                <input type="url" maxLength={200} value={addForm.website} onChange={e => setAddForm(p => ({ ...p, website: e.target.value }))} placeholder="https://technova.com" className={inputCls} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input type="email" required maxLength={254} value={addForm.email} onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))} placeholder="hr@company.com" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Phone</label>
                  <input type="tel" maxLength={20} value={addForm.phone} onChange={e => setAddForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" className={inputCls} />
                </div>
              </div>

              {addError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {addError}
                </div>
              )}
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
              <button
                type="button"
                onClick={() => { setShowAddModal(false); setAddError(null); }}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-company-form"
                disabled={isAdding}
                className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isAdding ? 'Adding…' : 'Add Company'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Remove Company</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to remove <strong className="text-gray-900 dark:text-white">{deleteTarget.name}</strong> from the platform? All associated data will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete?.(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
