import React, { useState } from 'react';
import { FiSearch, FiMail, FiTrash2, FiEye, FiClock, FiUser, FiPhone, FiX } from 'react-icons/fi';

export default function ManageContacts({ contacts, handleDeleteContact }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  const filteredContacts = contacts.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone && c.phone.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-2xl relative">
        <FiSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
        <input 
          type="text" 
          placeholder="Search enquiries by sender name, email, phone or message keyword..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none placeholder-slate-600 transition-all font-semibold"
        />
      </div>

      {/* Main Content Table */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        {filteredContacts.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <FiMail className="mx-auto text-4xl mb-3 text-slate-700" />
            <p className="font-bold text-sm">No contact enquiries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-4 px-6">Sender</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Message Preview</th>
                  <th className="py-4 px-6">Received</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-slate-800/20 transition-all group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold flex items-center justify-center rounded-full shrink-0">
                          {contact.name?.charAt(0) || 'C'}
                        </div>
                        <p className="font-bold text-slate-100 text-sm truncate max-w-[150px]">{contact.name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs text-slate-300 font-bold select-all">{contact.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs text-slate-400 font-semibold">{contact.phone || '—'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs text-slate-400 truncate max-w-[240px]">{contact.message}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                        <FiClock className="text-slate-600" />
                        <span>
                          {new Date(contact.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedContact(contact)}
                          title="View Message"
                          className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl transition-all cursor-pointer border border-indigo-500/15"
                        >
                          <FiEye className="text-sm" />
                        </button>
                        <button 
                          onClick={() => handleDeleteContact(contact._id)}
                          title="Delete Message"
                          className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all cursor-pointer border border-rose-500/15"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Message Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/15 text-indigo-400 rounded-xl">
                  <FiMail className="text-lg" />
                </div>
                <div>
                  <h3 className="font-black text-slate-100 text-sm">Enquiry Details</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {new Date(selectedContact.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedContact(null)}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition-all cursor-pointer"
              >
                <FiX className="text-base" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/40">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Sender Name</span>
                  <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
                    <FiUser className="text-indigo-400" />
                    <span>{selectedContact.name}</span>
                  </div>
                </div>
                <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/40">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Phone Number</span>
                  <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
                    <FiPhone className="text-indigo-400" />
                    <span>{selectedContact.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/40">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Email Address</span>
                <p className="text-slate-200 font-bold text-xs select-all">{selectedContact.email}</p>
              </div>

              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/40">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Message Body</span>
                <p className="text-slate-300 text-sm leading-relaxed font-semibold whitespace-pre-wrap selection:bg-indigo-500 selection:text-white">
                  {selectedContact.message}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950/40 border-t border-slate-800 flex justify-end gap-3">
              <button 
                onClick={() => {
                  const cid = selectedContact._id;
                  setSelectedContact(null);
                  handleDeleteContact(cid);
                }}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FiTrash2 />
                <span>Delete Message</span>
              </button>
              <button 
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
