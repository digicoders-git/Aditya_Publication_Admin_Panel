import React from 'react';
import { FiShoppingBag } from 'react-icons/fi';

export default function SalesOrders({ orders, handleUpdateOrderStatus, showHardbooksOnly, setShowHardbooksOnly }) {
  return (
    <div className="space-y-6">
      {/* Toggle Segment */}
      <div className="flex gap-2 bg-slate-900 border border-slate-800/80 p-1.5 rounded-xl max-w-sm">
        <button 
          onClick={() => setShowHardbooksOnly(false)}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${!showHardbooksOnly ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
        >
          All Sales Orders
        </button>
        <button 
          onClick={() => setShowHardbooksOnly(true)}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${showHardbooksOnly ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Hardbooks Only
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        {orders.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <FiShoppingBag className="mx-auto text-4xl mb-3 text-slate-700" />
            <p className="font-bold text-sm">No sales orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-4 px-6">Order ID / Date</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Order Items</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Payment Status</th>
                  <th className="py-4 px-6">Shipping Destination</th>
                  <th className="py-4 px-6">Delivery Dispatch Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800/20 transition-all align-top">
                    <td className="py-4 px-6 min-w-[140px]">
                      <p className="text-xs font-bold text-slate-300 font-mono">#{order._id.slice(-8)}</p>
                      <p className="text-[10px] text-slate-500 mt-1 font-bold">
                        {new Date(order.createdAt).toLocaleDateString('en-GB')}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-200 text-xs truncate">{order.user?.name || 'Guest User'}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{order.user?.email}</p>
                    </td>
                    <td className="py-4 px-6 min-w-[180px]">
                      <div className="space-y-1">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="text-xs font-semibold">
                            <span className="font-bold text-slate-300">{item.book?.title || 'Unknown Title'}</span>
                            <span className="text-slate-500 font-bold ml-1">x{item.quantity}</span>
                            <span className="text-[10px] text-indigo-400 uppercase font-black ml-1.5">[{item.bookType}]</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-black text-sm text-slate-100">₹{order.totalAmount}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                        order.paymentStatus === 'failed' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {order.shippingAddress ? (
                        <div className="max-w-[180px] text-[11px] text-slate-400 leading-normal font-semibold">
                          <p className="font-bold text-slate-300">{order.shippingAddress.address}</p>
                          <p className="mt-0.5">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                          <p className="mt-0.5 font-bold text-slate-500">Mob: {order.shippingAddress.mobile}</p>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs font-semibold">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <select 
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className={`appearance-none bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-black focus:outline-none focus:border-indigo-500 cursor-pointer text-center ${
                          order.orderStatus === 'delivered' ? 'text-emerald-400' :
                          order.orderStatus === 'cancelled' ? 'text-rose-400' :
                          'text-amber-400'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
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
