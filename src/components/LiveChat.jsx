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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [form, setForm] = useState({
    visitor_name: '',
    visitor_email: '',
    visitor_phone: '',
  });
  const messagesEndRef = useRef(null);
  const online = isChatOnlineByTime();
  const isOnline = forceMode === 'open' || (forceMode !== 'closed' && online);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // Enhanced force mode subscription with error handling
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
      } catch (error) {
        console.error('Force mode load error:', error);
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
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Force mode subscription active');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setStep(isOnline ? 'register' : 'offline');
  };

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
    setSession(data);
    setStep('chat');

    await supabase.from('chat_messages').insert([
      {
        session_id: data.id,
        sender_type: 'system',
        sender_name: 'system',
        message: `${form.visitor_name} started a chat`,
      },
    ]);
  };

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    const current = sessionRef.current;
    if (!current || !input.trim()) return;

    await supabase.from('chat_messages').insert([
      {
        session_id: current.id,
        sender_type: 'visitor',
        sender_name: form.visitor_name,
        message: input,
      },
    ]);
    setInput('');
  };

  useEffect(() => {
    if (!session?.id) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });
      setMessages(data || []);
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
        (payload) => setMessages((p) => [...p, payload.new])
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [session?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* Floating chat button */}
      <div
        className="fixed right-6 bottom-6 z-[9999] flex flex-col items-end gap-3"
        style={{ bottom: `${BOTTOM_GAP}px` }}
      >
        {isOnline && (
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/80 backdrop-blur-sm border border-white/10 rounded-full shadow-lg">
            <div className="relative">
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <MessageCircle className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-sm text-white">Need help?</span>
          </div>
        )}

        <button
          onClick={handleOpen}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div
          className="fixed right-6 z-[9999] w-[92vw] max-w-[380px] h-[550px] sm:w-96 sm:h-[620px] bg-slate-900/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden"
          style={{ bottom: `${BOTTOM_GAP + 80}px` }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-white/10 bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Live Chat</h2>
                <p className="text-xs text-gray-400">
                  {isOnline ? 'Online - We reply as soon as possible' : 'Currently offline'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Offline state */}
          {step === 'offline' && (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-lg font-semibold text-white">We are currently out of office</p>
              <p className="text-sm text-gray-400 mt-2">
                Mon–Fri 09:00–16:00 (Madrid time)
              </p>
              <a
                href="/contact"
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Contact Us
              </a>
            </div>
          )}

          {/* Registration form */}
          {step === 'register' && (
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  Name
                </label>
                <input
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your name"
                  value={form.visitor_name}
                  onChange={(e) => setForm({ ...form, visitor_name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="your@email.com"
                  value={form.visitor_email}
                  onChange={(e) => setForm({ ...form, visitor_email: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="+34 123 456 789"
                  value={form.visitor_phone}
                  onChange={(e) => setForm({ ...form, visitor_phone: e.target.value })}
                />
              </div>

              <button
                onClick={startChat}
                disabled={!form.visitor_name || !form.visitor_email}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Start Chat
              </button>
            </div>
          )}

          {/* Chat interface */}
          {step === 'chat' && (
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white/2">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <p>Start a conversation...</p>
                    <p className="text-xs mt-1">Our team will respond shortly</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.sender_type === 'visitor' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.sender_type === 'visitor'
                            ? 'bg-green-600 text-white rounded-br-sm'
                            : msg.sender_type === 'system'
                            ? 'bg-gray-700/50 text-center text-xs'
                            : 'bg-slate-700 text-white rounded-bl-sm'
                        }`}
                      >
                        {msg.sender_type !== 'system' && (
                          <p className="text-xs font-medium mb-1 opacity-70">
                            {msg.sender_name}
                          </p>
                        )}
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="p-3 border-t border-white/10 bg-slate-800/50">
                <div className="flex gap-2">
                  <input
                    className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="p-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}