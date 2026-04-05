import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPincodeDetails, searchPincodes, clearSearchSuggestions } from '../store/slices/pincodeSlice';

export default function Pincode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pincodeDetails, loadingDetails, searchSuggestions, loadingSearch } = useSelector(state => state.pincode);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchPincodeDetails(id));
    }
  }, [id, dispatch]);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (/^\d{6}$/.test(query.trim())) {
      navigate(`/pincode/${query.trim()}`);
      setQuery('');
      dispatch(clearSearchSuggestions());
    }
  };

  const handleSelect = (pincode) => {
    setQuery('');
    dispatch(clearSearchSuggestions());
    navigate(`/pincode/${pincode}`);
  };

  if (!id) {
    return (
      <div className="space-y-8 fade-in">
        <section>
          <div className="section-label">PIN Lookup</div>
          <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-ink leading-tight tracking-tight">
            Inspect a single PIN code record.
          </h1>
        </section>

        {/* Search */}
        <div className="relative max-w-xl">
          <form onSubmit={handleSearch} className="ui-card !p-2 flex items-center">
            <svg className="w-5 h-5 text-gray-400 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              className="flex-1 bg-transparent outline-none pl-3 pr-4 py-3 text-base text-ink placeholder-gray-400"
              placeholder="Enter a 6-digit PIN code..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {loadingSearch && (
              <div className="w-4 h-4 border-2 border-coral-500 border-t-transparent rounded-full animate-spin mr-3" />
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

        {/* Empty State */}
        <div className="ui-card flex flex-col items-center justify-center py-16 text-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="absolute mt-12 ml-10 w-6 h-6 bg-coral-500 rounded-full flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-ink mb-2">Ready when you are</h2>
          <p className="text-muted max-w-md leading-relaxed">
            Enter a six-digit PIN code above to inspect office details, delivery status, district, and circle metadata.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto fade-in space-y-6">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm font-medium text-muted hover:text-ink transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {loadingDetails ? (
        <div className="ui-card p-8 animate-pulse">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
            <div className="h-12 bg-gray-200 rounded w-24" />
          </div>
          <div className="grid grid-cols-2 gap-6 mt-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      ) : pincodeDetails ? (
        <div className="ui-card border-t-4 border-coral-500">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-gray-100 mb-6">
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-[0.15em] mono mb-1">{pincodeDetails.officeType || 'Post Office'}</p>
              <h1 className="text-2xl font-extrabold text-ink uppercase tracking-wide">{pincodeDetails.officeName}</h1>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <span className="text-4xl font-extrabold text-ink mono tracking-wider">{pincodeDetails.pincode}</span>
              <div className="mt-2">
                <span className={`badge ${pincodeDetails.deliveryStatus?.toLowerCase().includes('non') ? 'badge-non-delivery' : 'badge-delivery'}`}>
                  {pincodeDetails.deliveryStatus || 'Status Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-bold text-muted uppercase tracking-[0.2em] mono mb-4 pb-2 border-b border-gray-100">Location</h3>
              <div className="space-y-4">
                {[
                  { label: 'State / UT', value: pincodeDetails.stateName },
                  { label: 'District', value: pincodeDetails.districtName },
                  { label: 'Taluk', value: pincodeDetails.taluk || 'N/A' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-coral-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted font-semibold uppercase tracking-wider mono">{item.label}</p>
                      <p className="text-sm font-medium text-ink mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-muted uppercase tracking-[0.2em] mono mb-4 pb-2 border-b border-gray-100">Administrative</h3>
              <div className="space-y-4">
                {[
                  { label: 'Circle', value: pincodeDetails.circleName || 'N/A' },
                  { label: 'Region', value: pincodeDetails.regionName || 'N/A' },
                  { label: 'Division', value: pincodeDetails.divisionName || 'N/A' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted font-semibold uppercase tracking-wider mono">{item.label}</p>
                      <p className="text-sm font-medium text-ink mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="ui-card p-12 text-center">
          <h3 className="text-xl font-extrabold text-ink">Record Not Found</h3>
          <p className="text-muted mt-2">The requested PIN code details do not exist or may have been removed.</p>
        </div>
      )}
    </div>
  );
}
