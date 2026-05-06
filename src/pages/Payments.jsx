import React from 'react';
import { FiCreditCard, FiCalendar, FiUser } from 'react-icons/fi';

export default function Payments({ payments, totalAmount }) {
  return (
    <div className="space-y-6">
      {/* Metrics Card */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden max-w-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Verified Revenue</span>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <FiCreditCard className="text-xl" />
          </div>
        </div>
        <h3 className="text-3xl font-black text-white">₹{totalAmount || 0}</h3>
        <p className="text-xs text-emerald-400 mt-2 font-semibold">Total from successfully paid invoices</p>
      </div>

      {/* Payments List Table */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        {payments.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <FiCreditCard className="mx-auto text-4xl mb-3 text-slate-700" />
            <p className="font-bold text-sm">No transaction payments logged</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-4 px-6">Transaction Date</th>
                  <th className="py-4 px-6">Order ID / Gateway Ref</th>
                  <th className="py-4 px-6">Customer Name</th>
                  <th className="py-4 px-6">Items Purchased</th>
                  <th className="py-4 px-6">Amount Paid</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-slate-800/20 transition-all">
                    <td className="py-4 px-6 font-semibold text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-slate-500" />
                        <span>{new Date(payment.createdAt).toLocaleDateString('en-GB')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs font-mono font-bold text-indigo-400">#{payment._id.slice(-8)}</p>
                      {payment.paymentId && (
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">PayRef: {payment.paymentId}</p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-indigo-500/10 text-indigo-400 font-bold flex items-center justify-center rounded-full text-xs">
                          {payment.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-200">{payment.user?.name || 'Customer'}</p>
                          <p className="text-[9px] text-slate-500">{payment.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs font-bold text-slate-300 truncate max-w-xs">
                        {payment.items?.map((item) => `${item.book?.title || 'Book'} (x${item.quantity})`).join(', ') || 'Catalog Book'}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-extrabold text-xs text-slate-200">₹{payment.totalAmount}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Paid
                      </span>
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
}
