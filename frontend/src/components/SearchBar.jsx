import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchPincodes, clearSearchSuggestions } from '../store/slices/pincodeSlice';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ large = false, placeholder }) {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchSuggestions, loadingSearch } = useSelector(state => state.pincode);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 2) {
        dispatch(searchPincodes(query));
      } else {
        dispatch(clearSearchSuggestions());
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, dispatch]);

  const handleSelect = (pincode) => {
    setQuery('');
    dispatch(clearSearchSuggestions());
    navigate(`/pincode/${pincode}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      if (/^\d{6}$/.test(query.trim())) {
        navigate(`/pincode/${query.trim()}`);
        setQuery('');
        dispatch(clearSearchSuggestions());
      }
    }
  };

  return (
    <div className={`relative w-full ${large ? 'max-w-3xl' : 'max-w-xl'}`}>
      <form onSubmit={handleSubmit} className={`relative flex items-center ${large ? 'ui-card !p-2' : ''}`}>
        <div className="relative flex-1 flex items-center">
          <svg 
            className={`absolute left-4 text-gray-400 ${large ? 'w-5 h-5' : 'w-4 h-4'}`} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            className={`w-full bg-transparent outline-none text-ink placeholder-gray-400 ${
              large 
                ? 'pl-12 pr-4 py-3 text-base' 
                : 'pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-2xl focus:border-coral-300 focus:ring-2 focus:ring-coral-100'
            }`}
            placeholder={placeholder || 'Search by PIN code, office name, district...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loadingSearch && (
            <div className="absolute right-4 w-4 h-4 border-2 border-coral-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        {large && (
          <button 
            type="submit"
            className="ml-2 px-8 py-3 bg-coral-500 hover:bg-coral-600 text-white font-semibold rounded-2xl transition-all hover:shadow-lg hover:shadow-coral-200 text-sm"
          >
            Search
          </button>
        )}
      </form>

      {searchSuggestions.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full bg-white shadow-xl border border-gray-100 rounded-2xl py-2 text-sm max-h-72 overflow-y-auto">
          {searchSuggestions.map((item) => (
            <li 
              key={item._id || item.pincode} 
              className="px-5 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center transition-colors"
              onClick={() => handleSelect(item.pincode)}
            >
              <div>
                <span className="font-bold mono text-ink">{item.pincode}</span>
                <span className="text-muted ml-2">— {item.officeName}</span>
              </div>
              <span className="text-xs text-muted font-medium">{item.districtName}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
