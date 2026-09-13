import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Clock,
  MessageSquare,
  User,
  Plus,
  X,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { companyApi } from '../../../api/endpoints/company.api';
import { toast } from 'react-hot-toast';

export const HrLeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeLead, setActiveLead] = useState<any | null>(null);

  // Note State
  const [newNoteText, setNewNoteText] = useState('');
  const [isUpdatingLead, setIsUpdatingLead] = useState(false);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await companyApi.getLeads({
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        search: searchQuery.trim() || undefined,
      });
      const list = (res as any).data || res;
      setLeads(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load company leads:', err);
      toast.error('Failed to load company leads.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!activeLead) return;
    const leadId = activeLead._id || activeLead.id;

    setIsUpdatingLead(true);
    try {
      const res = await companyApi.updateLead(leadId, { status: newStatus });
      toast.success(`Lead status updated to ${newStatus}`);
      const updated = (res as any).data || res;
      setActiveLead(updated);
      setLeads(prev => prev.map(l => (l._id === leadId || l.id === leadId ? updated : l)));
    } catch (err) {
      toast.error('Failed to update status.');
    } finally {
      setIsUpdatingLead(false);
    }
  };

  const handleAddNote = async () => {
    if (!activeLead || !newNoteText.trim()) return;
    const leadId = activeLead._id || activeLead.id;

    setIsUpdatingLead(true);
    try {
      const res = await companyApi.updateLead(leadId, { note: newNoteText.trim() });
      toast.success('Follow-up note added');
      setNewNoteText('');
      const updated = (res as any).data || res;
      setActiveLead(updated);
      setLeads(prev => prev.map(l => (l._id === leadId || l.id === leadId ? updated : l)));
    } catch (err) {
      toast.error('Failed to add note.');
    } finally {
      setIsUpdatingLead(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">New Inquiry</span>;
      case 'contacted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Contacted</span>;
      case 'follow_up':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">Follow-up</span>;
      case 'discussion':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">In Discussion</span>;
      case 'converted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Converted</span>;
      case 'closed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Closed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Company Partnership Leads
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track business inquiries, hiring requirements, employer discussions, and partnership conversions.
          </p>
        </div>

        <button
          onClick={fetchLeads}
          className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
        >
          ↻ Refresh Leads
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search company, contact, email, tech stack..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 shrink-0">Filter Status:</span>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            <option value="all">All Leads</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="follow_up">Follow-up</option>
            <option value="discussion">In Discussion</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-700/80 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4">Company Name</th>
                <th className="py-3.5 px-4">Contact Person</th>
                <th className="py-3.5 px-4">Hiring Need / Tech Stack</th>
                <th className="py-3.5 px-4">Interns Needed</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Inquiry Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading company leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No company leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                leads.map(lead => {
                  const id = lead._id || lead.id || '';
                  return (
                    <tr
                      key={id}
                      onClick={() => setActiveLead(lead)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {lead.companyName}
                        </div>
                        {lead.industry && (
                          <div className="text-[10px] text-slate-400 mt-0.5">{lead.industry}</div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{lead.contactPerson}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{lead.email}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                          {lead.hiringRequirement || 'General Talent'}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                        {lead.internCount || '1-5'}
                      </td>

                      <td className="py-3 px-4">{getStatusBadge(lead.status)}</td>

                      <td className="py-3 px-4 text-slate-400">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Recent'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setActiveLead(lead);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-all"
                        >
                          Manage Lead →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LEAD DETAIL DRAWER */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100">
            
            {/* Drawer Header */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {activeLead.companyName}
                  </h2>
                  {getStatusBadge(activeLead.status)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Contact: {activeLead.contactPerson} • {activeLead.email}
                </p>
              </div>

              <button
                onClick={() => setActiveLead(null)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              
              {/* Status Update Dropdown */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  Update Lead Pipeline Status:
                </span>
                <div className="flex flex-wrap gap-2">
                  {['new', 'contacted', 'follow_up', 'discussion', 'converted', 'closed'].map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(st)}
                      disabled={isUpdatingLead}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                        activeLead.status === st
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 font-bold block mb-1">Phone Number:</span>
                  <a href={`tel:${activeLead.phone}`} className="font-semibold text-indigo-600 hover:underline">
                    {activeLead.phone}
                  </a>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 font-bold block mb-1">Work Email:</span>
                  <a href={`mailto:${activeLead.email}`} className="font-semibold text-indigo-600 hover:underline">
                    {activeLead.email}
                  </a>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 font-bold block mb-1">Interns Required:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{activeLead.internCount || '1-5'}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 font-bold block mb-1">Website:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-100">{activeLead.website || 'Not provided'}</span>
                </div>
              </div>

              {/* Requirement & Message */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300">Technical Requirement:</span>
                <p className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  {activeLead.hiringRequirement || 'General Engineering Interns'}
                </p>
              </div>

              {activeLead.message && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Employer Message / Notes:</span>
                  <p className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60 leading-relaxed">
                    {activeLead.message}
                  </p>
                </div>
              )}

              {/* Communication Notes */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-700 dark:text-slate-300">Communication & Follow-up Log:</span>
                
                <div className="space-y-2">
                  {activeLead.notes?.map((note: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                        <span>{note.author}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{note.text}</p>
                    </div>
                  ))}

                  {(!activeLead.notes || activeLead.notes.length === 0) && (
                    <p className="text-slate-400 italic">No notes logged yet.</p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    placeholder="Log a call, discussion note, or follow-up summary..."
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={isUpdatingLead || !newNoteText.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Add Log
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
