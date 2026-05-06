import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReactOfficial from 'highcharts-react-official';
const HighchartsReact = HighchartsReactOfficial.default || HighchartsReactOfficial;
import { FiUsers, FiBook, FiShoppingBag, FiActivity } from 'react-icons/fi';

// Dark theme globals for Highcharts
Highcharts.setOptions({
  chart: { backgroundColor: 'transparent', style: { fontFamily: 'inherit' } },
  title: { style: { color: '#f1f5f9' } },
  xAxis: { labels: { style: { color: '#94a3b8' } }, lineColor: '#1e293b', tickColor: '#1e293b', gridLineColor: '#1e293b' },
  yAxis: { labels: { style: { color: '#94a3b8' } }, gridLineColor: 'rgba(255,255,255,0.05)', title: { style: { color: '#94a3b8' } } },
  legend: { itemStyle: { color: '#94a3b8' }, itemHoverStyle: { color: '#f1f5f9' } },
  tooltip: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderRadius: 12,
    style: { color: '#f1f5f9', fontSize: '12px' },
  },
  credits: { enabled: false },
});

export default function Dashboard({ stats, books, orders, setActiveTab, API_BASE_URL }) {
  const totalBooks = (stats.totalPDFs || 0) + (stats.totalHardBooks || 0);

  const statCards = [
    { label: 'Users',  value: stats.totalUsers  || 0,          color: '#22d3ee', icon: FiUsers },
    { label: 'Books',  value: totalBooks,                       color: '#fb7185', icon: FiBook },
    { label: 'Sales',  value: `₹${stats.totalSales || 0}`,     color: '#fb923c', icon: FiShoppingBag },
    { label: 'Orders', value: stats.totalOrders  || 0,          color: '#818cf8', icon: FiActivity },
  ];

  // --- Daily Orders (last 7 days) ---
  const now = new Date();
  const dailyData = useMemo(() => {
    const counts = Array(7).fill(0);
    orders.forEach(o => {
      const diff = Math.floor((now - new Date(o.createdAt)) / 86400000);
      if (diff >= 0 && diff < 7) counts[6 - diff]++;
    });
    return counts;
  }, [orders]);

  const dayLabels = useMemo(() => {
    const d = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return Array.from({ length: 7 }, (_, i) => d[new Date(now - (6 - i) * 86400000).getDay()]);
  }, []);

  const dailyOrdersChart = {
    chart: { type: 'column', height: 200, animation: { duration: 1200, easing: 'easeOutBounce' } },
    title: { text: '' },
    xAxis: { categories: dayLabels, crosshair: true },
    yAxis: { title: { text: '' }, allowDecimals: false },
    plotOptions: {
      column: {
        borderRadius: 6,
        colorByPoint: false,
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [[0, '#818cf8'], [1, '#4f46e5']],
        },
        dataLabels: { enabled: true, style: { color: '#94a3b8', fontSize: '10px', fontWeight: '600' } },
      },
    },
    series: [{ name: 'Orders', data: dailyData }],
    legend: { enabled: false },
  };

  // --- Order Status Pie ---
  const statusCounts = useMemo(() => {
    const map = {};
    orders.forEach(o => { map[o.orderStatus] = (map[o.orderStatus] || 0) + 1; });
    return Object.entries(map).map(([name, y]) => ({ name, y }));
  }, [orders]);

  const statusColors = { pending: '#fbbf24', processing: '#818cf8', shipped: '#22d3ee', delivered: '#34d399', cancelled: '#fb7185' };

  const orderStatusChart = {
    chart: { type: 'pie', height: 200, animation: { duration: 1000 } },
    title: { text: '' },
    tooltip: { pointFormat: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)' },
    plotOptions: {
      pie: {
        innerSize: '55%',
        dataLabels: { enabled: true, format: '{point.name}: {point.y}', style: { color: '#94a3b8', fontSize: '10px' }, distance: 10 },
        showInLegend: false,
      },
    },
    series: [{
      name: 'Orders',
      data: statusCounts.length ? statusCounts.map(s => ({ ...s, color: statusColors[s.name] || '#64748b' })) : [{ name: 'No Data', y: 1, color: '#1e293b' }],
    }],
  };

  // --- Books: PDF vs Hardbook ---
  const bookTypeChart = {
    chart: { type: 'bar', height: 200, animation: { duration: 1000 } },
    title: { text: '' },
    xAxis: { categories: ['PDFs', 'Hard Books'] },
    yAxis: { title: { text: '' }, allowDecimals: false },
    plotOptions: {
      bar: {
        borderRadius: 6,
        dataLabels: { enabled: true, style: { color: '#94a3b8', fontSize: '11px' } },
        colorByPoint: true,
        colors: ['#818cf8', '#fb7185'],
      },
    },
    series: [{ name: 'Books', data: [stats.totalPDFs || 0, stats.totalHardBooks || 0] }],
    legend: { enabled: false },
  };

  return (
    <div className="space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300 shadow-lg cursor-pointer group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-xl transition-all group-hover:scale-110 group-hover:rotate-12 duration-500"
                style={{ backgroundColor: `${card.color}18`, color: card.color, border: `1px solid ${card.color}30` }}>
                <Icon />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">{card.value}</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Daily Orders */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all duration-300">
          <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-1">Daily Orders (7d)</h4>
          <div className="h-px bg-slate-800/60 mb-3" />
          <HighchartsReact highcharts={Highcharts} options={dailyOrdersChart} />
        </div>

        {/* Order Status Donut */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all duration-300">
          <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-1">Order Status</h4>
          <div className="h-px bg-slate-800/60 mb-3" />
          <HighchartsReact highcharts={Highcharts} options={orderStatusChart} />
        </div>

        {/* Book Types */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all duration-300">
          <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-1">Book Inventory</h4>
          <div className="h-px bg-slate-800/60 mb-3" />
          <HighchartsReact highcharts={Highcharts} options={bookTypeChart} />
        </div>

      </div>

      {/* Recent Orders & Books */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition-all duration-300">
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <FiShoppingBag className="text-indigo-400 text-lg" /><span>Recent Orders</span>
            </h4>
            <button onClick={() => setActiveTab('orders')} className="text-xs font-semibold text-indigo-400 hover:brightness-110 transition-all cursor-pointer">View All</button>
          </div>
          <div className="divide-y divide-slate-800/40">
            {orders.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-500 font-semibold">No recent orders.</p>
            ) : orders.slice(0, 5).map((order) => (
              <div key={order._id} className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-all group cursor-pointer">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 group-hover:text-white">{order.user?.name || 'Guest'}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{order.items?.length || 0} items • ₹{order.totalAmount}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  order.orderStatus === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  order.orderStatus === 'pending'   ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}>{order.orderStatus}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition-all duration-300">
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <FiBook className="text-rose-400 text-lg" /><span>Recently Added Books</span>
            </h4>
            <button onClick={() => setActiveTab('books')} className="text-xs font-semibold text-indigo-400 hover:brightness-110 transition-all cursor-pointer">View All</button>
          </div>
          <div className="divide-y divide-slate-800/40">
            {books.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-500 font-semibold">No books in store.</p>
            ) : books.slice(0, 5).map((book) => (
              <div key={book._id} className="p-3.5 flex items-center gap-3.5 hover:bg-slate-800/20 transition-all group cursor-pointer">
                <img
                  src={book.image?.startsWith('http') ? book.image : `${API_BASE_URL}/${book.image}`}
                  alt=""
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100'; }}
                  className="w-8 h-11 rounded object-cover border border-slate-800 shrink-0 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-200 truncate group-hover:text-white">{book.title}</p>
                  <p className="text-[10px] text-slate-500 truncate">{book.author} • {book.category}</p>
                </div>
                <span className="text-xs font-bold text-slate-300 group-hover:text-white shrink-0">₹{book.price}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
