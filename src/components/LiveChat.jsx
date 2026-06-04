import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { X, MessageCircle, Clock, Send } from 'lucide-react';

function isChatOnlineByTime() {
  const now = new Date();

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    weekday: 'short',
    hour: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const weekday = parts.find((p) => p.type === 'weekday')?.value;
  const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);

  const isWeekend = weekday === 'Sat' || weekday === 'Sun';
  if (isWeekend) return false;

  return hour >= 9 && hour < 16;
}

const BOTTOM_GAP = 120;

export default function LiveChat() {
  const [forceMode, setForceMode] = useState('auto');
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(null);

  const sessionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [allSessions, setAllSessions] = useState([]);

  const [form, setForm] = useState({
    visitor_name: '',
    visitor_email: '',
    visitor_phone: '',
  });

  // ---------------- FORCE MODE SYNC ----------------
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('chat_settings')
        .select('force_mode')
        .limit(1)
        .maybeSingle();

      if (data?.force_mode) {
        setForceMode(data.force_mode);
      }
    };

    load();

    const channel = supabase
      .channel('chat-settings-livechat')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_settings' },
        (payload) => {
          const mode = payload.new?.force_mode;
          if (mode) setForceMode(mode);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const online = isChatOnlineByTime();

  const isOnline =
    forceMode === 'open'
      ? true
      : forceMode === 'closed'
      ? false
      : online;

  const isQueued = session?.status === 'waiting';
  const isActive = session?.status === 'active';
  const isClosed = session?.status === 'closed';

  const queuePosition =
    session?.id && allSessions.length
      ? allSessions
          .filter((s) => s.status === 'waiting')
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .findIndex((s) => s.id === session.id) + 1
      : null;

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // ---------------- QUEUE ----------------
  useEffect(() => {
    if (!session) return;

    const loadQueue = async () => {
      const { data } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('status', 'waiting')
        .order('created_at', { ascending: true });

      setAllSessions(data || []);
    };

    loadQueue();

    const channel = supabase
      .channel('queue-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_sessions' },
        loadQueue
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [session]);

  // ---------------- SESSION LIVE ----------------
  useEffect(() => {
    if (!session?.id) return;

    const channel = supabase
      .channel(`session-${session.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_sessions',
          filter: `id=eq.${session.id}`,
        },
        (payload) => setSession(payload.new)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [session?.id]);

  // ---------------- MESSAGES ----------------
  useEffect(() => {
    if (!session?.id) return;

    const channel = supabase
      .channel(`messages-${session.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${session.id}`,
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [session?.id]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const startChat = async () => {
    if (!isOnline) return;

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert([
        {
          visitor_name: form.visitor_name,
          visitor_email: form.visitor_email,
          visitor_phone: form.visitor_phone,
          status: 'waiting',
        },
      ])
      .select()
      .single();

    if (error) return console.error(error);

    setSession({ ...data, status: 'waiting' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    const current = sessionRef.current;
    if (!current || !input.trim()) return;

    const message = input.trim();
    setInput('');

    await supabase.from('chat_messages').insert([
      {
        session_id: current.id,
        sender_type: 'visitor',
        sender_name: form.visitor_name,
        message,
      },
    ]);
  };

  const closeChat = async () => {
    if (!session?.id) return;

    await supabase
      .from('chat_sessions')
      .update({
        status: 'closed',
        closed_by: 'visitor',
      })
      .eq('id', session.id);

    await supabase.from('chat_messages').insert([
      {
        session_id: session.id,
        sender_type: 'system',
        sender_name: 'system',
        message: 'Chat closed by visitor',
      },
    ]);

    setSession((prev) => ({ ...prev, status: 'closed' }));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* FLOAT BUTTON (MOBILE FIXED) */}
      <div
        className="fixed right-4 sm:right-6 z-[9999] flex flex-col items-end gap-2"
        style={{ bottom: '140px' }}   // 👈 better mobile spacing
      >
        {isOnline && (
          <div className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-full text-xs sm:text-sm font-semibold shadow-xl animate-pulse">
            💬 Need help? Chat with us
          </div>
        )}

        <button
          onClick={handleOpen}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-600 text-white flex items-center justify-center shadow-xl"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* CHAT WINDOW (MOBILE FIXED) */}
      {open && (
        <div
          className="
            fixed right-0 sm:right-6 z-[9999]
            w-full sm:w-[92vw] max-w-[380px]
            h-[85vh] sm:h-[600px]
            bg-slate-900 border border-white/10
            rounded-none sm:rounded-xl
            flex flex-col
          "
          style={{ bottom: '0px', sm: { bottom: '260px' } }}
        >
          {/* HEADER */}
          <div className="p-4 border-b border-white/10 flex justify-between">
            <div>
              <p className="text-white font-semibold">Live Chat</p>
              <p className="text-xs text-gray-400">
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>

            <button onClick={handleClose}>
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* CLOSED */}
          {isClosed && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <X className="w-10 h-10 text-red-500 mb-3" />
              <p className="text-white font-semibold">Chat ended</p>
              <button
                onClick={() => {
                  setSession(null);
                  setMessages([]);
                }}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
              >
                Start new chat
              </button>
            </div>
          )}

          {/* OFFLINE */}
          {!isOnline && !isClosed && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <Clock className="w-10 h-10 text-gray-500 mb-3" />
              <p className="text-white text-sm sm:text-base">
                We are currently closed, we open Monday to Friday from 9 AM to 5 PM
              </p>
              <Link
                to="/contact"
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
              >
                Contact Us
              </Link>
            </div>
          )}

          {/* QUEUE */}
          {isOnline && isQueued && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <p className="text-white font-semibold">
                You are currently in queue — an agent will be with you shortly
              </p>
            </div>
          )}

          {/* ACTIVE */}
          {isOnline && isActive && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex justify-start">
                    <div className="p-3 rounded-lg bg-slate-700 text-white max-w-[80%]">
                      {msg.message}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form className="p-3 border-t border-white/10 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 p-2 bg-white/5 text-white rounded-lg text-sm"
                  placeholder="Type..."
                />
                <button className="p-2 bg-green-600 rounded-lg text-white">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          )}

          {/* START FORM */}
          {!session && isOnline && (
            <div className="p-4 space-y-2">
              <input
                placeholder="Name"
                className="w-full p-2 bg-white/5 text-white rounded text-sm"
                onChange={(e) =>
                  setForm({ ...form, visitor_name: e.target.value })
                }
              />
              <input
                placeholder="Email"
                className="w-full p-2 bg-white/5 text-white rounded text-sm"
                onChange={(e) =>
                  setForm({ ...form, visitor_email: e.target.value })
                }
              />
              <input
                placeholder="Phone"
                className="w-full p-2 bg-white/5 text-white rounded text-sm"
                onChange={(e) =>
                  setForm({ ...form, visitor_phone: e.target.value })
                }
              />

              <button
                onClick={startChat}
                className="w-full bg-green-600 p-2 rounded text-white"
              >
                Start Chat
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}