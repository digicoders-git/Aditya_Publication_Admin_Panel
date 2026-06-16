import React, { useState } from 'react';
import { 
  FiGrid, 
  FiBook, 
  FiUsers, 
  FiShoppingBag, 
  FiCreditCard, 
  FiTrendingUp, 
  FiSettings, 
  FiLogOut, 
  FiBookOpen,
  FiSliders,
  FiTag,
  FiRss,
  FiMail
} from 'react-icons/fi';
import ThemeSettings from './ThemeSettings';

export default function Sidebar({ activeTab, setActiveTab, adminUser, handleLogout, isOfflineMode, theme, font, setTheme, setFont, themeMode, setThemeMode }) {
  const [showTheme, setShowTheme] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'books', label: 'Manage Catalog', icon: FiBook },
    { id: 'offers', label: 'Special Offers', icon: FiTag },
    { id: 'news', label: 'Manage News', icon: FiRss },
    { id: 'users', label: 'User Accounts', icon: FiUsers },
    { id: 'contacts', label: 'Contact Queries', icon: FiMail },
    { id: 'orders', label: 'Sales Orders', icon: FiShoppingBag },
    { id: 'payments', label: 'Payments', icon: FiCreditCard },
    { id: 'reports', label: 'Sales Reports', icon: FiTrendingUp },
    { id: 'settings', label: 'Profile Settings', icon: FiSettings },
  ];

  return (
    <aside className="w-full md:w-64 md:h-full bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 accent-bg rounded-xl accent-shadow text-white shrink-0">
            <FiBookOpen className="text-2xl" />
          </div>
          <div>
            <h1 className="font-black text-base leading-tight tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Aditya Publication
            </h1>
            <p className="text-[10px] accent-text font-bold uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === item.id 
                  ? 'accent-bg/15 accent-text border accent-border/25 shadow-inner bg-opacity-10' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
              }`}
              style={activeTab === item.id ? {
                backgroundColor: 'rgb(var(--accent) / 0.12)',
                color: `rgb(var(--accent))`,
                borderColor: `rgb(var(--accent) / 0.25)`
              } : {}}
            >
              <Icon className="text-lg" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom: Theme + User + Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex flex-col gap-3 shrink-0 relative">

        {/* Theme Settings Panel */}
        {showTheme && (
          <ThemeSettings
            theme={theme}
            font={font}
            setTheme={setTheme}
            setFont={setFont}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            onClose={() => setShowTheme(false)}
          />
        )}

        {/* Appearance Toggle Button */}
        <button
          onClick={() => setShowTheme(p => !p)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            showTheme
              ? 'bg-slate-700 border-slate-600 text-slate-100'
              : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600'
          }`}
        >
          <FiSliders className="text-sm" />
          <span>Appearance</span>
          <span className="ml-auto text-[10px] font-black uppercase tracking-wider opacity-50">
            {theme} · {font}
          </span>
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3 p-1.5 rounded-lg overflow-hidden">
          {adminUser?.profilePic ? (
            <img
              src={adminUser.profilePic?.startsWith('http') ? adminUser.profilePic : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/${adminUser.profilePic}`}
              alt="profile"
              className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-700"
            />
          ) : (
            <div className="w-9 h-9 font-bold flex items-center justify-center rounded-xl shrink-0 text-white text-sm"
              style={{ backgroundColor: `rgb(var(--accent) / 0.2)`, color: `rgb(var(--accent))` }}>
              {adminUser?.name?.charAt(0) || 'A'}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-100 truncate">{adminUser?.name || 'Super Admin'}</p>
            <p className="text-[10px] text-slate-500 truncate">{adminUser?.email || ''}</p>
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-rose-950/30 hover:text-rose-400 text-slate-400 hover:border-rose-900/30 border border-slate-750 text-xs font-semibold rounded-lg transition-all cursor-pointer"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
