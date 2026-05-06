import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiBook } from 'react-icons/fi';

export default function Notification({ notification }) {
  if (!notification) return null;

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
      notification.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200' : 
      notification.type === 'error' ? 'bg-rose-950/90 border-rose-500/30 text-rose-200' :
      'bg-cyan-950/90 border-cyan-500/30 text-cyan-200'
    }`}>
      {notification.type === 'success' && <FiCheckCircle className="text-emerald-400 text-xl shrink-0" />}
      {notification.type === 'error' && <FiAlertCircle className="text-rose-400 text-xl shrink-0" />}
      {notification.type === 'info' && <FiBook className="text-cyan-400 text-xl shrink-0" />}
      <span className="font-semibold text-sm">{notification.message}</span>
    </div>
  );
}
