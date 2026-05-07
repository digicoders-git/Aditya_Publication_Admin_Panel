import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageBooks from './pages/ManageBooks';
import AddEditBook from './pages/AddEditBook';
import UserAccounts from './pages/UserAccounts';
import SalesOrders from './pages/SalesOrders';
import Payments from './pages/Payments';
import SalesReports from './pages/SalesReports';
import ManageOffers from './pages/ManageOffers';
import ProfileSettings from './pages/ProfileSettings';
import { FiPlus, FiLogOut, FiTrash2 } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [adminUser, setAdminUser] = useState(JSON.parse(localStorage.getItem('admin_details') || 'null'));
  const [activeTab, setActiveTab] = useState('dashboard');

  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentsTotal, setPaymentsTotal] = useState(0);
  const [overall, setOverall] = useState({ totalSales: 0, totalOrders: 0 });
  const [monthlySales, setMonthlySales] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalPDFs: 0, totalHardBooks: 0, totalOrders: 0, totalSales: 0 });
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showHardbooksOnly, setShowHardbooksOnly] = useState(false);

  const [theme, setThemeState] = useState(() => localStorage.getItem('admin_theme') || 'indigo');
  const [font, setFontState] = useState(() => localStorage.getItem('admin_font') || 'inter');
  const [themeMode, setThemeModeState] = useState(() => localStorage.getItem('admin_mode') || 'dark');

  const setTheme = (t) => { setThemeState(t); localStorage.setItem('admin_theme', t); document.documentElement.setAttribute('data-theme', t); };
  const setFont = (f) => { setFontState(f); localStorage.setItem('admin_font', f); document.documentElement.setAttribute('data-font', f); };
  const setThemeMode = (m) => { setThemeModeState(m); localStorage.setItem('admin_mode', m); };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-font', font);
    document.documentElement.setAttribute('data-mode', themeMode);
  }, [theme, font, themeMode]);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [editingBookId, setEditingBookId] = useState(null);
  const [formData, setFormData] = useState({ title: '', author: '', category: '', price: '', oldPrice: '', description: '', pages: '', language: 'English', bookType: 'pdf', badge: '', isAvailable: true, discount: '0' });
  const [coverFile, setCoverFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const getHeaders = () => ({ 'Authorization': `Bearer ${token}` });

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [statsRes, booksRes, usersRes, ordersRes, paymentsRes, reportsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/api/admin/books`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/api/admin/users`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/api/admin/orders`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/api/admin/payments`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/api/admin/reports/sales`, { headers: getHeaders() }),
      ]);

      if (statsRes.status === 401 || booksRes.status === 401 || usersRes.status === 401) {
        handleLogout();
        toast.error('Session expired. Please log in again.');
        return;
      }

      const [statsData, booksData, usersData, ordersData, paymentsData, reportsData] = await Promise.all([
        statsRes.json(), booksRes.json(), usersRes.json(), ordersRes.json(), paymentsRes.json(), reportsRes.json()
      ]);

      if (statsData.success) setStats(statsData.stats);
      if (booksData.success) setBooks(booksData.books);
      if (usersData.success) setUsers(usersData.users);
      if (ordersData.success) setOrders(ordersData.orders);
      if (paymentsData.success) { setPayments(paymentsData.payments); setPaymentsTotal(paymentsData.total); }
      if (reportsData.success) { setOverall(reportsData.overall); setMonthlySales(reportsData.monthlySales); }
    } catch (err) {
      toast.error('Failed to connect to server. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Load offers separately
  const loadOffers = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/offers`, { headers: getHeaders() });
      const data = await res.json();
      if (data.success) setOffers(data.offers);
    } catch (err) {}
  };

  useEffect(() => { if (token) { loadData(); loadOffers(); } }, [token]);

  useEffect(() => {
    const fetchAdminMe = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/me`, { headers: getHeaders() });
        const data = await res.json();
        if (data.success) { setAdminUser(data.admin); localStorage.setItem('admin_details', JSON.stringify(data.admin)); }
        else { handleLogout(); }
      } catch (err) {}
    };
    fetchAdminMe();
  }, [token]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const endpoint = showHardbooksOnly ? 'orders/hardbooks' : 'orders';
        const res = await fetch(`${API_BASE_URL}/api/admin/${endpoint}`, { headers: getHeaders() });
        const data = await res.json();
        if (data.success) setOrders(data.orders);
      } catch (err) {}
    };
    fetchOrders();
  }, [showHardbooksOnly, token]);

  const handleSalesReportFetch = async (from, to) => {
    setLoading(true);
    try {
      const params = [];
      if (from) params.push(`from=${from}`);
      if (to) params.push(`to=${to}`);
      const res = await fetch(`${API_BASE_URL}/api/admin/reports/sales${params.length ? `?${params.join('&')}` : ''}`, { headers: getHeaders() });
      const data = await res.json();
      if (data.success) { setOverall(data.overall); setMonthlySales(data.monthlySales); toast.success('Sales report updated'); }
      else toast.error(data.message);
    } catch (err) { toast.error('Failed to fetch report'); }
    finally { setLoading(false); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) { toast.error('Please fill in login details'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_details', JSON.stringify(data.admin));
        setToken(data.token);
        setAdminUser(data.admin);
        toast.success('Welcome back! Login Successful.');
      } else {
        toast.error(data.message || 'Invalid email or password');
      }
    } catch (err) {
      toast.error('Cannot connect to server. Please ensure backend is running.');
    } finally { setLoading(false); }
  };

  function handleLogout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_details');
    setToken('');
    setAdminUser(null);
    toast('Logged out successfully', { icon: <FiLogOut className="text-slate-400" /> });
  }

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/status`, { method: 'PATCH', headers: getHeaders() });
      const data = await res.json();
      if (data.success) { setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: data.user.isBlocked } : u)); toast.success(data.message); }
      else toast.error(data.message);
    } catch (err) { toast.error('Failed to update user status'); }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) { setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o)); toast.success('Order status updated'); }
      else toast.error(data.message);
    } catch (err) { toast.error('Failed to update order status'); }
  };

  const handleProfileUpdate = async ({ name, mobile, file }) => {
    setLoading(true);
    try {
      const fd = new FormData();
      if (name) fd.append('name', name);
      if (mobile) fd.append('mobile', mobile);
      if (file) fd.append('profilePic', file);
      const res = await fetch(`${API_BASE_URL}/api/admin/profile`, { method: 'PUT', headers: getHeaders(), body: fd });
      const data = await res.json();
      if (data.success) { setAdminUser(data.admin); localStorage.setItem('admin_details', JSON.stringify(data.admin)); toast.success(data.message); }
      else toast.error(data.message || 'Error updating profile');
    } catch (err) { toast.error('Failed to connect to backend'); }
    finally { setLoading(false); }
  };

  const handlePasswordChange = async ({ oldPassword, newPassword }) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/change-password`, {
        method: 'PATCH',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (data.success) toast.success(data.message);
      else toast.error(data.message || 'Error changing password');
    } catch (err) { toast.error('Failed to connect to backend'); }
    finally { setLoading(false); }
  };

  const handleDeleteBook = async (bookId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This book will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#475569',
      confirmButtonText: 'Yes, delete it!',
      background: '#0f172a',
      color: '#f1f5f9'
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/books/${bookId}`, { method: 'DELETE', headers: getHeaders() });
      const data = await res.json();
      if (data.success) {
        setBooks(books.filter(b => b._id !== bookId));
        toast.success(data.message || 'Book deleted successfully');
        loadData();
      } else toast.error(data.message);
    } catch (err) { toast.error('Failed to delete book'); }
  };

  const handleSubmitBook = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.category || !formData.price) { toast.error('Please fill in all required fields!'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      // Auto-calculate discount if oldPrice and price both present
      const finalFormData = { ...formData };
      if (finalFormData.oldPrice && finalFormData.price && Number(finalFormData.oldPrice) > Number(finalFormData.price)) {
        if (!finalFormData.discount || finalFormData.discount === '0') {
          finalFormData.discount = Math.round((1 - Number(finalFormData.price) / Number(finalFormData.oldPrice)) * 100).toString();
        }
      }
      Object.keys(finalFormData).forEach(k => fd.append(k, finalFormData[k]));
      if (coverFile) fd.append('image', coverFile);
      if (pdfFile) fd.append('pdf', pdfFile);
      const url = editingBookId ? `${API_BASE_URL}/api/admin/books/${editingBookId}` : `${API_BASE_URL}/api/admin/books`;
      const res = await fetch(url, { method: editingBookId ? 'PUT' : 'POST', headers: getHeaders(), body: fd });
      const data = await res.json();
      if (data.success) { toast.success(data.message); resetBookForm(); setActiveTab('books'); loadData(); }
      else toast.error(data.message || 'Error processing book');
    } catch (err) { toast.error('Server communication failed'); }
    finally { setLoading(false); }
  };

  const resetBookForm = () => {
    setEditingBookId(null);
    setFormData({ title: '', author: '', category: '', price: '', oldPrice: '', description: '', pages: '', language: 'English', bookType: 'pdf', badge: '', isAvailable: true, discount: '0' });
    setCoverFile(null); setPdfFile(null);
  };

  // ── Offer Handlers ──
  const handleToggleOffer = async (offerId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/offers/${offerId}/toggle`, { method: 'PATCH', headers: getHeaders() });
      const data = await res.json();
      if (data.success) {
        setOffers(offers.map(o => o._id === offerId ? { ...o, isActive: data.isActive } : o));
        toast.success(data.message);
      } else toast.error(data.message);
    } catch (err) { toast.error('Failed to toggle offer'); }
  };

  const handleDeleteOffer = async (offerId) => {
    const result = await Swal.fire({
      title: 'Delete this offer?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#475569',
      confirmButtonText: 'Yes, delete!',
      background: '#0f172a',
      color: '#f1f5f9',
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/offers/${offerId}`, { method: 'DELETE', headers: getHeaders() });
      const data = await res.json();
      if (data.success) { setOffers(offers.filter(o => o._id !== offerId)); toast.success(data.message); }
      else toast.error(data.message);
    } catch (err) { toast.error('Failed to delete offer'); }
  };

  const handleSaveOffer = async ({ editingId, form, imageFile }) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('price', form.price);
      if (form.oldPrice) fd.append('oldPrice', form.oldPrice);
      // Auto-calc discount if not provided
      const disc = form.discountPercent || (form.oldPrice && form.price ? Math.round((1 - form.price / form.oldPrice) * 100) : 0);
      fd.append('discountPercent', disc);
      fd.append('categories', form.categories);
      fd.append('isActive', form.isActive);
      if (imageFile) fd.append('image', imageFile);

      const url = editingId
        ? `${API_BASE_URL}/api/admin/offers/${editingId}`
        : `${API_BASE_URL}/api/admin/offers`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: getHeaders(), body: fd });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        loadOffers();
      } else toast.error(data.message || 'Error saving offer');
    } catch (err) { toast.error('Server error'); }
    finally { setLoading(false); }
  };

  const handleEditInit = (book) => {
    setEditingBookId(book._id);
    setFormData({ title: book.title || '', author: book.author || '', category: book.category || '', price: book.price || '', oldPrice: book.oldPrice || '', description: book.description || '', pages: book.pages || '', language: book.language || 'English', bookType: book.bookType || 'pdf', badge: book.badge || '', isAvailable: book.isAvailable ?? true, discount: book.discount?.toString() || '0' });
    setCoverFile(null); setPdfFile(null); setActiveTab('add_edit');
  };

  if (!token) {
    return (
      <Login
        loginEmail={loginEmail} setLoginEmail={setLoginEmail}
        loginPassword={loginPassword} setLoginPassword={setLoginPassword}
        handleLogin={handleLogin} loading={loading}
      />
    );
  }

  const tabTitles = { dashboard: 'Operations Dashboard', books: 'Book Catalog', offers: 'Special Offers', users: 'User Administration', orders: 'Order Management', payments: 'Transaction Payments', reports: 'Analytical Sales Reports', settings: 'System Profile Settings', add_edit: editingBookId ? 'Edit Book Details' : 'Publish New Book' };
  const tabSubs = { dashboard: 'Real-time overview of statistics, database metrics, and performance analytics.', books: 'Add, update, search, and manage books including covers and PDFs.', offers: 'Create, manage and toggle special offers shown on the bookstore website.', users: 'Monitor registered customer accounts, view detailed logs, and toggle access blocks.', orders: 'Manage payment status, shipping addresses, order item lists, and dispatching.', payments: 'Monitor verified payments, razorpay order IDs, and transactions logged.', reports: 'Review overall paid revenue trends and monthly performance breakdowns.', settings: 'Update your admin profile, upload avatar pictures, and rotate passwords.', add_edit: 'Provide full specifications to sync seamlessly with the backend MongoDB collections.' };

  const themeColors = { indigo: '99 102 241', violet: '139 92 246', rose: '244 63 94', emerald: '16 185 129', amber: '245 158 11', cyan: '6 182 212' };

  return (
    <div className="md:h-screen md:overflow-hidden min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row">
      <style>{`
        :root { --accent: ${themeColors[theme] || '99 102 241'} !important; }
        body, html, #root, .font-sans, h1, h2, h3, h4, h5, h6, p, span, button, input, select, textarea, table, td, th {
          font-family: ${font === 'mono' ? "'JetBrains Mono','Fira Code',monospace" : font === 'serif' ? "'Georgia',serif" : font === 'system' ? "system-ui,-apple-system,sans-serif" : "'Inter',sans-serif"} !important;
        }
        [class*="text-indigo-"], [class*="hover:text-indigo-"]:hover { color: rgb(${themeColors[theme] || '99 102 241'}) !important; }
        [class*="bg-indigo-600"] { background-color: rgb(${themeColors[theme] || '99 102 241'}) !important; }
        [class*="bg-indigo-500/10"] { background-color: rgba(${themeColors[theme] || '99 102 241'}, 0.1) !important; }
        [class*="border-indigo-"] { border-color: rgba(${themeColors[theme] || '99 102 241'}, 0.25) !important; }
        [class*="shadow-indigo-"] { --tw-shadow-color: rgba(${themeColors[theme] || '99 102 241'}, 0.3) !important; }
        @keyframes growUp { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes fillBar { from { width: 0% !important; } }
        @keyframes drawLine { from { stroke-dasharray: 200; stroke-dashoffset: 200; } to { stroke-dasharray: 200; stroke-dashoffset: 0; } }
        .animate-grow-y { animation: growUp 1.2s cubic-bezier(0.16,1,0.3,1) forwards; transform-origin: bottom; }
        .animate-fill-bar { animation: fillBar 1.5s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-draw-line { animation: drawLine 2.5s cubic-bezier(0.16,1,0.3,1) forwards; }

        /* ── Beautiful Sidebar Hover Active Accent ── */
        aside nav button:hover {
          background-color: rgba(${themeColors[theme] || '99 102 241'}, 0.08) !important;
          color: rgb(${themeColors[theme] || '99 102 241'}) !important;
          border-color: rgba(${themeColors[theme] || '99 102 241'}, 0.15) !important;
        }

        ${themeMode === 'light' ? `
          /* ── Light Mode Overrides (Full App & Sidebar) ── */
          body, html, #root, [class*="bg-slate-950"], main {
            background-color: #f8fafc !important;
            color: #0f172a !important;
          }
          
          /* Sidebar goes clean white in Light Mode */
          aside {
            background-color: #ffffff !important;
            border-color: #cbd5e1 !important;
          }
          aside h1 {
            background-image: none !important;
            color: #0f172a !important;
            -webkit-text-fill-color: #0f172a !important;
          }
          aside nav button {
            color: #475569 !important;
          }
          /* Hover on sidebar buttons goes blue-400 with transparent blue background */
          aside nav button:hover {
            background-color: rgba(96, 165, 250, 0.12) !important;
            color: #2563eb !important;
            border-color: rgba(96, 165, 250, 0.25) !important;
          }
          
          /* Main Content Area Overrides */
          [class*="bg-slate-900"], [class*="bg-slate-850"], [class*="bg-slate-800"] {
            background-color: #ffffff !important;
          }
          [class*="border-slate-800"], [class*="border-slate-700"] {
            border-color: #e2e8f0 !important;
          }
          [class*="text-slate-100"], [class*="text-slate-200"], [class*="text-slate-300"], [class*="text-white"], .text-white {
            color: #0f172a !important;
          }
          [class*="text-slate-400"] {
            color: #475569 !important;
          }
          [class*="text-slate-500"] {
            color: #64748b !important;
          }
          
          /* Badges, Pills, and Spans inside Content (Genre, Pages, etc.) */
          span[class*="bg-slate-"], span[class*="bg-slate-850"] {
            background-color: #f1f5f9 !important;
            color: #1e293b !important;
            border: 1px solid #cbd5e1 !important;
          }
          table th {
            background-color: #f8fafc !important;
            color: #475569 !important;
            border-bottom: 2px solid #e2e8f0 !important;
          }
          table tr:hover {
            background-color: rgba(96, 165, 250, 0.05) !important;
          }
          input, select, textarea {
            background-color: #ffffff !important;
            color: #0f172a !important;
            border-color: #cbd5e1 !important;
          }
          h1, h2, h3, h4, h5, h6, th, td {
            color: #0f172a !important;
          }
        ` : ''}
      `}</style>

      <Toaster position="bottom-right" toastOptions={{ duration: 4000, style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' } }} />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} adminUser={adminUser} handleLogout={handleLogout} theme={theme} font={font} setTheme={setTheme} setFont={setFont} themeMode={themeMode} setThemeMode={setThemeMode} />

      <main className="flex-1 min-w-0 p-6 md:p-8 md:h-full md:overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{tabTitles[activeTab]}</h2>
            <p className="text-slate-400 text-sm mt-1 font-semibold">{tabSubs[activeTab]}</p>
          </div>
          {activeTab === 'books' && (
            <button onClick={() => { resetBookForm(); setActiveTab('add_edit'); }}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer shrink-0">
              <FiPlus className="text-lg" /><span>Create Listing</span>
            </button>
          )}
        </header>

        {loading && (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Loading...</p>
          </div>
        )}

        {!loading && (
          <>
            {activeTab === 'dashboard' && <Dashboard stats={stats} books={books} orders={orders} setActiveTab={setActiveTab} />}
            {activeTab === 'books' && <ManageBooks books={books} searchQuery={searchQuery} setSearchQuery={setSearchQuery} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} handleEditInit={handleEditInit} handleDeleteBook={handleDeleteBook} />}
            {activeTab === 'offers' && <ManageOffers offers={offers} onToggle={handleToggleOffer} onDelete={handleDeleteOffer} onSave={handleSaveOffer} />}
            {activeTab === 'users' && <UserAccounts users={users} searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleToggleUserStatus={handleToggleUserStatus} />}
            {activeTab === 'orders' && <SalesOrders orders={orders} handleUpdateOrderStatus={handleUpdateOrderStatus} showHardbooksOnly={showHardbooksOnly} setShowHardbooksOnly={setShowHardbooksOnly} />}
            {activeTab === 'payments' && <Payments payments={payments} totalAmount={paymentsTotal} />}
            {activeTab === 'reports' && <SalesReports overall={overall} monthlySales={monthlySales} handleSalesReportFetch={handleSalesReportFetch} themeMode={themeMode} />}
            {activeTab === 'settings' && <ProfileSettings adminUser={adminUser} handleProfileUpdate={handleProfileUpdate} handlePasswordChange={handlePasswordChange} loading={loading} />}
            {activeTab === 'add_edit' && <AddEditBook editingBookId={editingBookId} formData={formData} setFormData={setFormData} coverFile={coverFile} setCoverFile={setCoverFile} pdfFile={pdfFile} setPdfFile={setPdfFile} handleSubmitBook={handleSubmitBook} resetBookForm={resetBookForm} setActiveTab={setActiveTab} />}
          </>
        )}
      </main>
    </div>
  );
}
