import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';

const PAGE_SIZE = 10;

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [totalLeads, setTotalLeads] = useState(0);
  const [newToday, setNewToday] = useState(0);

  // 🔄 FETCH LEADS
  const fetchLeads = async () => {
    setLoading(true);

    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      if (['home', 'car'].includes(filter)) {
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

  // 🟢 UPDATE STATUS
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

  // 🔍 SEARCH FILTER (NAME / EMAIL / PLATE)
  const filteredLeads = useMemo(() => {
    const q = search.toLowerCase();

    return leads.filter((lead) => {
      const data = lead.data || {};

      return (
        lead.full_name?.toLowerCase().includes(q) ||
        lead.email?.toLowerCase().includes(q) ||
        data.registration?.toLowerCase().includes(q) // plate
      );
    });
  }, [leads, search]);

  // 📄 PAGINATION
  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredLeads.slice(start, start + PAGE_SIZE);
  }, [filteredLeads, page]);

  const totalPages = Math.ceil(filteredLeads.length / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Our Dashboard</h1>

        <div className="flex gap-4 text-sm">
          <div className="bg-slate-900 px-3 py-2 rounded">
            Total: {totalLeads}
          </div>
          <div className="bg-slate-900 px-3 py-2 rounded">
            New Today: {newToday}
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search name, email, or plate..."
        className="w-full mb-4 px-3 py-2 bg-slate-900 border border-slate-700 rounded"
      />

      {/* FILTERS */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'home', 'car', 'contact', 'new', 'contacted', 'closed'].map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setPage(1);
            }}
            className={`px-3 py-1 rounded ${
              filter === f ? 'bg-blue-600' : 'bg-slate-800'
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">

          {paginatedLeads.map((lead) => {
            const data = lead.data || {};

            return (
              <div
                key={lead.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4"
              >

                {/* HEADER */}
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">
                      {lead.full_name}
                    </h2>

                    <p className="text-sm text-gray-400">{lead.email}</p>

                    <span className="text-xs px-2 py-1 rounded bg-indigo-600">
                      {lead.lead_type.toUpperCase()}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setExpandedId(expandedId === lead.id ? null : lead.id)
                    }
                    className="text-xs text-blue-400"
                  >
                    {expandedId === lead.id ? 'Hide' : 'View'}
                  </button>
                </div>

                {/* STATUS */}
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    lead.status === 'new'
                      ? 'bg-yellow-600'
                      : lead.status === 'contacted'
                      ? 'bg-blue-600'
                      : 'bg-green-600'
                  }`}>
                    {lead.status}
                  </span>
                </div>

                {/* EXPANDED */}
                {expandedId === lead.id && (
                  <div className="mt-4 text-sm text-gray-300 space-y-1 border-t border-slate-800 pt-4">

                    <p><b>Email:</b> {lead.email}</p>
                    <p><b>Phone:</b> {lead.phone}</p>
                    <p><b>Address:</b> {lead.address}</p>

                    {/* HOME FULL FIXED */}
                    {lead.lead_type === 'home' && (
                      <>
                        <p><b>Property Type:</b> {data.property_type}</p>
                        <p><b>Living Size:</b> {data.living_size}</p>
                        <p><b>Outside Size:</b> {data.outside_size}</p>
                        <p><b>Bedrooms:</b> {data.bedrooms}</p>
                        <p><b>Bathrooms:</b> {data.bathrooms}</p>
                        <p><b>Construction Year:</b> {data.construction_year}</p>
                        <p><b>Refurbished Year:</b> {data.refurbished_year}</p>
                        <p><b>Usage:</b> {data.residence_usage}</p>
                        <p><b>Contents Value:</b> €{data.contents_value}</p>
                        <p><b>Google Maps:</b> {data.google_maps_link}</p>
                        <p><b>Catastro:</b> {data.catastro_number}</p>
                        <p><b>Special Items:</b> {data.special_items}</p>
                      </>
                    )}

                    {/* CAR FULL FIXED (plate included in search) */}
                    {lead.lead_type === 'car' && (
                      <>
                        <p><b>Make:</b> {data.car_make}</p>
                        <p><b>Model:</b> {data.car_model}</p>
                        <p><b>Year:</b> {data.year}</p>
                        <p><b>Plate:</b> {data.registration}</p>
                        <p><b>HP:</b> {data.horsepower}</p>
                        <p><b>Engine:</b> {data.engine_size}</p>
                        <p><b>Transmission:</b> {data.transmission_type}</p>
                      </>
                    )}

                    {/* FINANCE */}
                    <p><b>Provider:</b> {data.current_provider}</p>
                    <p><b>Premium:</b> €{data.current_premium}</p>

                    <p className="text-xs text-gray-500">
                      {new Date(lead.created_at).toLocaleString()}
                    </p>

                    {/* ACTIONS */}
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => updateStatus(lead.id, 'new')} className="px-2 py-1 bg-gray-700 text-xs rounded">New</button>
                      <button onClick={() => updateStatus(lead.id, 'contacted')} className="px-2 py-1 bg-blue-600 text-xs rounded">Contacted</button>
                      <button onClick={() => updateStatus(lead.id, 'closed')} className="px-2 py-1 bg-green-600 text-xs rounded">Closed</button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}

        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          Page {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </div>
  );
}