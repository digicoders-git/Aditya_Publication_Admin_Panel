import React from 'react';
import { FiX, FiUploadCloud, FiCheck } from 'react-icons/fi';

export default function AddEditBook({ 
  editingBookId, 
  formData, 
  setFormData, 
  coverFile, 
  setCoverFile, 
  pdfFile, 
  setPdfFile, 
  handleSubmitBook, 
  resetBookForm, 
  setActiveTab 
}) {
  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl max-w-4xl mx-auto">
      <div className="p-6 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
        <div>
          <h3 className="font-black text-lg text-white">{editingBookId ? 'Modify Catalog Entry' : 'Create Database Record'}</h3>
          <p className="text-slate-400 text-xs mt-1">Provide comprehensive fields matching the MongoDB schemas.</p>
        </div>
        <button 
          onClick={() => { resetBookForm(); setActiveTab('books'); }} 
          className="text-slate-400 hover:text-white p-2 bg-slate-800/50 rounded-lg cursor-pointer"
        >
          <FiX />
        </button>
      </div>

      <form onSubmit={handleSubmitBook} className="p-6 md:p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Book Title <span className="text-rose-500">*</span>
            </label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter book title"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none transition-all font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Author Name <span className="text-rose-500">*</span>
            </label>
            <input 
              type="text" 
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Enter author's name"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none transition-all font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Category / Genre <span className="text-rose-500">*</span>
            </label>
            <input 
              type="text" 
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Fiction, Self-Help, Business, Sci-Fi..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none transition-all font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Medium Type <span className="text-rose-500">*</span>
            </label>
            <select 
              value={formData.bookType}
              onChange={(e) => setFormData({ ...formData, bookType: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none cursor-pointer transition-all font-bold"
            >
              <option value="pdf">PDF (Digital)</option>
              <option value="hardbook">Hardbook (Physical)</option>
              <option value="both">Both (Digital + Physical)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Retail Price ($) <span className="text-rose-500">*</span>
            </label>
            <input 
              type="number" 
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Enter retail price"
              min="0"
              step="0.01"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none transition-all font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Old Price ($) <span className="text-slate-500">(Optional)</span>
            </label>
            <input 
              type="number" 
              value={formData.oldPrice}
              onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
              placeholder="Price before discounts"
              min="0"
              step="0.01"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none transition-all font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Discount Percentage (%) <span className="text-slate-500">(Auto-calculated or manual)</span>
            </label>
            <input 
              type="number" 
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              placeholder={formData.oldPrice && formData.price ? `Auto: ${Math.round((1 - formData.price / formData.oldPrice) * 100)}%` : 'e.g. 15'}
              min="0"
              max="100"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none transition-all font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Listing Tag / Badge <span className="text-slate-500">(Optional)</span>
            </label>
            <input 
              type="text" 
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              placeholder="e.g. Bestseller, New Release, Limited Sale"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none transition-all font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Total Pages
            </label>
            <input 
              type="number" 
              value={formData.pages}
              onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
              placeholder="Number of pages"
              min="1"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none transition-all font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Book Language
            </label>
            <input 
              type="text" 
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              placeholder="English, Spanish, Hindi..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none transition-all font-semibold"
            />
          </div>

          {/* Cover Art Upload Field */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Book Cover Art <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-4 bg-slate-950 p-4 border border-slate-850 rounded-xl">
              <FiUploadCloud className="text-slate-500 text-3xl shrink-0" />
              <div className="flex-1 min-w-0">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files[0])}
                  className="text-xs text-slate-400 file:bg-slate-800 file:border-0 file:text-slate-200 file:px-4 file:py-2 file:rounded-lg file:mr-4 file:font-bold file:cursor-pointer cursor-pointer hover:file:bg-slate-700 hover:file:text-white"
                />
                <p className="text-[10px] text-slate-500 mt-1.5 font-semibold">PNG, JPG, JPEG up to 5MB. Matches bookThumbnail in MongoDB.</p>
              </div>
              {coverFile && (
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <FiCheck /> Selected
                </div>
              )}
            </div>
          </div>

          {/* PDF Book Upload Field */}
          {formData.bookType !== 'hardbook' && (
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                PDF Ebook File <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-4 bg-slate-950 p-4 border border-slate-850 rounded-xl">
                <FiUploadCloud className="text-slate-500 text-3xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <input 
                    type="file" 
                    accept=".pdf"
                    onChange={(e) => setPdfFile(e.target.files[0])}
                    className="text-xs text-slate-400 file:bg-slate-800 file:border-0 file:text-slate-200 file:px-4 file:py-2 file:rounded-lg file:mr-4 file:font-bold file:cursor-pointer cursor-pointer hover:file:bg-slate-700 hover:file:text-white"
                  />
                  <p className="text-[10px] text-slate-500 mt-1.5 font-semibold">Digital PDF book file. Uploads statically to server uploads directory.</p>
                </div>
                {pdfFile && (
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <FiCheck /> Selected
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Book Synopsis / Description <span className="text-rose-500">*</span>
            </label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide an overview/synopsis of the book"
              rows="4"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none transition-all resize-y font-semibold"
              required
            ></textarea>
          </div>

          {/* ── Section Visibility Panel ── */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              🗂️ Section Visibility &amp; Availability
            </label>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* isAvailable */}
              <label htmlFor="isAvailable" className="flex items-center justify-between gap-4 p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group">
                <div>
                  <p className="text-sm font-bold text-slate-200 group-hover:text-white">📚 Available on Catalog</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Show this book in the public bookstore listing</p>
                </div>
                <div className="relative shrink-0">
                  <input type="checkbox" id="isAvailable" checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-checked:bg-indigo-600 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-indigo-500"></div>
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
              </label>

              {/* isRecommended */}
              <label htmlFor="isRecommended" className="flex items-center justify-between gap-4 p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-800/50 cursor-pointer transition-all group">
                <div>
                  <p className="text-sm font-bold text-slate-200 group-hover:text-emerald-400">⭐ Recommended For You</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Appears in the Recommended section on homepage</p>
                </div>
                <div className="relative shrink-0">
                  <input type="checkbox" id="isRecommended" checked={formData.isRecommended}
                    onChange={(e) => setFormData({ ...formData, isRecommended: e.target.checked })}
                    className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-checked:bg-emerald-600 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-emerald-500"></div>
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
              </label>

              {/* isSpecialOffer */}
              <label htmlFor="isSpecialOffer" className="flex items-center justify-between gap-4 p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-orange-800/50 cursor-pointer transition-all group">
                <div>
                  <p className="text-sm font-bold text-slate-200 group-hover:text-orange-400">🏷️ Special Offer</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Appears in the Special Offers section on homepage</p>
                </div>
                <div className="relative shrink-0">
                  <input type="checkbox" id="isSpecialOffer" checked={formData.isSpecialOffer}
                    onChange={(e) => setFormData({ ...formData, isSpecialOffer: e.target.checked })}
                    className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-checked:bg-orange-500 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-orange-500"></div>
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
              </label>

              {/* isFeatured */}
              <label htmlFor="isFeatured" className="flex items-center justify-between gap-4 p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-violet-800/50 cursor-pointer transition-all group">
                <div>
                  <p className="text-sm font-bold text-slate-200 group-hover:text-violet-400">✨ Featured Collection</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Appears in the Featured Collections carousel</p>
                </div>
                <div className="relative shrink-0">
                  <input type="checkbox" id="isFeatured" checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-checked:bg-violet-600 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-violet-500"></div>
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
              </label>

              {/* isTopBook */}
              <label htmlFor="isTopBook" className="flex items-center justify-between gap-4 p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-800/50 cursor-pointer transition-all group sm:col-span-2">
                <div>
                  <p className="text-sm font-bold text-slate-200 group-hover:text-rose-400">🔥 Top Book This Season</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Appears in Top Books This Season grid on homepage</p>
                </div>
                <div className="relative shrink-0">
                  <input type="checkbox" id="isTopBook" checked={formData.isTopBook}
                    onChange={(e) => setFormData({ ...formData, isTopBook: e.target.checked })}
                    className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-checked:bg-rose-600 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-rose-500"></div>
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
              </label>

            </div>
          </div>

        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-800/80">
          <button 
            type="submit"
            className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-98 cursor-pointer"
          >
            {editingBookId ? 'Save Modifications' : 'Publish Listing'}
          </button>
          <button 
            type="button"
            onClick={() => { resetBookForm(); setActiveTab('books'); }}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl text-sm transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}
