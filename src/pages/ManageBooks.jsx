import React from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiBook, 
  FiEdit3, 
  FiTrash2 
} from 'react-icons/fi';

export default function ManageBooks({ 
  books, 
  searchQuery, 
  setSearchQuery, 
  categoryFilter, 
  setCategoryFilter, 
  handleEditInit, 
  handleDeleteBook, 
  API_BASE_URL 
}) {
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(books.map(b => b.category))];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-slate-900 border border-slate-800/80 p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search books by title, author, genre..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none placeholder-slate-600 transition-all font-semibold"
          />
        </div>
        <div className="relative shrink-0">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-300 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Genres' : cat}
              </option>
            ))}
          </select>
          <FiFilter className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        {filteredBooks.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <FiBook className="mx-auto text-4xl mb-3 text-slate-700" />
            <p className="font-bold text-sm">No books match your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-4 px-6 w-16">Cover</th>
                  <th className="py-4 px-6">Specifications</th>
                  <th className="py-4 px-6">Genre</th>
                  <th className="py-4 px-6">Medium</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Tag</th>
                  <th className="py-4 px-6">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredBooks.map((book) => (
                  <tr key={book._id} className="hover:bg-slate-800/20 transition-all">
                    <td className="py-4 px-6">
                      <img 
                        src={book.image?.startsWith('http') ? book.image : `${API_BASE_URL}/${book.image}`} 
                        alt="" 
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500'; }}
                        className="w-11 h-15 object-cover rounded shadow-md border border-slate-800 shrink-0"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="max-w-xs">
                        <p className="font-bold text-slate-100 text-sm truncate">{book.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{book.author}</p>
                        {book.pages && (
                          <span className="inline-block text-[9px] bg-slate-850 text-slate-400 px-1.5 py-0.5 mt-1 rounded font-bold">
                            {book.pages} pages
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {book.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-extrabold uppercase ${
                        book.bookType === 'pdf' ? 'text-amber-400' :
                        book.bookType === 'hardbook' ? 'text-rose-400' : 'text-indigo-400'
                      }`}>
                        {book.bookType}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-slate-100">₹{book.price}</span>
                          {book.discount > 0 && (
                            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 font-extrabold px-1.5 rounded">
                              -{book.discount}%
                            </span>
                          )}
                        </div>
                        {book.oldPrice && (
                          <span className="text-xs text-slate-500 line-through mt-0.5">₹{book.oldPrice}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {book.badge ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {book.badge}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditInit(book)}
                          className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-850 rounded-lg transition-all cursor-pointer"
                          title="Edit Book"
                        >
                          <FiEdit3 className="text-sm" />
                        </button>
                        <button 
                          onClick={() => handleDeleteBook(book._id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-850 rounded-lg transition-all cursor-pointer"
                          title="Delete Book"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
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
