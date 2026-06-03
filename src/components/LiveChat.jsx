import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { X, MessageCircle, Clock, Send, User, Mail, Phone } from 'lucide-react';

function isChatOnlineByTime() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    weekday: 'short',
    hour: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const weekday = parts.find(p => p.type === 'weekday')?.value;
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);

  const isWeekend = weekday === 'Sat' || weekday === 'Sun';
  if (isWeekend) return false;

  return hour >= 9 && hour < 16;
}

const BOTTOM_GAP = 110;

export default function LiveChat() {
  const [forceMode, setForceMode] = useState('auto');
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState('idle');
  const [session, setSession] = useState(null);

  const sessionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isInitialLoad = useRef(true);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [form, setForm] = useState({
    visitor_name: '',
    visitor_email: '',
    visitor_phone: '',
  });

  const online = isChatOnlineByTime();
  const isOnline = forceMode === 'open' || (forceMode !== 'closed' && online);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // ---------------- FORCE MODE ----------------
  useEffect(() => {
    const loadForceMode = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_settings')
          .select('force_mode')
          .limit(1)
          .single();

        if (error) throw error;
        if (data?.force_mode) setForceMode(data.force_mode);
      } catch (err) {
        console.error('Force mode load error:', err);
      }
    };

    loadForceMode();

    const channel = supabase
      .channel('chat_settings_live')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_settings',
        },
        (payload) => {
          if (payload.new?.force_mode) {
            setForceMode(payload.new.force_mode);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ---------------- OPEN / CLOSE ----------------
  const handleOpen = () => {
    setOpen(true);
    setStep(isOnline ? 'register' : 'offline');
  };

  const handleClose = () => setOpen(false);

  // ---------------- START CHAT ----------------
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

    if (error) {
      console.error(error);
      return;
    }

    setSession(data);
    setStep('chat');
    isInitialLoad.current = true;

    await supabase.from('chat_messages').insert([
      {
        session_id: data.id,
        sender_type: 'system',
        sender_name: 'system',
        message: `${form.visitor_name} started a chat`,
      },
    ]);
  };

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = async (e) => {
    if (e) e.preventDefault();

    const current = sessionRef.current;
    if (!current || !input.trim()) return;

    const message = input;

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

  // ---------------- LOAD + REALTIME MESSAGES ----------------
  useEffect(() => {
    if (!session?.id) return;

    let isMounted = true;

    const loadMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });

      if (isMounted) {
        setMessages(data || []);
      }
    };

    loadMessages();

    const channel = supabase
      .channel(`chat-${session.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${session.id}`,
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.some(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe((status) => {
        console.log('chat subscription:', status);
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [session?.id]);

  // ---------------- AUTO SCROLL (FIXED) ----------------
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ---------------- UI ----------------
  return (
    <>
      {/* Floating button */}
      <div
        className="fixed right-6 bottom-6 z-[9999] flex flex-col items-end gap-3"
        style={{ bottom: `${BOTTOM_GAP}px` }}
      >
        {isOnline && (
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/80 backdrop-blur-sm border border-white/10 rounded-full shadow-lg">
            <MessageCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm text-white">Need help?</span>
          </div>
        )}

        <button
          onClick={handleOpen}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center shadow-xl"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div
          className="fixed right-6 z-[9999] w-[92vw] max-w-[380px] h-[550px] sm:w-96 sm:h-[620px] bg-slate-900/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl flex flex-col"
          style={{ bottom: `${BOTTOM_GAP + 80}px` }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <div>
              <h2 className="text-white font-semibold">Live Chat</h2>
              <p className="text-xs text-gray-400">
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>

            <button onClick={handleClose}>
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Offline */}
          {step === 'offline' && (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Clock className="w-10 h-10 text-gray-500 mb-3" />
              <p className="text-white">We are offline</p>
              <p className="text-sm text-gray-400">Mon–Fri 09–16</p>
            </div>
          )}

          {/* Register */}
          {step === 'register' && (
            <div className="p-4 space-y-3">
              <input
                className="w-full p-3 bg-white/5 text-white rounded-lg"
                placeholder="Name"
                value={form.visitor_name}
                onChange={(e) => setForm({ ...form, visitor_name: e.target.value })}
              />

              <input
                className="w-full p-3 bg-white/5 text-white rounded-lg"
                placeholder="Email"
                value={form.visitor_email}
                onChange={(e) => setForm({ ...form, visitor_email: e.target.value })}
              />

              <button
                onClick={startChat}
                disabled={!form.visitor_name || !form.visitor_email}
                className="w-full p-3 bg-green-600 text-white rounded-lg"
              >
                Start Chat
              </button>
            </div>
          )}

          {/* Chat */}
          {step === 'chat' && (
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_type === 'visitor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-[80%] p-3 rounded-lg bg-slate-700 text-white">
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="p-3 border-t border-white/10 flex gap-2">
                <input
                  className="flex-1 p-3 bg-white/5 text-white rounded-lg"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type..."
                />

                <button
                  type="submit"
                  className="p-3 bg-green-600 text-white rounded-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}