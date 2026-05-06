import React from 'react';
import { FiSearch, FiUsers } from 'react-icons/fi';

export default function UserAccounts({ users, searchQuery, setSearchQuery, handleToggleUserStatus }) {
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-2xl relative">
        <FiSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
        <input 
          type="text" 
          placeholder="Search users by name or email account..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none placeholder-slate-600 transition-all font-semibold"
        />
      </div>

      {/* Main Users Table */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        {filteredUsers.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <FiUsers className="mx-auto text-4xl mb-3 text-slate-700" />
            <p className="font-bold text-sm">No registered user accounts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-4 px-6">User Avatar</th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Contact</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6">Status Block</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-800/20 transition-all">
                    <td className="py-4 px-6 w-24">
                      <div className="w-9 h-9 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center justify-center rounded-full shrink-0">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-100 text-sm truncate">{user.name}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs text-slate-300 font-bold select-all">{user.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs text-slate-400 font-semibold">{user.mobile || 'Not provided'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs text-slate-400 font-semibold">
                        {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => handleToggleUserStatus(user._id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          user.isBlocked 
                            ? 'bg-rose-500/10 border-rose-500/25 text-rose-400 hover:bg-rose-500/20' 
                            : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        {user.isBlocked ? 'Blocked (Unblock)' : 'Active (Block)'}
                      </button>
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
