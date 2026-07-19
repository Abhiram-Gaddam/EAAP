"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IndianRupee, Loader2, AlertCircle, 
  CheckCircle2, XCircle, Clock, FileText,
  MoreHorizontal, ShieldAlert, X, Receipt, Search, Filter, Download
} from 'lucide-react';

const fetchTransactions = async () => {
  const res = await fetch('/api/admin/financials');
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
};

const fetchTransactionDetails = async (id: string) => {
  const res = await fetch(`/api/admin/financials/${id}`);
  if (!res.ok) throw new Error('Failed to fetch transaction details');
  return res.json();
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit'
  }).format(new Date(dateString));
};

export default function AdminFinancialsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [txDetails, setTxDetails] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTransactions();
      setTransactions(data.transactions || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load financials.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        tx.paymentId?.toLowerCase().includes(searchLower) || 
        tx.User?.fullName?.toLowerCase().includes(searchLower) ||
        tx.User?.email?.toLowerCase().includes(searchLower);
      
      const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter;
      const matchesType = typeFilter === 'ALL' || tx.transactionType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [transactions, searchQuery, statusFilter, typeFilter]);

  const kpis = useMemo(() => {
    const successTxs = transactions.filter(tx => tx.status === 'SUCCESS');
    const totalCollected = successTxs.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const pendingCount = transactions.filter(tx => tx.status === 'PENDING').length;
    
    return {
      totalCollected,
      successfulCount: successTxs.length,
      pendingCount
    };
  }, [transactions]);

  const handleExportCSV = () => {
    const headers = ["Transaction ID", "Member Name", "Email", "Type", "Amount (INR)", "Date", "Status"];
    
    const rows = filteredTransactions.map(tx => [
      `"${tx.paymentId || tx.id.split('-')[0]}"`,
      `"${tx.User?.fullName || 'Unknown'}"`,
      `"${tx.User?.email || 'N/A'}"`,
      `"${tx.transactionType}"`,
      `"${tx.amount}"`,
      `"${formatDate(tx.date)}"`,
      `"${tx.status}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `EAAP_Financial_Report_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRowClick = async (id: string) => {
    try {
      setSelectedTxId(id);
      setIsDetailLoading(true);
      const data = await fetchTransactionDetails(id);
      setTxDetails(data);
    } catch (err: any) {
      alert(err.message || 'Failed to load details.');
      setSelectedTxId(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  return (
    <div className="space-y-8 px-4 bg-slate-50 min-h-screen py-8 font-sans pb-24">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 max-w-7xl mx-auto print:hidden">
        <motion.div 
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-medium text-[#1a365d] tracking-tight">Financials & Payments</h1>
          <p className="text-sm text-slate-500 font-normal mt-1">Monitor platform revenue, payment statuses, and generate reports.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <button 
            onClick={() => window.print()}
            disabled={filteredTransactions.length === 0}
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <FileText className="w-4 h-4 stroke-[1.5]" /> Print / PDF
          </button>
          
          <button 
            onClick={handleExportCSV}
            disabled={filteredTransactions.length === 0}
            className="px-5 py-2.5 bg-[#0096a4] text-white rounded-xl text-sm font-medium hover:bg-[#007a86] transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4 stroke-[1.5]" /> Export CSV
          </button>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1a365d]/5 flex items-center justify-center text-[#1a365d]">
              <IndianRupee className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Total Collected</p>
              <h3 className="text-3xl font-medium text-[#1a365d] tracking-tight">₹{kpis.totalCollected.toLocaleString()}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Successful Payments</p>
              <h3 className="text-3xl font-medium text-emerald-700 tracking-tight">{kpis.successfulCount}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Pending Verification</p>
              <h3 className="text-3xl font-medium text-amber-700 tracking-tight">{kpis.pendingCount}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="bg-white/80 backdrop-blur-2xl border border-slate-200/80 rounded-2xl p-2 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-3 relative z-10 print:hidden">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[1.5]" />
            <input 
              type="text" 
              placeholder="Search by ID, Name, or Email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-transparent border-none outline-none text-sm font-medium text-slate-800 placeholder:font-normal placeholder:text-slate-400"
            />
          </div>
          
          <div className="hidden md:block w-px bg-slate-200 my-2 shrink-0" />
          
          <div className="flex items-center gap-2 px-2 pb-2 md:pb-0 shrink-0 overflow-x-auto custom-thin-scrollbar">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <Filter className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium text-slate-600 pr-2 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <Receipt className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />
              <select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium text-slate-600 pr-2 cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="ADMISSION">Admission</option>
                <option value="EVENT">Event</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden print:shadow-none print:border-none">
          {isLoading ? (
            <div className="w-full py-32 flex flex-col items-center justify-center print:hidden">
              <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mb-4 stroke-[1.5]" />
              <p className="text-slate-500 font-medium text-sm tracking-wide">Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="w-full py-24 flex flex-col items-center justify-center text-center px-4 print:hidden">
              <AlertCircle className="w-10 h-10 text-red-400 mb-4 stroke-[1.5]" />
              <p className="text-slate-600 font-medium text-sm">{error}</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="w-full py-24 flex flex-col items-center justify-center text-center px-4 print:hidden">
              <Receipt className="w-10 h-10 text-slate-300 mb-4 stroke-[1.5]" />
              <p className="text-slate-500 font-medium text-sm">No transactions match your filters.</p>
              <button onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); setTypeFilter('ALL'); }} className="mt-4 px-4 py-2 bg-slate-50 text-[#0096a4] text-sm font-medium rounded-xl hover:bg-slate-100 transition-colors">Clear Filters</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 print:bg-white print:border-black">
                    <th className="px-8 py-5 text-[10px] font-medium text-slate-400 uppercase tracking-widest whitespace-nowrap print:text-black print:py-2">Transaction ID</th>
                    <th className="px-6 py-5 text-[10px] font-medium text-slate-400 uppercase tracking-widest whitespace-nowrap print:text-black print:py-2">Member</th>
                    <th className="px-6 py-5 text-[10px] font-medium text-slate-400 uppercase tracking-widest whitespace-nowrap print:text-black print:py-2">Amount</th>
                    <th className="px-6 py-5 text-[10px] font-medium text-slate-400 uppercase tracking-widest whitespace-nowrap print:text-black print:py-2">Date</th>
                    <th className="px-6 py-5 text-[10px] font-medium text-slate-400 uppercase tracking-widest whitespace-nowrap print:text-black print:py-2">Status</th>
                    <th className="px-8 py-5 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-right whitespace-nowrap print:hidden">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white print:divide-slate-200">
                  {filteredTransactions.map((tx) => (
                    <tr 
                      key={tx.id} 
                      onClick={() => handleRowClick(tx.id)}
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer print:break-inside-avoid"
                    >
                      <td className="px-8 py-4 print:py-2">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-slate-300 stroke-[1.5] print:hidden" />
                          <span className="text-sm font-medium text-slate-600 font-mono print:text-black">{tx.paymentId || tx.id.split('-')[0]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 print:py-2">
                        <div className="text-sm font-medium text-[#1a365d] print:text-black">{tx.User?.fullName || 'Unknown User'}</div>
                        <div className="text-[11px] text-slate-400 font-normal mt-0.5 print:text-slate-700">{tx.User?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-800 font-medium tracking-tight print:py-2 print:text-black">
                        ₹{tx.amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-normal print:py-2 print:text-black">
                        {formatDate(tx.date)}
                      </td>
                      <td className="px-6 py-4 print:py-2">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border print:border-none print:px-0 print:py-0 ${
                          tx.status === 'SUCCESS' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 
                          tx.status === 'FAILED' ? 'bg-red-50 border-red-100 text-red-700' : 
                          'bg-amber-50 border-amber-100 text-amber-700'
                        } print:bg-transparent print:text-black`}>
                          {tx.status === 'SUCCESS' && <CheckCircle2 className="w-3.5 h-3.5 stroke-[1.5] print:hidden" />}
                          {tx.status === 'FAILED' && <XCircle className="w-3.5 h-3.5 stroke-[1.5] print:hidden" />}
                          {tx.status !== 'SUCCESS' && tx.status !== 'FAILED' && <Clock className="w-3.5 h-3.5 stroke-[1.5] print:hidden" />}
                          <span className="text-[10px] font-medium uppercase tracking-widest print:text-xs">
                            {tx.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right print:hidden">
                        <div className="p-2 text-slate-400 group-hover:text-[#0096a4] group-hover:bg-[#0096a4]/5 rounded-xl inline-flex transition-colors">
                          <MoreHorizontal className="w-5 h-5 stroke-[1.5]" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedTxId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 print:hidden">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isDetailLoading && setSelectedTxId(null)}
              className="absolute inset-0 bg-[#0f213b]/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] border border-white/20"
            >
              {isDetailLoading ? (
                <div className="w-full py-32 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mb-4 stroke-[1.5]" />
                  <p className="text-slate-500 font-medium text-sm tracking-wide">Loading transaction record...</p>
                </div>
              ) : txDetails ? (
                <>
                  <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
                    <div>
                      <h3 className="text-xl font-medium text-[#1a365d] tracking-tight">Transaction Details</h3>
                      <p className="text-xs font-normal text-slate-500 mt-1 font-mono">ID: {txDetails.transaction.id}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedTxId(null)} 
                      className="p-2 text-slate-400 hover:text-[#1a365d] bg-white border border-slate-200 hover:bg-slate-50 rounded-full transition-colors shadow-sm"
                    >
                      <X className="w-5 h-5 stroke-[1.5]" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-auto p-6 md:p-8 space-y-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-4">Member Information</p>
                        <p className="text-base font-medium text-[#1a365d] mb-1">{txDetails.transaction.User?.fullName}</p>
                        <p className="text-sm font-normal text-slate-500 mb-4">{txDetails.transaction.User?.email}</p>
                        
                        {txDetails.membershipDetails && (
                          <div className="pt-4 border-t border-slate-50 space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium text-slate-400">Phone:</span>
                              <span className="font-medium text-slate-700">{txDetails.membershipDetails.phone}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="font-medium text-slate-400">Location:</span>
                              <span className="font-medium text-slate-700">{txDetails.membershipDetails.cityDistrict}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="font-medium text-slate-400">Status:</span>
                              <span className="font-medium text-emerald-600">{txDetails.membershipStatus}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-4">Payment Record</p>
                        <div className="flex items-end gap-2 mb-4">
                          <p className="text-3xl font-medium text-[#1a365d] tracking-tight">₹{txDetails.transaction.amount?.toLocaleString()}</p>
                          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1.5">{txDetails.transaction.transactionType}</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-mono">
                            <span className="text-slate-400 shrink-0">Gateway ID:</span>
                            <span className="text-slate-700 truncate">{txDetails.transaction.paymentGatewayId || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-mono">
                            <span className="text-slate-400 shrink-0">Payment ID:</span>
                            <span className="text-slate-700 truncate">{txDetails.transaction.paymentId || 'N/A'}</span>
                          </div>
                          <p className="text-xs font-normal text-slate-500 mt-2 pl-1">
                            Processed: {formatDate(txDetails.transaction.date)}
                          </p>
                        </div>
                      </div>

                    </div>

                    <div>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-3">Fulfillment Status</p>
                      
                      {txDetails.certificateIssued ? (
                        <div className="w-full p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                              <CheckCircle2 className="w-5 h-5 stroke-[1.5]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-emerald-800">Certificate Issued Successfully</p>
                              <p className="text-xs font-normal text-emerald-600/80 mt-0.5">Automated workflow completed.</p>
                            </div>
                          </div>
                          {txDetails.certificateUrl && (
                            <a 
                              href={txDetails.certificateUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-5 py-2.5 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                              <FileText className="w-4 h-4 stroke-[1.5]" /> View Document
                            </a>
                          )}
                        </div>
                      ) : txDetails.transaction.status === 'SUCCESS' ? (
                        <div className="w-full p-5 bg-amber-50 border border-amber-200/60 rounded-2xl flex items-start gap-3 shadow-sm">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                            <ShieldAlert className="w-5 h-5 stroke-[1.5]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-amber-800">Certificate Generation Pending</p>
                            <p className="text-xs font-normal text-amber-700/80 mt-0.5">
                              Payment succeeded, but the automated certificate generation is pending or delayed.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full p-5 bg-slate-50 border border-slate-200 border-dashed rounded-2xl flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-slate-400 stroke-[1.5]" />
                          <p className="text-sm font-normal text-slate-500">Certificate issuance is not applicable for incomplete transactions.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-slate-500 font-medium">Failed to load transaction data.</div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-thin-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-thin-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-thin-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-thin-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          table { width: 100% !important; border-collapse: collapse !important; }
          th, td { border-bottom: 1px solid #e2e8f0 !important; }
        }
      `}} />
    </div>
  );
}