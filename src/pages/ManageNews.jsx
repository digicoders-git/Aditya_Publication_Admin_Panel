import React, { useState } from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiToggleLeft, FiToggleRight, FiX, FiUploadCloud, FiCheck, FiFileText } from 'react-icons/fi';

const emptyForm = {
  title: '',
  excerpt: '',
  author: 'Admin',
  isPublished: true,
};

export default function ManageNews({ news = [], onToggle, onDelete, onSave }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setPreviewUrl('');
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      excerpt: item.excerpt || '',
      author: item.author || 'Admin',
      isPublished: item.isPublished ?? true,
    });
    setImageFile(null);
    setPreviewUrl(item.image || '');
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
    handleClose();
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
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400 font-semibold">{news.length} article{news.length !== 1 ? 's' : ''} total</p>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          <FiPlus /> Add News Article
        </button>
      </div>

      {/* Grid of news articles */}
      {news.length === 0 ? (
        <div className="py-24 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <FiFileText className="mx-auto text-4xl text-slate-700 mb-3" />
          <p className="text-slate-500 font-bold text-sm">No news articles yet. Post your first news article!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {news.map((item) => (
            <div key={item._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition-all group flex flex-col">
              {/* Image Preview */}
              <div className="relative h-44 bg-slate-800 overflow-hidden shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <FiFileText className="text-4xl" />
                  </div>
                )}
                <span className={`absolute top-3 left-3 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                  item.isPublished
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/25'
                }`}>
                  {item.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500 font-bold mb-2">
                    <span>By {item.author || 'Admin'}</span>
                    <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                  </div>
                  <h3 className="font-bold text-slate-100 text-sm line-clamp-2 mb-2 group-hover:text-indigo-400 transition-colors" title={item.title}>
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-3 mb-4">{item.excerpt}</p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-800/60 mt-auto">
                  <button
                    onClick={() => onToggle(item._id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      item.isPublished
                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/25'
                    }`}
                  >
                    {item.isPublished ? <FiToggleRight className="text-base" /> : <FiToggleLeft className="text-base" />}
                    {item.isPublished ? 'Published' : 'Draft'}
                  </button>
                  <button onClick={() => openEdit(item)} className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer">
                    <FiEdit3 />
                  </button>
                  <button onClick={() => onDelete(item._id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal / Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleClose}>
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <div>
                <h3 className="font-black text-white text-lg">{editingId ? 'Edit News Article' : 'Write News Article'}</h3>
                <p className="text-slate-400 text-xs mt-0.5">Fill in the fields below to sync with bookstore</p>
              </div>
              <button onClick={handleClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer">
                <FiX />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Image Input */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Article Cover Image</label>
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

              {/* Title & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Article Title <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. 10 Books That Will Change Your Perspective"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Author</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    placeholder="Admin"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Excerpt / Content <span className="text-rose-500">*</span></label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Provide a brief summary or content of the news article..."
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none font-semibold resize-none"
                  required
                />
              </div>

              {/* Publish Checkbox */}
              <div className="flex items-center gap-3 p-1">
                <input
                  type="checkbox"
                  id="newsPublish"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 text-indigo-600 bg-slate-950 cursor-pointer"
                />
                <label htmlFor="newsPublish" className="text-xs font-bold text-slate-300 cursor-pointer select-none">
                  Publish — make this news visible on the bookstore website immediately
                </label>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 pt-2 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                  {editingId ? 'Save Changes' : 'Publish Article'}
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
