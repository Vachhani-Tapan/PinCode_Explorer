import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStates, fetchDistricts, fetchTaluks, fetchPincodes, setCurrentPage } from '../store/slices/pincodeSlice';
import SearchBar from '../components/SearchBar';

export default function FilterPanel() {
  const dispatch = useDispatch();
  const { states, districts, taluks } = useSelector(state => state.pincode);
  
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTaluk, setSelectedTaluk] = useState('');

  useEffect(() => {
    dispatch(fetchStates());
  }, [dispatch]);

  const handleStateChange = (e) => {
    const val = e.target.value;
    setSelectedState(val);
    setSelectedDistrict('');
    setSelectedTaluk('');
    if (val) dispatch(fetchDistricts(val));
    applyFilters(val, '', '');
  };

  const handleDistrictChange = (e) => {
    const val = e.target.value;
    setSelectedDistrict(val);
    setSelectedTaluk('');
    if (val) dispatch(fetchTaluks({ state: selectedState, district: val }));
    applyFilters(selectedState, val, '');
  };

  const handleTalukChange = (e) => {
    const val = e.target.value;
    setSelectedTaluk(val);
    applyFilters(selectedState, selectedDistrict, val);
  };

  const applyFilters = (s, d, t) => {
    dispatch(setCurrentPage(1));
    dispatch(fetchPincodes({ state: s, district: d, taluk: t, page: 1, limit: 20 }));
  };

  const handleExport = () => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    let url = `${API_BASE}/export?`;
    if (selectedState) url += `state=${selectedState}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-5">
      {/* Search */}
      <SearchBar placeholder="Search office, district, taluk, state, or PIN" />

      {/* Export Button */}
      <button
        onClick={handleExport}
        className="w-full py-3.5 rounded-2xl border-2 border-coral-200 text-coral-500 font-semibold text-sm hover:bg-coral-50 hover:border-coral-300 transition-all"
      >
        Export CSV
      </button>

      {/* Filter Dropdowns */}
      <div className="ui-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-[0.15em] mono mb-2">State</label>
            <select 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-100 focus:border-coral-300 outline-none text-sm bg-white text-ink appearance-none cursor-pointer"
              value={selectedState} 
              onChange={handleStateChange}
            >
              <option value="">Select state</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-[0.15em] mono mb-2">District</label>
            <select 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-100 focus:border-coral-300 outline-none text-sm bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed appearance-none cursor-pointer"
              value={selectedDistrict} 
              onChange={handleDistrictChange}
              disabled={!selectedState}
            >
              <option value="">{selectedState ? 'All Districts' : 'Choose state first'}</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-[0.15em] mono mb-2">Taluk</label>
            <select 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-100 focus:border-coral-300 outline-none text-sm bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed appearance-none cursor-pointer"
              value={selectedTaluk} 
              onChange={handleTalukChange}
              disabled={!selectedDistrict}
            >
              <option value="">{selectedDistrict ? 'All Taluks' : 'Choose district first'}</option>
              {taluks.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
