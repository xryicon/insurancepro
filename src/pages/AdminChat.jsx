import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { X, ArrowLeft, MessageSquare, Users, Send, Settings, History } from 'lucide-react';
import { isChatOnline } from '../utils/chatHours';

export default function AdminChat() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [agentName, setAgentName] = useState('Admin');
  const [view, setView] = useState('list');
  const [online, setOnline] = useState(true);
  const [forceMode, setForceMode] = useState('auto');
  const [unreadCounts, setUnreadCounts] = useState({});
  const [activeTab, setActiveTab] = useState('active');
  const messagesEndRef = useRef(null);
  const msgChannelRef = useRef(null);
  const listContainerRef = useRef(null);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('chat_settings')
      .select('*')
      .limit(1)
      .single();
    if (!data) return;
    setForceMode(data.force_mode || 'auto');
  };

  const updateForceMode = async (mode) => {
    setForceMode(mode);
    const { data: existing } = await supabase
      .from('chat_settings')
      .select('id')
      .limit(1)
      .single();

    if (!existing?.id) {
      const { error } = await supabase
        .from('chat_settings')
        .insert([{ force_mode: mode }]);
      if (error) console.error(error);
    } else {
      const { error } = await supabase
        .from('chat_settings')
        .update({ force_mode: mode })
        .eq('id', existing.id);
      if (error) console.error(error);
    }
  };

  useEffect(() => {
    loadSettings();
    const channel = supabase
      .channel('chat-settings-admin')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chat_settings' },
        (payload) => {
          if (payload.new?.force_mode) setForceMode(payload.new.force_mode);
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    const check = () => {
      if (forceMode === 'open') return setOnline(true);
      if (forceMode === 'closed') return setOnline(false);
      return setOnline(isChatOnline());
    };
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [forceMode]);

  const fetchSessions = async () => {
    const { data } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('created_at', { ascending: false });
    setSessions(data || []);
  };

  useEffect(() => {
    fetchSessions();
    const channel = supabase
      .channel('chat-sessions-admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_sessions' },
        fetchSessions
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const filteredSessions = sessions.filter(s => {
    if (activeTab === 'active') return s.status !== 'closed';
    if (activeTab === 'history') return s.status === 'closed';
    return true;
  });

  const openChat = async (session, e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!online) return;

    setUnreadCounts(prev => ({ ...prev, [session.id]: 0 }));
    setActiveSession(session);
    setView('chat');
    setMessages([]);
    setInput('');

    if (msgChannelRef.current) {
      supabase.removeChannel(msgChannelRef.current);
      msgChannelRef.current = null;
    }

    const { data: updated } = await supabase
      .from('chat_sessions')
      .update({
        status: 'active',
        agent_name: agentName,
      })
      .eq('id', session.id)
      .select()
      .single();

    setActiveSession(updated || session);

    await supabase.from('chat_messages').insert([
      {
        session_id: session.id,
        sender_type: 'system',
        sender_name: 'system',
        message: `${agentName} joined the chat`,
      },
    ]);

    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  };

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || !activeSession?.id) return;

    await supabase.from('chat_messages').insert([
      {
        session_id: activeSession.id,
        sender_type: 'agent',
        sender_name: agentName,
        message: input,
      },
    ]);
    setInput('');
  };

  const closeChat = async (id) => {
    await supabase
      .from('chat_sessions')
      .update({
        status: 'closed',
        closed_by: 'agent',
      })
      .eq('id', id);

    await supabase.from('chat_messages').insert([
      {
        session_id: id,
        sender_type: 'system',
        sender_name: 'system',
        message: `Chat closed by ${agentName}`,
      },
    ]);

    handleReturn();
    fetchSessions();
  };

  const handleReturn = () => {
    setView('list');
    if (msgChannelRef.current) {
      supabase.removeChannel(msgChannelRef.current);
      msgChannelRef.current = null;
    }
    setActiveSession(null);
    setMessages([]);
    setInput('');
  };

  useEffect(() => {
    if (!activeSession?.id) return;

    const msgChannel = supabase
      .channel(`admin-chat-${activeSession.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${activeSession.id}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();
    msgChannelRef.current = msgChannel;
    return () => supabase.removeChannel(msgChannel);
  }, [activeSession?.id]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender_type !== 'agent') {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  useEffect(() => {
    const globalMsgChannel = supabase
      .channel('global-chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const msg = payload.new;
          if (msg.sender_type === 'visitor' || msg.sender_type === 'system') {
            setUnreadCounts(prev => {
              const currentCount = prev[msg.session_id] || 0;
              if (activeSession?.id === msg.session_id) return prev;
              return { ...prev, [msg.session_id]: currentCount + 1 };
            });
          }
        }
      )
      .subscribe();
    return () => supabase.removeChannel(globalMsgChannel);
  }, [activeSession?.id]);

  const statusColor = online ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400';

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="max-w-7xl mx-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Admin Dashboard
            </button>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-indigo-400" />
              <h1 className="text-2xl font-bold">Live Chat</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${statusColor}`} />
              <span className="text-sm">{online ? 'Online' : 'Offline'}</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Your name"
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
              <Settings className="w-4 h-4 text-gray-400" />
              {['open', 'closed', 'auto'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateForceMode(mode)}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    forceMode === mode
                      ? mode === 'open'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : mode === 'closed'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 h-[70vh] overflow-hidden">
            <div className="flex border-b border-white/10 mb-4">
              <button
                onClick={() => setActiveTab('active')}
                className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                  activeTab === 'active'
                    ? 'bg-white/10 text-white border-b-2 border-indigo-500'
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Active
                </span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'bg-white/10 text-white border-b-2 border-indigo-500'
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-1">
                  <History className="w-4 h-4" />
                  History
                </span>
              </button>
            </div>

            <div
              ref={listContainerRef}
              className="space-y-2 h-[calc(100%-60px)] overflow-y-auto pr-2"
            >
              {filteredSessions.map((s) => (
                <div
                  key={s.id}
                  onClick={(e) => openChat(s, e)}
                  className={`p-3 rounded-lg cursor-pointer transition-all relative ${
                    activeSession?.id === s.id
                      ? 'bg-indigo-500/10 border border-indigo-500/20'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {s.visitor_name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{s.visitor_name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400 truncate">{s.email || 'No email'}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      s.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : s.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-gray-600/20 text-gray-400'
                    }`}>
                      {s.status}
                    </span>
                    {unreadCounts[s.id] > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCounts[s.id]}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {filteredSessions.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <p>{activeTab === 'active' ? 'No active chats' : 'No chat history'}</p>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col h-[70vh] overflow-hidden">
            {view === 'list' ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageSquare className="w-16 h-16 opacity-50 mb-4" />
                <p>Select a chat to start messaging</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {activeSession?.visitor_name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-semibold">{activeSession?.visitor_name || 'Unknown'}</h2>
                      <p className="text-xs text-gray-400">{activeSession?.email || 'No email'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => closeChat(activeSession.id)}
                    className="p-2 bg-white/5 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Close chat"
                  >
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-lg max-w-[80%] ${
                        m.sender_type === 'agent'
                          ? 'bg-indigo-500/10 border border-indigo-500/20 ml-auto'
                          : m.sender_type === 'system'
                          ? 'bg-gray-700/30 text-center text-xs'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      {m.sender_type !== 'system' && (
                        <p className="text-xs font-medium mb-1 text-indigo-400">
                          {m.sender_name}
                        </p>
                      )}
                      <p className="text-sm">{m.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(m.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex gap-2 mt-4 pt-4 border-t border-white/10"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}