import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { isChatOnline } from '../utils/chatHours';

export default function AdminChat() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const [agentName, setAgentName] = useState(() =>
    localStorage.getItem('agentName') || 'Admin'
  );

  const [view, setView] = useState('list');
  const [online, setOnline] = useState(true);

  const [forceMode, setForceMode] = useState(() => {
    return localStorage.getItem('admin_force_mode') || 'auto';
  });

  const [unreadCounts, setUnreadCounts] = useState({});
  const [activeTab, setActiveTab] = useState('active');

  const msgChannelRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const prevSessionRef = useRef(null);

  // ---------------- SAVE FORCE MODE LOCALLY ----------------
  useEffect(() => {
    localStorage.setItem('admin_force_mode', forceMode);
  }, [forceMode]);

  // ---------------- UPDATE FORCE MODE (FIXED FOR UUID) ----------------
  const updateForceMode = async (mode) => {
    setForceMode(mode);
    localStorage.setItem('admin_force_mode', mode);

    const { data, error } = await supabase
      .from('chat_settings')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (error || !data) {
      console.error('Failed to find settings row:', error);
      return;
    }

    await supabase
      .from('chat_settings')
      .update({ force_mode: mode })
      .eq('id', data.id);
  };

  // ---------------- ONLINE ----------------
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

  // ---------------- LOAD FORCE MODE FROM SUPABASE (FIXED) ----------------
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('chat_settings')
        .select('id, force_mode')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (error || !data) return;

      setForceMode(data.force_mode);
      localStorage.setItem('admin_force_mode', data.force_mode);
    };

    load();

    const channel = supabase
      .channel('chat-settings-admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_settings' },
        (payload) => {
          const mode = payload.new?.force_mode;

          if (!['open', 'closed', 'auto'].includes(mode)) return;

          setForceMode(mode);
          localStorage.setItem('admin_force_mode', mode);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ---------------- FETCH SESSIONS ----------------
  const fetchSessions = useCallback(async () => {
    const { data } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('created_at', { ascending: true });

    setSessions(data || []);
  }, []);

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
  }, [fetchSessions]);

  const filteredSessions = sessions.filter((s) => {
    if (activeTab === 'active') return s.status !== 'closed';
    if (activeTab === 'history') return s.status === 'closed';
    return true;
  });

  const getQueuePosition = (sessionId) => {
    const active = sessions.filter((s) => s.status !== 'closed');
    return active.findIndex((s) => s.id === sessionId) + 1;
  };

  // ---------------- OPEN CHAT ----------------
  const openChat = async (session, e) => {
    e?.preventDefault();

    if (!online) return;

    setActiveSession(session);
    setView('chat');
    setInput('');

    if (msgChannelRef.current) {
      supabase.removeChannel(msgChannelRef.current);
      msgChannelRef.current = null;
    }

    await supabase
      .from('chat_sessions')
      .update({
        status: 'active',
        agent_name: agentName,
      })
      .eq('id', session.id);

    const { data: existing } = await supabase
      .from('chat_messages')
      .select('id')
      .eq('session_id', session.id)
      .eq('sender_type', 'system')
      .ilike('message', '%joined the chat%')
      .limit(1);

    if (!existing || existing.length === 0) {
      await supabase.from('chat_messages').insert([
        {
          session_id: session.id,
          sender_type: 'system',
          sender_name: 'system',
          message: `${agentName} joined the chat`,
        },
      ]);
    }

    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true });

    setMessages(data || []);

    const channel = supabase.channel(`admin-chat-${session.id}`);

    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
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
    );

    channel.subscribe();
    msgChannelRef.current = channel;
  };

  // ---------------- SEND ----------------
  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || !activeSession?.id) return;

    await supabase.from('chat_messages').insert([
      {
        session_id: activeSession.id,
        sender_type: 'agent',
        sender_name: agentName,
        message: input.trim(),
      },
    ]);

    setInput('');
  };

  // ---------------- CLOSE CHAT ----------------
  const closeChat = async (id, by = 'agent') => {
    await supabase
      .from('chat_sessions')
      .update({
        status: 'closed',
        closed_by: by,
      })
      .eq('id', id);

    await supabase.from('chat_messages').insert([
      {
        session_id: id,
        sender_type: 'system',
        sender_name: 'system',
        message:
          by === 'visitor'
            ? 'Chat closed by visitor'
            : `Chat closed by ${agentName}`,
      },
    ]);

    setView('list');
    setActiveSession(null);
    setMessages([]);
    setInput('');

    if (msgChannelRef.current) {
      supabase.removeChannel(msgChannelRef.current);
      msgChannelRef.current = null;
    }

    await fetchSessions();
  };

  // ---------------- UNREAD ----------------
  useEffect(() => {
    const channel = supabase
      .channel('global-chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const msg = payload.new;

          if (msg.sender_type === 'agent') return;
          if (msg.sender_type === 'system') return;

          setUnreadCounts((prev) => {
            if (activeSession?.id === msg.session_id) return prev;

            return {
              ...prev,
              [msg.session_id]: (prev[msg.session_id] || 0) + 1,
            };
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [activeSession?.id]);

  // ---------------- AUTO SCROLL ----------------
  useEffect(() => {
    if (!messagesContainerRef.current) return;

    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight;
  }, [messages]);

  const statusColor =
    forceMode === 'open'
      ? 'bg-emerald-500/20 text-emerald-400'
      : forceMode === 'closed'
      ? 'bg-red-500/20 text-red-400'
      : 'bg-yellow-500/20 text-yellow-300';

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="max-w-7xl mx-auto p-6">

        <div className="flex justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <MessageSquare className="text-indigo-400" />
            <h1 className="text-2xl font-bold">Live Chat</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${statusColor}`} />

            <input
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="bg-white/5 px-3 py-1 rounded"
            />

            {['open', 'closed', 'auto'].map((mode) => (
              <button
                key={mode}
                onClick={() => updateForceMode(mode)}
                className={`px-2 py-1 text-xs rounded ${
                  forceMode === mode
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'text-gray-400'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white/5 p-4 rounded-xl h-[70vh] overflow-y-auto">
            <div className="flex gap-2 mb-4">
              <button onClick={() => setActiveTab('active')}>Active</button>
              <button onClick={() => setActiveTab('history')}>History</button>
            </div>

            {filteredSessions.map((s) => (
              <div
                key={s.id}
                onClick={(e) => openChat(s, e)}
                className="p-3 bg-white/5 rounded mb-2 cursor-pointer"
              >
                <p>{s.visitor_name}</p>

                <p className="text-xs text-gray-400">
                  {s.visitor_email} • {s.visitor_phone}
                </p>

                {s.status !== 'closed' && (
                  <p className="text-xs text-indigo-400">
                    Queue #{getQueuePosition(s.id)}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="col-span-2 bg-white/5 rounded-xl p-4 flex flex-col h-[70vh]">
            {!activeSession ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a chat
              </div>
            ) : (
              <>
                <div className="flex justify-between border-b pb-2 mb-2">
                  <h2>{activeSession.visitor_name}</h2>
                  <button onClick={() => closeChat(activeSession.id)}>
                    Close
                  </button>
                </div>

                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto space-y-2"
                >
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-2 rounded ${
                        m.sender_type === 'agent'
                          ? 'bg-indigo-500/20 ml-auto text-right'
                          : 'bg-white/5'
                      }`}
                    >
                      <p className="text-xs text-gray-400">
                        {m.sender_name} • {new Date(m.created_at).toLocaleTimeString()}
                      </p>
                      <p>{m.message}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={sendMessage} className="flex gap-2 mt-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-2 bg-white/5 rounded"
                    placeholder="Type..."
                  />
                  <button className="bg-indigo-500 px-4 rounded">
                    Send
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