import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('search');
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          name="search"
          placeholder="Search your favorite songs..."
          className="w-full px-6 py-4 pl-14 pr-32 rounded-2xl border border-slate-600 bg-slate-800/50 backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
          disabled={isLoading}
        />
        <Search className="absolute left-5 top-4 text-slate-400" size={24} />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition-all transform hover:scale-105 font-semibold shadow-lg shadow-purple-500/30"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;