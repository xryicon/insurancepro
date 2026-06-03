import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import { ArrowLeft, Search, Filter, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const PAGE_SIZE = 10;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [newToday, setNewToday] = useState(0);

  const fetchLeads = async () => {
    setLoading(true);

    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      if (['home', 'car', 'contact'].includes(filter)) {
        query = query.eq('lead_type', filter);
      } else {
        query = query.eq('status', filter);
      }
    }

    const { data, error } = await query;

    if (error) {
      toast.error('Error loading leads');
      setLoading(false);
      return;
    }

    setLeads(data || []);

    const today = new Date().toDateString();
    setTotalLeads(data.length);
    setNewToday(
      data.filter(
        (l) =>
          new Date(l.created_at).toDateString() === today &&
          l.status === 'new'
      ).length
    );

    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id);

    if (error) toast.error('Update failed');
    else {
      toast.success(`Marked as ${status}`);
      fetchLeads();
    }
  };

  const filteredLeads = useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter((lead) => {
      const data = lead.data || {};
      return (
        lead.full_name?.toLowerCase().includes(q) ||
        lead.email?.toLowerCase().includes(q) ||
        data.registration?.toLowerCase().includes(q)
      );
    });
  }, [leads, search]);

  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredLeads.slice(start, start + PAGE_SIZE);
  }, [filteredLeads, page]);

  const totalPages = Math.ceil(filteredLeads.length / PAGE_SIZE);

  const statusColors = {
    new: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    contacted: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    closed: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  };

  const leadTypeColors = {
    home: 'bg-indigo-500/20 text-indigo-400',
    car: 'bg-cyan-500/20 text-cyan-400',
    contact: 'bg-gray-500/20 text-gray-400',
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-[#0b1220]/80 backdrop-blur-lg border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Return
            </button>
            <h1 className="text-xl font-bold">LEADS DASHBOARD</h1>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
              <span className="text-indigo-400">
                <Filter className="w-4 h-4" />
              </span>
              <span className="text-sm">Total: {totalLeads}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
              <span className="text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-sm">New Today: {newToday}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* SEARCH */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, or registration plate..."
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'home', 'car', 'contact', 'new', 'contacted', 'closed'].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* LIST */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedLeads.map((lead) => {
              const data = lead.data || {};

              return (
                <div
                  key={lead.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-lg shadow-black/20 transition-all hover:shadow-indigo-500/10"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="font-semibold text-lg">{lead.full_name}</h2>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs ${leadTypeColors[lead.lead_type] || 'bg-gray-700'}`}>
                          {lead.lead_type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{lead.email}</p>
                    </div>

                    <button
                      onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                      className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {expandedId === lead.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>

                  <div className="mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status] || 'bg-gray-700'}`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </div>

                  {expandedId === lead.id && (
                    <div className="mt-4 text-sm text-gray-300 space-y-2 border-t border-white/10 pt-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p><b className="text-gray-400">Name:</b> {lead.full_name}</p>
                          <p><b className="text-gray-400">Email:</b> {lead.email}</p>
                          <p><b className="text-gray-400">Phone:</b> {lead.phone || 'N/A'}</p>
                          {lead.address && <p><b className="text-gray-400">Address:</b> {lead.address}</p>}
                        </div>

                        <div>
                          {lead.lead_type === 'home' && (
                            <>
                              <p><b className="text-gray-400">Property Type:</b> {data.property_type}</p>
                              <p><b className="text-gray-400">Living Size:</b> {data.living_size} m²</p>
                              <p><b className="text-gray-400">Bedrooms:</b> {data.bedrooms}</p>
                              <p><b className="text-gray-400">Bathrooms:</b> {data.bathrooms}</p>
                              <p><b className="text-gray-400">Construction Year:</b> {data.construction_year}</p>
                              <p><b className="text-gray-400">Contents Value:</b> €{data.contents_value}</p>
                            </>
                          )}

                          {lead.lead_type === 'car' && (
                            <>
                              <p><b className="text-gray-400">Make:</b> {data.car_make}</p>
                              <p><b className="text-gray-400">Model:</b> {data.car_model}</p>
                              <p><b className="text-gray-400">Year:</b> {data.year}</p>
                              <p><b className="text-gray-400">Plate:</b> {data.registration}</p>
                              <p><b className="text-gray-400">HP:</b> {data.horsepower}</p>
                              <p><b className="text-gray-400">Engine:</b> {data.engine_size}cc</p>
                              <p><b className="text-gray-400">Transmission:</b> {data.transmission_type}</p>
                            </>
                          )}

                          {lead.lead_type !== 'contact' && (
                            <>
                              <p><b className="text-gray-400">Current Provider:</b> {data.current_provider}</p>
                              <p><b className="text-gray-400">Premium:</b> €{data.current_premium}</p>
                            </>
                          )}

                          {lead.lead_type === 'contact' && (
                            <p><b className="text-gray-400">Message:</b> {data.query || data.message || 'No message'}</p>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 pt-2 border-t border-white/10">
                        Submitted: {new Date(lead.created_at).toLocaleString()}
                      </p>

                      <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                        <button
                          onClick={() => updateStatus(lead.id, 'new')}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs transition-colors"
                        >
                          New
                        </button>
                        <button
                          onClick={() => updateStatus(lead.id, 'contacted')}
                          className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs transition-colors"
                        >
                          Contacted
                        </button>
                        <button
                          onClick={() => updateStatus(lead.id, 'closed')}
                          className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-xs transition-colors"
                        >
                          Closed
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="px-4 py-2 bg-white/5 rounded-lg">
              Page <span className="text-indigo-400">{page}</span> / {totalPages || 1}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}