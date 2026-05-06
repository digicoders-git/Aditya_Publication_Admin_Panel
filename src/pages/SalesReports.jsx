import React, { useState, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReactOfficial from 'highcharts-react-official';
const HighchartsReact = HighchartsReactOfficial.default || HighchartsReactOfficial;
import { FiTrendingUp, FiShoppingBag, FiCalendar, FiArrowUpRight, FiFilter, FiDollarSign, FiClock, FiActivity } from 'react-icons/fi';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function SalesReports({ overall, monthlySales, handleSalesReportFetch }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const onFilterSubmit = (e) => {
    e.preventDefault();
    handleSalesReportFetch(fromDate, toDate);
  };

  // Sort ascending by year then month
  const sortedSales = useMemo(() => {
    return [...(monthlySales || [])].sort((a, b) => {
      if (a._id.year !== b._id.year) return a._id.year - b._id.year;
      return a._id.month - b._id.month;
    });
  }, [monthlySales]);

  const categories      = sortedSales.map(s => `${MONTHS[(s._id?.month || 1) - 1]} ${s._id?.year}`);
  const revenueData     = sortedSales.map(s => s.totalSales  || 0);
  const ordersData      = sortedSales.map(s => s.totalOrders || 0);

  // Month-over-month growth for last vs previous month
  const growthPct = useMemo(() => {
    if (sortedSales.length < 2) return null;
    const last = sortedSales[sortedSales.length - 1].totalSales || 0;
    const prev = sortedSales[sortedSales.length - 2].totalSales || 0;
    if (prev === 0) return null;
    return (((last - prev) / prev) * 100).toFixed(1);
  }, [sortedSales]);

  const splineOptions = {
    chart: {
      type: 'areaspline',
      backgroundColor: 'transparent',
      height: 320,
      style: { fontFamily: 'inherit' },
      animation: { duration: 1200 },
    },
    title: { text: '' },
    xAxis: {
      categories,
      gridLineColor: 'rgba(255,255,255,0.04)',
      gridLineWidth: 1,
      labels: { style: { color: '#94a3b8', fontSize: '11px', fontWeight: '600' } },
      lineColor: '#1e293b',
      tickColor: '#1e293b',
    },
    yAxis: [
      {
        title: { text: 'Revenue (₹)', style: { color: '#10b981', fontSize: '11px', fontWeight: 'bold' } },
        labels: { format: '₹{value}', style: { color: '#10b981', fontSize: '10px', fontWeight: '600' } },
        gridLineColor: 'rgba(255,255,255,0.04)',
      },
      {
        title: { text: 'Orders', style: { color: '#06b6d4', fontSize: '11px', fontWeight: 'bold' } },
        labels: { style: { color: '#06b6d4', fontSize: '10px', fontWeight: '600' } },
        opposite: true,
        gridLineWidth: 0,
      },
    ],
    tooltip: {
      shared: true,
      backgroundColor: '#090d16',
      borderColor: '#1e293b',
      borderRadius: 14,
      style: { color: '#f1f5f9', fontSize: '12px' },
    },
    legend: {
      itemStyle: { color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' },
      itemHoverStyle: { color: '#ffffff' },
    },
    plotOptions: {
      areaspline: {
        lineWidth: 3.5,
        marker: { enabled: true, radius: 5, symbol: 'circle', lineWidth: 2, lineColor: '#090d16' },
        states: { hover: { lineWidth: 4.5 } },
      },
    },
    series: [
      {
        name: 'Revenue',
        yAxis: 0,
        data: revenueData,
        color: '#10b981',
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [[0, 'rgba(16,185,129,0.3)'], [1, 'rgba(16,185,129,0)']],
        },
      },
      {
        name: 'Orders',
        yAxis: 1,
        data: ordersData,
        color: '#06b6d4',
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [[0, 'rgba(6,182,212,0.2)'], [1, 'rgba(6,182,212,0)']],
        },
      },
    ],
    credits: { enabled: false },
  };

  const columnOptions = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      height: 260,
      style: { fontFamily: 'inherit' },
      animation: { duration: 1000 },
    },
    title: { text: '' },
    xAxis: {
      categories,
      labels: { style: { color: '#94a3b8', fontSize: '11px' } },
      lineColor: '#1e293b',
      tickColor: '#1e293b',
    },
    yAxis: {
      title: { text: '' },
      labels: { format: '₹{value}', style: { color: '#94a3b8', fontSize: '10px' } },
      gridLineColor: 'rgba(255,255,255,0.04)',
    },
    tooltip: {
      backgroundColor: '#090d16',
      borderColor: '#1e293b',
      borderRadius: 12,
      style: { color: '#f1f5f9', fontSize: '12px' },
      pointFormat: '<b>₹{point.y}</b>',
    },
    plotOptions: {
      column: {
        borderRadius: 6,
        colorByPoint: true,
        colors: ['#818cf8', '#34d399', '#22d3ee', '#fb923c', '#fb7185', '#a78bfa', '#fbbf24', '#6ee7b7'],
        dataLabels: {
          enabled: true,
          format: '₹{y}',
          style: { color: '#94a3b8', fontSize: '10px', fontWeight: '600', textOutline: 'none' },
        },
      },
    },
    series: [{ name: 'Revenue', data: revenueData }],
    legend: { enabled: false },
    credits: { enabled: false },
  };

  const hasData = sortedSales.length > 0;

  return (
    <div className="space-y-6">

      {/* Header + Filter */}
      <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl"><FiTrendingUp /></span>
              Sales & Revenue Analytics
            </h2>
            <p className="text-xs text-slate-400 font-bold mt-1.5 uppercase tracking-wider">Real-time business performance from database</p>
          </div>
          <form onSubmit={onFilterSubmit} className="flex flex-col sm:flex-row sm:items-end gap-4 bg-slate-950/40 p-4 border border-slate-800/40 rounded-2xl w-full lg:w-auto">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">From Date</label>
              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500/80 transition-colors cursor-pointer" />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">To Date</label>
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500/80 transition-colors cursor-pointer" />
            </div>
            <button type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.03] active:scale-95 cursor-pointer shadow-lg shadow-indigo-600/20 shrink-0 h-[36px]">
              <FiFilter /><span>Apply Filters</span>
            </button>
          </form>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 shadow-xl cursor-pointer">
          <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
              <FiDollarSign className="text-2xl" />
            </div>
          </div>
          <h3 className="text-4xl font-black text-white tracking-tight">₹{overall?.totalSales || 0}</h3>
          <div className="flex items-center gap-2 mt-2">
            {growthPct !== null ? (
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                Number(growthPct) >= 0
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-rose-500/15 text-rose-400'
              }`}>
                <FiArrowUpRight /> {growthPct >= 0 ? '+' : ''}{growthPct}% vs last month
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-bold">Paid orders only</span>
            )}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/30 hover:-translate-y-1 transition-all duration-300 shadow-xl cursor-pointer">
          <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
              <FiShoppingBag className="text-2xl" />
            </div>
          </div>
          <h3 className="text-4xl font-black text-white tracking-tight">{overall?.totalOrders || 0}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-slate-500 font-bold">
              {hasData ? `Across ${sortedSales.length} month${sortedSales.length > 1 ? 's' : ''}` : 'No data yet'}
            </span>
          </div>
        </div>
      </div>

      {/* Spline Chart */}
      <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-6 shadow-2xl relative overflow-hidden hover:border-slate-700 transition-all duration-300">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-black text-base text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <FiActivity className="text-indigo-400" />
              Revenue & Orders Trend
            </h4>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Monthly performance from database</p>
          </div>
          <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest shrink-0">
            <span className="flex items-center gap-2 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400" />Revenue</span>
            <span className="flex items-center gap-2 text-cyan-400"><span className="w-2 h-2 rounded-full bg-cyan-400" />Orders</span>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-slate-800/60 to-transparent mb-4" />
        {!hasData ? (
          <p className="py-16 text-center text-xs text-slate-500 font-bold">No paid orders found. Complete a payment to see data here.</p>
        ) : (
          <HighchartsReact highcharts={Highcharts} options={splineOptions} />
        )}
      </div>

      {/* Column Chart */}
      <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl hover:border-slate-700 transition-all duration-300">
        <h4 className="font-black text-sm text-slate-100 uppercase tracking-widest mb-1">Monthly Revenue Breakdown</h4>
        <div className="h-px bg-slate-800/60 mb-4" />
        {!hasData ? (
          <p className="py-16 text-center text-xs text-slate-500 font-bold">No data available yet.</p>
        ) : (
          <HighchartsReact highcharts={Highcharts} options={columnOptions} />
        )}
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl overflow-hidden shadow-2xl hover:border-slate-700 transition-all duration-300">
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2.5">
            <FiCalendar className="text-indigo-400 text-lg" />
            Monthly Ledger
          </h4>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
            <FiClock /> Live Data
          </span>
        </div>
        {!hasData ? (
          <p className="p-10 text-center text-xs text-slate-500 font-bold">No billing records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-800">
                  <th className="py-4 px-6">Month</th>
                  <th className="py-4 px-6">Orders</th>
                  <th className="py-4 px-6">Revenue</th>
                  <th className="py-4 px-6">Avg. Order Value</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {sortedSales.slice().reverse().map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/20 transition-all group cursor-pointer">
                    <td className="py-4 px-6 font-bold text-xs text-slate-300 group-hover:text-white">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        {MONTHS[(s._id?.month || 1) - 1]} {s._id?.year}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400 font-bold">{s.totalOrders}</td>
                    <td className="py-4 px-6 text-xs font-extrabold text-emerald-400">₹{s.totalSales}</td>
                    <td className="py-4 px-6 text-xs font-bold text-cyan-400">
                      ₹{s.totalOrders ? Math.round(s.totalSales / s.totalOrders) : 0}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                        <FiArrowUpRight /> Completed
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
