import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiToggleLeft, FiToggleRight, FiX, FiUploadCloud, FiCheck, FiTag, FiSearch, FiChevronDown } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const emptyForm = {
  title: '',
  description: '',
  price: '',
  oldPrice: '',
  discountPercent: '',
  categories: [],   // array of selected categories
  offerCode: '',
  usageLimit: '',
  isActive: true,
};

// ── Category Search Dropdown ──────────────────────────────────────────────────
function CategoryDropdown({ selected, onChange, allCategories }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = allCategories.filter(
    (c) => c.toLowerCase().includes(search.toLowerCase()) && !selected.includes(c)
  );

  const toggle = (cat) => {
    onChange(selected.includes(cat) ? selected.filter((c) => c !== cat) : [...selected, cat]);
  };

  const remove = (cat) => onChange(selected.filter((c) => c !== cat));

  return (
    <div ref={ref} className="relative">
      {/* Selected tags + trigger */}
      <div
        onClick={() => setOpen((p) => !p)}
        className="min-h-[42px] w-full bg-slate-950 border border-slate-800 focus-within:border-indigo-500 rounded-xl px-3 py-2 flex flex-wrap gap-1.5 items-center cursor-pointer"
      >
        {selected.length === 0 && (
          <span className="text-slate-600 text-sm font-semibold select-none">Search & select categories...</span>
        )}
        {selected.map((cat) => (
          <span
            key={cat}
            className="flex items-center gap-1 bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 text-xs font-bold px-2 py-0.5 rounded-lg"
          >
            {cat}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); remove(cat); }}
              className="hover:text-rose-400 transition-colors cursor-pointer"
            >
              <FiX size={10} />
            </button>
          </span>
        ))}
        <FiChevronDown
          className={`ml-auto text-slate-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          size={14}
        />
      </div>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-slate-800">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={13} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search category..."
                autoFocus
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
              />
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-xs text-slate-600 font-semibold py-4">No categories found</p>
            ) : (
              filtered.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { toggle(cat); setSearch(''); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white font-semibold transition-colors cursor-pointer flex items-center justify-between"
                >
                  {cat}
                  {selected.includes(cat) && <FiCheck size={13} className="text-indigo-400" />}
                </button>
              ))
            )}
          </div>

          {/* Selected count footer */}
          {selected.length > 0 && (
            <div className="px-4 py-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-bold">{selected.length} selected</span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-[10px] text-rose-400 font-bold hover:text-rose-300 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ManageOffers({ offers, onToggle, onDelete, onSave }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [allCategories, setAllCategories] = useState([]);

  // Fetch all book categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch(`${API_BASE_URL}/api/admin/books`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.books?.length > 0) {
          const cats = [...new Set(data.books.map((b) => b.category).filter(Boolean))].sort();
          setAllCategories(cats);
        }
      } catch (err) {}
    };
    fetchCategories();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setPreviewUrl('');
    setShowForm(true);
  };

  const openEdit = (offer) => {
    setEditingId(offer._id);
    setForm({
      title: offer.title || '',
      description: offer.description || '',
      price: offer.price || '',
      oldPrice: offer.oldPrice || '',
      discountPercent: offer.discountPercent || '',
      categories: Array.isArray(offer.categories) ? offer.categories : [],
      offerCode: offer.offerCode || '',
      usageLimit: offer.usageLimit || '',
      isActive: offer.isActive,
    });
    setImageFile(null);
    setPreviewUrl(offer.image || '');
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ editingId, form, imageFile });
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setPreviewUrl('');
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setPreviewUrl('');
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400 font-semibold">{offers.length} offer{offers.length !== 1 ? 's' : ''} total</p>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          <FiPlus /> Add New Offer
        </button>
      </div>

      {/* Offers Grid */}
      {offers.length === 0 ? (
        <div className="py-24 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <FiTag className="mx-auto text-4xl text-slate-700 mb-3" />
          <p className="text-slate-500 font-bold text-sm">No offers yet. Create your first offer!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {offers.map((offer) => (
            <div key={offer._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition-all group">
              <div className="relative h-44 bg-slate-800 overflow-hidden">
                {offer.image ? (
                  <img
                    src={offer.image}
                    alt={offer.title}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <FiTag className="text-4xl" />
                  </div>
                )}
                <span className={`absolute top-3 left-3 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                  offer.isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/25'
                }`}>
                  {offer.isActive ? 'Active' : 'Inactive'}
                </span>
                {offer.discountPercent > 0 && (
                  <span className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    -{offer.discountPercent}%
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-slate-100 text-sm truncate mb-1">{offer.title}</h3>
                <p className="text-slate-500 text-xs line-clamp-2 mb-3">{offer.description}</p>

                {offer.categories?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {offer.categories.map((c, i) => (
                      <span key={i} className="text-[9px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <span className="font-black text-slate-100 text-base">₹{offer.price}</span>
                  {offer.oldPrice && <span className="text-slate-500 line-through text-xs">₹{offer.oldPrice}</span>}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggle(offer._id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      offer.isActive
                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/25'
                    }`}
                  >
                    {offer.isActive ? <FiToggleRight className="text-base" /> : <FiToggleLeft className="text-base" />}
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button onClick={() => openEdit(offer)} className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer">
                    <FiEdit3 />
                  </button>
                  <button onClick={() => onDelete(offer._id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleClose}>
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <div>
                <h3 className="font-black text-white text-lg">{editingId ? 'Edit Offer' : 'Create New Offer'}</h3>
                <p className="text-slate-400 text-xs mt-0.5">Fill in the details below</p>
              </div>
              <button onClick={handleClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer">
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Image */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Offer Image</label>
                <div className="flex gap-4 items-start">
                  {previewUrl && (
                    <img src={previewUrl} alt="preview" className="w-24 h-24 object-cover rounded-xl border border-slate-700 shrink-0" />
                  )}
                  <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
                    <FiUploadCloud className="text-slate-500 text-2xl shrink-0" />
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="text-xs text-slate-400 file:bg-slate-800 file:border-0 file:text-slate-200 file:px-3 file:py-1.5 file:rounded-lg file:mr-3 file:font-bold file:cursor-pointer cursor-pointer hover:file:bg-slate-700"
                      />
                      <p className="text-[10px] text-slate-600 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                    {imageFile && <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 shrink-0"><FiCheck /> Selected</span>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Offer Title <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Summer Sale — Seconds Part 1"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none font-semibold"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description <span className="text-rose-500">*</span></label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Short description of the offer..."
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none font-semibold resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Offer Price (₹) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 1699"
                    min="0"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Original Price (₹) <span className="text-slate-500">(Optional)</span></label>
                  <input
                    type="number"
                    value={form.oldPrice}
                    onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                    placeholder="e.g. 4199"
                    min="0"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Discount %
                    {form.price && form.oldPrice && Number(form.oldPrice) > Number(form.price) && (
                      <span className="ml-2 text-emerald-400 normal-case font-semibold">
                        (Auto: {Math.round((1 - form.price / form.oldPrice) * 100)}%)
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    value={form.discountPercent}
                    onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
                    placeholder={form.price && form.oldPrice && Number(form.oldPrice) > Number(form.price)
                      ? `${Math.round((1 - form.price / form.oldPrice) * 100)}`
                      : 'e.g. 60'}
                    min="0"
                    max="100"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Offer Code</label>
                    <button
                      type="button"
                      onClick={() => {
                        const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                        setForm({ ...form, offerCode: randomCode });
                      }}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                    >
                      Auto Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    value={form.offerCode}
                    onChange={(e) => setForm({ ...form, offerCode: e.target.value.toUpperCase() })}
                    placeholder="e.g. SUMMER50"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Usage Limit</label>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                    placeholder="e.g. 100"
                    min="1"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none font-semibold"
                  />
                </div>

                {/* ── Category Search Dropdown ── */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Categories
                    <span className="ml-1 text-slate-600 normal-case font-semibold">(from your books)</span>
                  </label>
                  <CategoryDropdown
                    selected={form.categories}
                    onChange={(cats) => setForm({ ...form, categories: cats })}
                    allCategories={allCategories}
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3 p-1">
                  <input
                    type="checkbox"
                    id="offerActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 text-indigo-600 bg-slate-950 cursor-pointer"
                  />
                  <label htmlFor="offerActive" className="text-xs font-bold text-slate-300 cursor-pointer select-none">
                    Active — show this offer on the bookstore website
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                  {editingId ? 'Save Changes' : 'Create Offer'}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
