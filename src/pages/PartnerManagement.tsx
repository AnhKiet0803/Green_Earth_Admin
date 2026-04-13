import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Briefcase, CheckCircle2, Clock3, Filter, Loader2, Mail, Search, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { unwrapListData } from '../utils/unwrapListData';

type PartnerRequestStatus = 'new' | 'in_review' | 'accepted' | 'approved' | 'rejected';

interface PartnerRequest {
  id: number;
  organizationName: string;
  contactName: string;
  email: string;
  phoneNumber: string;
  website: string;
  country: string;
  companySize: string;
  industry: string;
  programTypeLabel: string;
  timeline: string;
  expectedContribution: string;
  message: string;
  partnerType: 'strategic' | 'technology' | 'community';
  submittedAt: string;
  status: PartnerRequestStatus;
  note: string;
}
const PARTNER_APPLICATION_API = 'http://localhost:8080/api/green_earth/partner-applications';

/** Backend ResponseDTO dùng field `messenge` (typo trong Java). */
function apiErrorText(result: { messenge?: string; message?: string } | null | undefined): string {
  return result?.messenge || result?.message || '';
}

const STATUS_LABEL: Record<PartnerRequestStatus, string> = {
  new: 'New',
  in_review: 'In Review',
  accepted: 'Accepted (pending account)',
  approved: 'Approved',
  rejected: 'Rejected',
};

const STATUS_STYLE: Record<PartnerRequestStatus, string> = {
  new: 'bg-blue-50 text-blue-700',
  in_review: 'bg-amber-50 text-amber-700',
  accepted: 'bg-cyan-50 text-cyan-800',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
};

export default function PartnerManagement() {
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [issuingId, setIssuingId] = useState<number | null>(null);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 350);
  const [statusFilter, setStatusFilter] = useState<'all' | PartnerRequestStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | PartnerRequest['partnerType']>('all');

  const fetchPartnerRequests = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: '0', size: '500' });
      if (debouncedSearch.trim()) params.set('q', debouncedSearch.trim());
      const response = await fetch(`${PARTNER_APPLICATION_API}?${params}`);
      const result = await response.json();
      const data = unwrapListData<Record<string, unknown>>(result?.data);
      const mapped: PartnerRequest[] = data.map((item: Record<string, unknown>) => ({
        id: item.id as number,
        organizationName: String(item.organizationName ?? ''),
        contactName: String(item.contactName ?? ''),
        email: String(item.email ?? ''),
        phoneNumber: String(item.phoneNumber ?? 'N/A'),
        website: String(item.website ?? ''),
        country: String(item.country ?? 'N/A'),
        companySize: String(item.companySize ?? 'N/A'),
        industry: String(item.industry ?? 'N/A'),
        programTypeLabel: String(item.programType ?? 'N/A'),
        timeline: String(item.timeline ?? 'N/A'),
        expectedContribution: String(item.expectedContribution ?? ''),
        message: String(item.message ?? ''),
        partnerType: String(item.programType || 'community').toLowerCase().includes('strategic')
          ? 'strategic'
          : String(item.programType || '').toLowerCase().includes('technology')
          ? 'technology'
          : 'community',
        submittedAt: item.submittedAt ? String(item.submittedAt).slice(0, 10) : '',
        status: (item.status || 'new') as PartnerRequestStatus,
        note: String(item.adminNote ?? item.message ?? ''),
      }));
      setRequests(mapped);
    } catch (error) {
      console.error('Cannot load partner requests', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchPartnerRequests();
  }, [fetchPartnerRequests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesType = typeFilter === 'all' || item.partnerType === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [requests, statusFilter, typeFilter]);

  const updateStatus = async (id: number, status: PartnerRequestStatus) => {
    setUpdatingId(id);
    setActionNotice(null);
    try {
      const response = await fetch(`${PARTNER_APPLICATION_API}/${id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(apiErrorText(result) || 'Unable to update partner request');
      }

      await fetchPartnerRequests();

      const statusText =
        status === 'accepted'
          ? 'Application accepted. Use “Create account & send email” to issue portal credentials to the address on file.'
          : status === 'in_review'
            ? 'Request moved to In Review.'
            : status === 'rejected'
              ? 'Request has been rejected.'
              : 'Request updated.';

      setActionNotice({ type: 'success', text: statusText });
    } catch (error) {
      setActionNotice({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update request.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const issueCredentials = async (id: number) => {
    setIssuingId(id);
    setActionNotice(null);
    try {
      const response = await fetch(`${PARTNER_APPLICATION_API}/${id}/issue-credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(apiErrorText(result) || 'Unable to issue partner credentials');
      }

      await fetchPartnerRequests();
      setActionNotice({
        type: 'success',
        text: 'Partner account created. Welcome email sent to the email stored on this application.',
      });
    } catch (error) {
      setActionNotice({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to issue credentials.',
      });
    } finally {
      setIssuingId(null);
    }
  };

  const summary = useMemo(
    () => ({
      total: requests.length,
      new: requests.filter((item) => item.status === 'new').length,
      inReview: requests.filter((item) => item.status === 'in_review').length,
      accepted: requests.filter((item) => item.status === 'accepted').length,
      approved: requests.filter((item) => item.status === 'approved').length,
    }),
    [requests]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Partner Management</h1>
          <p className="text-slate-500">Track incoming partner requests and update collaboration status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Requests', value: summary.total, icon: Briefcase, color: 'text-slate-700 bg-slate-100' },
          { label: 'New', value: summary.new, icon: Clock3, color: 'text-blue-700 bg-blue-100' },
          { label: 'In Review', value: summary.inReview, icon: Filter, color: 'text-amber-700 bg-amber-100' },
          { label: 'Pending account', value: summary.accepted, icon: Mail, color: 'text-cyan-700 bg-cyan-100' },
          { label: 'Approved', value: summary.approved, icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-100' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.color}`}>
                <item.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 space-y-4 shadow-sm">
        {actionNotice ? (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-semibold ${
              actionNotice.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {actionNotice.text}
          </div>
        ) : null}

        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by organization, contact, or email..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | PartnerRequestStatus)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in_review">In Review</option>
            <option value="accepted">Accepted (pending account)</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | PartnerRequest['partnerType'])}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">All Programs</option>
            <option value="strategic">Strategic</option>
            <option value="technology">Technology</option>
            <option value="community">Community</option>
          </select>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px]">
            <thead>
              <tr className="text-left border-b border-slate-100">
                <th className="py-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-500">Organization</th>
                <th className="py-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-500">Contact</th>
                <th className="py-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-500">Program</th>
                <th className="py-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-500">Submitted</th>
                <th className="py-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="py-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 align-top">
                  <td className="py-4 px-2">
                    <p className="font-semibold text-slate-900">{item.organizationName}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.country} • {item.companySize}</p>
                    <p className="text-xs text-slate-500 mt-1">Industry: {item.industry}</p>
                    {item.website ? (
                      <a href={item.website} target="_blank" rel="noreferrer" className="text-xs text-emerald-700 hover:underline break-all">
                        {item.website}
                      </a>
                    ) : null}
                  </td>
                  <td className="py-4 px-2">
                    <p className="text-sm font-medium text-slate-800">{item.contactName}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.email}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.phoneNumber}</p>
                  </td>
                  <td className="py-4 px-2">
                    <span className="inline-flex px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold capitalize">
                      {item.partnerType}
                    </span>
                    <p className="text-xs text-slate-500 mt-2">{item.programTypeLabel}</p>
                    <p className="text-xs text-slate-500 mt-1">Timeline: {item.timeline}</p>
                    {item.expectedContribution ? (
                      <p className="text-xs text-slate-500 mt-1 max-w-[220px]">Contribution: {item.expectedContribution}</p>
                    ) : null}
                  </td>
                  <td className="py-4 px-2 text-sm text-slate-600">{item.submittedAt}</td>
                  <td className="py-4 px-2">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${STATUS_STYLE[item.status]}`}>
                      {STATUS_LABEL[item.status]}
                    </span>
                    <p className="text-xs text-slate-500 mt-2 max-w-[240px]">{item.note || item.message}</p>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => updateStatus(item.id, 'in_review')}
                        disabled={updatingId === item.id || item.status === 'approved' || item.status === 'rejected'}
                        className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 disabled:opacity-50"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, 'accepted')}
                        disabled={
                          updatingId === item.id ||
                          item.status === 'accepted' ||
                          item.status === 'approved' ||
                          item.status === 'rejected'
                        }
                        className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                        title="Accept application; create login and send email in the next step"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => issueCredentials(item.id)}
                        disabled={
                          issuingId === item.id ||
                          item.status !== 'accepted' ||
                          updatingId === item.id
                        }
                        className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 hover:bg-indigo-100 inline-flex items-center gap-1 disabled:opacity-50"
                        title="Creates portal user and emails welcome instructions to the application email"
                      >
                        {issuingId === item.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Mail className="w-3 h-3" />
                        )}
                        Tạo tài khoản &amp; gửi email
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, 'rejected')}
                        disabled={updatingId === item.id || item.status === 'approved' || item.status === 'rejected'}
                        className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 inline-flex items-center gap-1 disabled:opacity-50"
                      >
                        <XCircle className="w-3 h-3" />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {filteredRequests.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">No partner requests match your current filters.</div>
        ) : null}
      </div>
    </div>
  );
}
