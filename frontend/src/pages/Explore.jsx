import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPincodes } from '../store/slices/pincodeSlice';
import FilterPanel from '../components/FilterPanel';
import DataTable from '../components/DataTable';

export default function Explore() {
  const dispatch = useDispatch();
  const { currentPage } = useSelector(state => state.pincode);

  useEffect(() => {
    dispatch(fetchPincodes({ page: currentPage, limit: 20 }));
  }, [dispatch, currentPage]);

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <section>
        <div className="section-label">Explorer</div>
        <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-ink leading-tight tracking-tight">
          Search, filter, and export the national PIN code directory.
        </h1>
      </section>

      {/* Filters */}
      <FilterPanel />
      
      {/* Data Table */}
      <DataTable />
    </div>
  );
}
