import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiBell, FiUsers, FiUser, FiX, FiSend } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const TYPE_OPTIONS = [
  { value: 'general', label: '📢 General', color: '#6366f1' },
  { value: 'order', label: '📦 Order', color: '#f59e0b' },
  { value: 'sale', label: '🏷️ Sale', color: '#10b981' },
  { value: 'newBook', label: '📚 New Book', color: '#3b82f6' },
  { value: 'shipping', label: '🚚 Shipping', color: '#8b5cf6' },
];

const getTypeInfo = (type) => TYPE_OPTIONS.find(t => t.value === type) || TYPE_OPTIONS[0];

const emptyForm = { title: '', message: '', type: 'general', targetUser: '' };

export default function ManageNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem('adminToken');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/notifications`, { headers });
      const data = await res.json();
      if (data.success) setNotifications(data.notifications || []);
    } catch (err) {
      showToast('Failed to load notifications', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, { headers });
      const data = await res.json();
      if (data.success) setUsers(data.users || []);
    } catch (err) { /* ignore */ }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      showToast('Title and message are required', 'error');
      return;
    }
    setIsSending(true);
    try {
      const payload = {
        title: form.title,
        message: form.message,
        type: form.type,
        targetUser: form.targetUser || null,
      };
      const res = await fetch(`${API_BASE_URL}/api/admin/notifications`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Notification sent successfully!');
        setForm(emptyForm);
        setShowForm(false);
        fetchNotifications();
      } else {
        showToast(data.message || 'Failed to send', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/notifications/${id}`, {
        method: 'DELETE',
        headers,
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => prev.filter(n => n._id !== id));
        showToast('Notification deleted');
      }
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: 'white', padding: '12px 20px', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontWeight: 600,
        }}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiBell style={{ color: '#f59e0b' }} /> Manage Notifications
          </h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''} sent
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            color: 'white', border: 'none', borderRadius: '10px',
            padding: '10px 20px', cursor: 'pointer', fontWeight: 600,
            fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px',
          }}
        >
          <FiPlus /> Send Notification
        </button>
      </div>

      {/* Send Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '28px',
            width: '90%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                <FiSend style={{ marginRight: '8px', color: '#f59e0b' }} />
                Send Notification
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '20px' }}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSend}>
              {/* Title */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Title *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Notification title..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Message *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Notification message..."
                  rows={3}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              {/* Type */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Type</label>
                <select
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                >
                  {TYPE_OPTIONS.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Target */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Send To
                </label>
                <select
                  value={form.targetUser}
                  onChange={e => setForm(f => ({ ...f, targetUser: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="">📢 All Users (Broadcast)</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>👤 {u.name} ({u.mobile || u.email})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 600, color: '#64748b' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  style={{
                    flex: 2, padding: '12px', borderRadius: '8px', border: 'none',
                    background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                    color: 'white', cursor: isSending ? 'not-allowed' : 'pointer',
                    fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}
                >
                  <FiSend /> {isSending ? 'Sending...' : 'Send Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading...</div>
      ) : notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
          <FiBell size={48} style={{ color: '#e2e8f0', marginBottom: '16px' }} />
          <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: '16px' }}>No notifications sent yet</p>
          <p style={{ color: '#cbd5e1', fontSize: '13px' }}>Click "Send Notification" to create your first one</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map(n => {
            const typeInfo = getTypeInfo(n.type);
            const isTargeted = !!n.targetUser;
            return (
              <div key={n._id} style={{
                background: 'white', borderRadius: '12px', padding: '16px 20px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                borderLeft: `4px solid ${typeInfo.color}`,
                display: 'flex', alignItems: 'flex-start', gap: '16px',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                  background: `${typeInfo.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                }}>
                  {typeInfo.label.split(' ')[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>{n.title}</span>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px',
                      background: `${typeInfo.color}18`, color: typeInfo.color,
                    }}>{typeInfo.label}</span>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px',
                      background: isTargeted ? '#3b82f618' : '#10b98118',
                      color: isTargeted ? '#3b82f6' : '#10b981',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      {isTargeted ? <><FiUser size={10}/> {n.targetUser?.name || 'Specific User'}</> : <><FiUsers size={10}/> All Users</>}
                    </span>
                  </div>
                  <p style={{ margin: '6px 0 4px', color: '#64748b', fontSize: '13px' }}>{n.message}</p>
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>{formatDate(n.createdAt)}</span>
                </div>
                <button
                  onClick={() => handleDelete(n._id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px', borderRadius: '6px', flexShrink: 0 }}
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
