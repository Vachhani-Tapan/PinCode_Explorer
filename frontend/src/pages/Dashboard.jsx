import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStats,
  fetchStateDistribution,
  fetchDeliveryDistribution,
  fetchOfficeTypeDistribution,
  fetchRegionDistribution,
  fetchTopDistricts,
} from '../store/slices/pincodeSlice';
import { MapPinIcon, MapIcon, TruckIcon, BuildingOfficeIcon } from '@heroicons/react/24/solid';
import StatsCard from '../components/StatsCard';
import SearchBar from '../components/SearchBar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    generalStats,
    stateDistribution,
    deliveryDistribution,
    officeTypeDistribution,
    regionDistribution,
    topDistricts,
    loadingStats,
  } = useSelector(state => state.pincode);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchStateDistribution());
    dispatch(fetchDeliveryDistribution());
    dispatch(fetchOfficeTypeDistribution());
    dispatch(fetchRegionDistribution());
    dispatch(fetchTopDistricts());
  }, [dispatch]);

  const tryTerms = ['380001', 'Ahmedabad', 'Tamil Nadu'];

  // Real data
  const totalOffices = generalStats?.totalPincodes || 0;
  const deliveryCount = generalStats?.deliveryOffices || 0;
  const nonDeliveryCount = generalStats?.nonDeliveryOffices || 0;

  // Office type data from API
  const hoCount = officeTypeDistribution?.['H.O'] || 0;
  const soCount = officeTypeDistribution?.['S.O'] || 0;
  const boCount = officeTypeDistribution?.['B.O'] || 0;
  const officeTotal = hoCount + soCount + boCount || 1;

  // State distribution
  const top10 = stateDistribution.slice(0, 10);
  const leadingState = top10[0];
  const baselineState = top10[top10.length - 1];
  const top10Total = top10.reduce((sum, s) => sum + (s.count || 0), 0);
  const top10Share = totalOffices > 0 ? ((top10Total / totalOffices) * 100).toFixed(1) : '0';

  // Delivery gauge
  const deliveryShare = totalOffices > 0 ? ((deliveryCount / totalOffices) * 100).toFixed(1) : '0';

  // Region pie data
  const regionPieData = (regionDistribution || []).slice(0, 8).map(r => ({
    name: r.region,
    value: r.count,
  }));
  const REGION_COLORS = ['#FF6B4E', '#14B8A6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316'];

  return (
    <div className="space-y-12 fade-in">
      {/* Hero Section */}
      <section className="pt-4">
        <div className="section-label">National Dashboard</div>
        <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-ink leading-[1.1] tracking-tight max-w-3xl">
          Explore India's postal network with a clean, searchable control room.
        </h1>
        <p className="mt-4 text-gray-500 text-lg leading-relaxed max-w-2xl">
          Track the full PIN code directory, compare state coverage, and jump straight into records that matter.
        </p>
      </section>

      {/* Search + Live API */}
      <section className="flex flex-col lg:flex-row items-start gap-6">
        <div className="flex-1 w-full">
          <SearchBar large placeholder="Search by PIN code, office name, district..." />
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted font-medium">Try:</span>
            {tryTerms.map(term => (
              <button
                key={term}
                onClick={() => navigate(term === '380001' ? `/pincode/${term}` : '/explore')}
                className="px-3 py-1 rounded-lg border border-gray-200 text-sm text-ink font-medium hover:bg-gray-50 hover:border-gray-300 transition-all mono"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
        <div className="ui-card flex-shrink-0 !border-coral-100 text-right">
          <p className="text-xs font-semibold text-muted uppercase tracking-[0.2em] mono mb-1">Atlas-Backed Analytics</p>
          <p className="text-2xl font-bold text-coral-500">Live API</p>
        </div>
      </section>

      {/* Stats Grid */}
      {loadingStats && !generalStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => (
            <div key={i} className="ui-card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4" />
              <div className="h-10 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard title="Total PIN Codes" value={generalStats?.totalPincodes} icon={MapPinIcon} colorClass="#FF6B4E" iconBg="#FF6B4E" />
          <StatsCard title="Total States" value={generalStats?.totalStates} icon={MapIcon} colorClass="#F59E0B" iconBg="#F59E0B" />
          <StatsCard title="Delivery Offices" value={generalStats?.deliveryOffices} icon={TruckIcon} colorClass="#14B8A6" iconBg="#14B8A6" />
          <StatsCard title="Non-Delivery Offices" value={generalStats?.nonDeliveryOffices} icon={BuildingOfficeIcon} colorClass="#F43F5E" iconBg="#F43F5E" />
        </div>
      )}

      {/* Office Type Breakdown — REAL DATA */}
      <section>
        <div className="section-label">Office Types</div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-ink mb-6">Office type breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { label: 'Head Office', code: 'H.O', count: hoCount, color: '#F59E0B' },
            { label: 'Sub Office', code: 'S.O', count: soCount, color: '#14B8A6' },
            { label: 'Branch Office', code: 'B.O', count: boCount, color: '#FF6B4E' },
          ].map(office => {
            const pct = Math.round((office.count / officeTotal) * 100);
            return (
              <div key={office.code} className="ui-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-[0.15em] mono">{office.label}</p>
                    <p className="text-sm text-muted mono">{office.code}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: office.color }}>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-extrabold text-ink mono mb-4">
                  {office.count.toLocaleString('en-IN')}
                </p>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div className="h-2 rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: office.color }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="badge" style={{ backgroundColor: `${office.color}20`, color: office.color }}>{office.code}</span>
                  <span className="text-xs text-muted font-medium mono">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ranked State Distribution — REAL DATA */}
      <section>
        <div className="section-label">Coverage Matrix</div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-ink mb-6">Ranked state distribution</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="ui-card">
            <p className="text-xs font-semibold text-muted uppercase tracking-[0.15em] mono mb-2">Leading State</p>
            <p className="text-xl font-extrabold text-ink uppercase">{leadingState?.state || '---'}</p>
            <p className="text-lg font-bold text-coral-500 mono">{leadingState?.count?.toLocaleString('en-IN') || '---'}</p>
          </div>
          <div className="ui-card">
            <p className="text-xs font-semibold text-muted uppercase tracking-[0.15em] mono mb-2">Top 10 Share</p>
            <p className="text-3xl font-extrabold text-ink mono">{top10Share}%</p>
            <p className="text-sm text-muted">of all indexed PIN offices nationwide</p>
          </div>
          <div className="ui-card">
            <p className="text-xs font-semibold text-muted uppercase tracking-[0.15em] mono mb-2">Rank 10 Baseline</p>
            <p className="text-xl font-extrabold text-ink uppercase">{baselineState?.state || '---'}</p>
            <p className="text-lg font-bold text-coral-500 mono">{baselineState?.count?.toLocaleString('en-IN') || '---'}</p>
          </div>
        </div>

        {/* Horizontal Bar Chart */}
        <div className="ui-card">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-semibold text-coral-500 uppercase tracking-[0.15em] mono">Top 10 States by Volume</p>
              <p className="text-sm text-muted mt-1">A ranked horizontal board for faster state-to-state comparison.</p>
            </div>
            <span className="text-sm text-coral-400 font-medium italic hidden sm:block">Live distribution snapshot</span>
          </div>
          <div style={{ width: '100%', height: Math.max(400, top10.length * 48) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10} layout="vertical" margin={{ top: 16, right: 60, left: 0, bottom: 8 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="state"
                  width={120}
                  tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                  formatter={(value) => [value?.toLocaleString('en-IN'), 'Offices']}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                  {top10.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#FF6B4E' : index < 3 ? '#FF8B6B' : '#FFD0C2'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Delivery Gauge */}
      <section>
        <div className="section-label">Delivery Gauge</div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-ink mb-6">Delivery versus non-delivery network</h2>
        <div className="ui-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="flex flex-col items-center justify-center col-span-1">
              <div className="relative w-40 h-40">
                <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#F3F4F6" strokeWidth="12" />
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#14B8A6" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(deliveryShare / 100) * 440} 440`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-ink mono">{deliveryShare}%</span>
                  <span className="text-xs text-muted font-medium">delivery</span>
                </div>
              </div>
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-6">
              <div className="ui-card !border-green-200">
                <p className="text-xs font-semibold text-muted uppercase tracking-[0.15em] mono mb-2">Delivery Offices</p>
                <p className="text-3xl font-extrabold text-ink mono">{deliveryCount.toLocaleString('en-IN')}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-teal-500" />
                  <span className="text-sm text-muted">{deliveryShare}% share</span>
                </div>
              </div>
              <div className="ui-card !border-red-200">
                <p className="text-xs font-semibold text-muted uppercase tracking-[0.15em] mono mb-2">Non-Delivery</p>
                <p className="text-3xl font-extrabold text-ink mono">{nonDeliveryCount.toLocaleString('en-IN')}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-sm text-muted">{(100 - parseFloat(deliveryShare)).toFixed(1)}% share</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top 10 Districts — REAL DATA */}
      <section>
        <div className="section-label">District Hotspots</div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-ink mb-6">Top districts by PIN office count</h2>
        <div className="ui-card">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-coral-500 uppercase tracking-[0.15em] mono">Top 10 Districts Nationwide</p>
            <span className="text-sm text-coral-400 font-medium italic hidden sm:block">Real-time aggregation</span>
          </div>
          <div style={{ width: '100%', height: 420 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topDistricts} layout="vertical" margin={{ top: 8, right: 60, left: 0, bottom: 8 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="district" width={130} tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                  formatter={(value) => [value?.toLocaleString('en-IN'), 'Offices']}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22}>
                  {(topDistricts || []).map((entry, index) => (
                    <Cell key={`dcell-${index}`} fill={index === 0 ? '#8B5CF6' : index < 3 ? '#A78BFA' : '#DDD6FE'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Regional Distribution — REAL DATA (Pie Chart) */}
      <section>
        <div className="section-label">Postal Circles</div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-ink mb-6">Region-wise office distribution</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="ui-card">
            <p className="text-xs font-semibold text-coral-500 uppercase tracking-[0.15em] mono mb-4">Top 8 Regions</p>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {regionPieData.map((entry, index) => (
                      <Cell key={`pie-${index}`} fill={REGION_COLORS[index % REGION_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                    formatter={(value) => [value?.toLocaleString('en-IN'), 'Offices']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="ui-card flex flex-col justify-center">
            <p className="text-xs font-semibold text-muted uppercase tracking-[0.15em] mono mb-4">Region Breakdown</p>
            <div className="space-y-3">
              {regionPieData.map((r, i) => (
                <div key={r.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: REGION_COLORS[i % REGION_COLORS.length] }} />
                    <span className="text-sm font-medium text-ink">{r.name}</span>
                  </div>
                  <span className="text-sm font-bold text-ink mono">{r.value?.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All States Table — REAL DATA */}
      <section>
        <div className="section-label">Full Coverage</div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-ink mb-6">All states & union territories</h2>
        <div className="ui-card !p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-[3px] border-coral-500">
                <th className="px-5 py-4 text-xs font-semibold text-muted uppercase tracking-[0.15em] mono">#</th>
                <th className="px-5 py-4 text-xs font-semibold text-muted uppercase tracking-[0.15em] mono">State / UT</th>
                <th className="px-5 py-4 text-xs font-semibold text-muted uppercase tracking-[0.15em] mono text-right">Offices</th>
                <th className="px-5 py-4 text-xs font-semibold text-muted uppercase tracking-[0.15em] mono text-right">Share</th>
                <th className="px-5 py-4 text-xs font-semibold text-muted uppercase tracking-[0.15em] mono">Coverage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stateDistribution.map((s, idx) => {
                const share = totalOffices > 0 ? ((s.count / totalOffices) * 100) : 0;
                return (
                  <tr key={s.state} className="hover:bg-gray-50/80 transition-colors text-sm">
                    <td className="px-5 py-3 text-muted mono text-xs">{idx + 1}</td>
                    <td className="px-5 py-3 font-semibold text-ink">{s.state}</td>
                    <td className="px-5 py-3 font-bold text-ink mono text-right">{s.count.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3 text-muted mono text-right text-xs">{share.toFixed(1)}%</td>
                    <td className="px-5 py-3">
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${Math.min(share * 4, 100)}%`,
                            backgroundColor: idx === 0 ? '#FF6B4E' : idx < 5 ? '#FF8B6B' : '#FFD0C2'
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
