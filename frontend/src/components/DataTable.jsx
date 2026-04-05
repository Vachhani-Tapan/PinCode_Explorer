import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage } from '../store/slices/pincodeSlice';
import { useNavigate } from 'react-router-dom';

export default function DataTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pincodeData, totalParams, currentPage, currentQueryLimit, loadingPincodes } = useSelector(state => state.pincode);

  const totalPages = Math.ceil(totalParams / currentQueryLimit);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
    }
  };

  const handleRowClick = (pincode) => {
    navigate(`/pincode/${pincode}`);
  };

  const getTypeBadge = (row) => {
    const type = row.officeType || '';
    if (type.includes('H.O') || type.includes('Head')) return { label: 'H.O', cls: 'badge-ho' };
    if (type.includes('S.O') || type.includes('Sub')) return { label: 'S.O', cls: 'badge-so' };
    if (type.includes('B.O') || type.includes('Branch')) return { label: 'B.O', cls: 'badge-bo' };
    return { label: type || '—', cls: 'badge-so' };
  };

  return (
    <div className="ui-card !p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-[3px] border-coral-500">
              <th className="px-5 py-4 text-xs font-semibold text-muted uppercase tracking-[0.15em] mono">#</th>
              <th className="px-5 py-4 text-xs font-semibold text-muted uppercase tracking-[0.15em] mono">Pin Code</th>
              <th className="px-5 py-4 text-xs font-semibold text-muted uppercase tracking-[0.15em] mono">Office Name</th>
              <th className="px-5 py-4 text-xs font-semibold text-muted uppercase tracking-[0.15em] mono">Type</th>
              <th className="px-5 py-4 text-xs font-semibold text-muted uppercase tracking-[0.15em] mono">Delivery</th>
              <th className="px-5 py-4 text-xs font-semibold text-muted uppercase tracking-[0.15em] mono">Division</th>
              <th className="px-5 py-4 text-xs font-semibold text-muted uppercase tracking-[0.15em] mono">Taluk</th>
              <th className="px-5 py-4 text-xs font-semibold text-muted uppercase tracking-[0.15em] mono">District</th>
              <th className="px-5 py-4 text-xs font-semibold text-muted uppercase tracking-[0.15em] mono">State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loadingPincodes ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-6" /></td>
                  <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-16" /></td>
                  <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-32" /></td>
                  <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-10" /></td>
                  <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                  <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                  <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                  <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                  <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-16" /></td>
                </tr>
              ))
            ) : pincodeData.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-5 py-12 text-center text-muted font-medium">No results found for selected criteria.</td>
              </tr>
            ) : (
              pincodeData.map((row, idx) => {
                const typeBadge = getTypeBadge(row);
                return (
                  <tr 
                    key={row._id || row.pincode + row.officeName} 
                    className="hover:bg-gray-50/80 transition-colors cursor-pointer text-sm group"
                    onClick={() => handleRowClick(row.pincode)}
                  >
                    <td className="px-5 py-3.5 text-muted mono text-xs">{(currentPage - 1) * currentQueryLimit + idx + 1}</td>
                    <td className="px-5 py-3.5 font-bold text-ink mono">{row.pincode}</td>
                    <td className="px-5 py-3.5 text-ink">{row.officeName}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${typeBadge.cls}`}>{typeBadge.label}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${row.deliveryStatus?.toLowerCase().includes('non') ? 'badge-non-delivery' : 'badge-delivery'}`}>
                        {row.deliveryStatus?.toLowerCase().includes('non') ? 'Non-Delivery' : 'Delivery'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted text-sm">{row.divisionName || '—'}</td>
                    <td className="px-5 py-3.5 text-muted text-sm">{row.taluk || '—'}</td>
                    <td className="px-5 py-3.5 text-muted text-sm">{row.districtName}</td>
                    <td className="px-5 py-3.5 text-muted text-sm font-medium uppercase">{row.stateName}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
          <div className="text-sm text-muted">
            Showing <span className="font-semibold text-ink mono">{(currentPage - 1) * currentQueryLimit + 1}</span> to <span className="font-semibold text-ink mono">{Math.min(currentPage * currentQueryLimit, totalParams)}</span> of <span className="font-semibold text-ink mono">{totalParams.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 text-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="px-3 py-1 text-sm font-semibold text-ink mono">{currentPage}</span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 text-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
