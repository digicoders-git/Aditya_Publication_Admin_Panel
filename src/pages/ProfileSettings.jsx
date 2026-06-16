import React, { useState, useEffect } from 'react';
import { FiUser, FiUploadCloud, FiLock, FiCheck } from 'react-icons/fi';

export default function ProfileSettings({ 
  adminUser, 
  handleProfileUpdate, 
  handlePasswordChange, 
  loading 
}) {
  const [name, setName] = useState(adminUser?.name || '');
  const [mobile, setMobile] = useState(adminUser?.mobile || '');
  const [profilePicFile, setProfilePicFile] = useState(null);

  useEffect(() => {
    setName(adminUser?.name || '');
    setMobile(adminUser?.mobile || '');
  }, [adminUser]);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const onProfileSubmit = (e) => {
    e.preventDefault();
    handleProfileUpdate({ name, mobile, file: profilePicFile });
  };

  const onPasswordSubmit = (e) => {
    e.preventDefault();
    handlePasswordChange({ oldPassword, newPassword });
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
      
      {/* 1. Account Details Form */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800/80 bg-slate-900/40">
          <h3 className="font-black text-base text-white flex items-center gap-2">
            <FiUser className="text-indigo-400" />
            <span>Edit Admin Profile</span>
          </h3>
          <p className="text-slate-400 text-xs mt-1">Modify your identity records inside the Mongo collection.</p>
        </div>

        <form onSubmit={onProfileSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Full Username
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Registered Email <span className="text-slate-600">(Unmodifiable)</span>
            </label>
            <input 
              type="email" 
              value={adminUser?.email || ''}
              disabled
              className="w-full bg-slate-950/40 border border-slate-800/60 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Mobile Contact
            </label>
            <input 
              type="text" 
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Avatar Picture
            </label>
            <div className="flex items-center gap-4 bg-slate-950 p-4 border border-slate-800 rounded-xl">
              <FiUploadCloud className="text-slate-500 text-2xl shrink-0" />
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setProfilePicFile(e.target.files[0])}
                className="text-xs text-slate-400 file:bg-slate-800 file:border-0 file:text-slate-200 file:px-3 file:py-1.5 file:rounded-lg file:mr-4 file:font-bold file:cursor-pointer cursor-pointer hover:file:bg-slate-700"
              />
              {profilePicFile && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 shrink-0">
                  <FiCheck /> Ready
                </span>
              )}
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Processing...' : 'Save Profile Details'}
          </button>
        </form>
      </div>

      {/* 2. Security / Password Update Form */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800/80 bg-slate-900/40">
          <h3 className="font-black text-base text-white flex items-center gap-2">
            <FiLock className="text-rose-400" />
            <span>Update Credentials</span>
          </h3>
          <p className="text-slate-400 text-xs mt-1">Alter admin credentials with full encryption protocols.</p>
        </div>

        <form onSubmit={onPasswordSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Old Password
            </label>
            <input 
              type="password" 
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              New Secure Password
            </label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none font-semibold"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-rose-600/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Processing...' : 'Apply New Password'}
          </button>
        </form>
      </div>

    </div>
  );
}
