import { useNavigate } from 'react-router-dom';
import { MessageCircle, BarChart3 } from 'lucide-react';

export default function AdminHub() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b1220] text-white flex items-center justify-center p-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">

        {/* LEADS */}
        <div
          onClick={() => navigate('/admin/leads')}
          className="cursor-pointer bg-slate-900 border border-slate-800 rounded-xl p-8 hover:bg-slate-800 transition"
        >
          <BarChart3 className="w-10 h-10 mb-3 text-blue-400" />
          <h2 className="text-xl font-bold">Leads</h2>
          <p className="text-sm text-gray-400 mt-1">
            View and manage insurance leads
          </p>
        </div>

        {/* LIVE CHAT */}
        <div
          onClick={() => navigate('/admin/chat')}
          className="cursor-pointer bg-slate-900 border border-slate-800 rounded-xl p-8 hover:bg-slate-800 transition relative"
        >
          <MessageCircle className="w-10 h-10 mb-3 text-green-400" />

          <h2 className="text-xl font-bold flex items-center gap-2">
            Live Chat

            {/* 🔥 PULSING BADGE */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Talk to live visitors in real time
          </p>
        </div>

      </div>
    </div>
  );
}