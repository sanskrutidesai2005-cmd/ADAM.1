import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { getTranslation } from '@/translations';
import { Bot, Send, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'adam_ai_chat_v1';

function normalizeStoredMessages(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({
      id: typeof m.id === 'string' ? m.id : `msg_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      role: m.role,
      content: m.content,
      createdAt: typeof m.createdAt === 'number' ? m.createdAt : Date.now()
    }));
}

function initialThread() {
  return [
    {
      id: 'assistant_welcome',
      role: 'assistant',
      content: getTranslation('aiWelcome'),
      createdAt: Date.now()
    }
  ];
}

export default function AIChat() {
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      const normalized = normalizeStoredMessages(stored);
      return normalized.length ? normalized : initialThread();
    } catch {
      return initialThread();
    }
  });
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const run = async () => {
      try {
        const result = await base44.entities.UserProfile.filter({});
        setProfile(result?.[0] ?? null);
      } catch {
        setProfile(null);
      }
    };
    run();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = useMemo(
    () => [
      getTranslation('prompt1'),
      getTranslation('prompt2'),
      getTranslation('prompt3'),
      getTranslation('prompt4')
    ],
    []
  );

  const sendMessage = async (content) => {
    const trimmed = content.trim();
    if (!trimmed || sending) return;

    const userMessage = {
      id: `user_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      role: 'user',
      content: trimmed,
      createdAt: Date.now()
    };

    setMessages((prev) => [...prev, userMessage]);
    setText('');
    setSending(true);

    try {
      const response = await base44.integrations.AI.Chat({
        messages: [...messages, userMessage].map(({ role, content: c }) => ({ role, content: c })),
        profile
      });

      const assistantMessage = {
        id: `assistant_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        role: 'assistant',
        content: response?.content || 'I had trouble generating a response. Please try again.',
        createdAt: Date.now()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant_${Date.now()}_${Math.random().toString(16).slice(2)}`,
          role: 'assistant',
          content: 'I couldn’t respond right now. Please try again in a moment.',
          createdAt: Date.now()
        }
      ]);
    } finally {
      setSending(false);
    }
  };

  const clearChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages(initialThread());
    setText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center mb-3">
          <Bot className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{getTranslation('aiHealthAssistant')}</h1>
        <p className="text-slate-500 mt-2">{getTranslation('aiChatDesc')}</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-lg">{getTranslation('chat')}</CardTitle>
          <Button variant="outline" className="gap-2" onClick={clearChat} disabled={sending}>
            <Trash2 className="h-4 w-4" />
            {getTranslation('clear')}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white h-[440px] overflow-y-auto p-4">
            <div className="space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-slate-100 text-slate-900">
                    {getTranslation('typing')}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => sendMessage(p)}
                disabled={sending}
                className="text-xs px-3 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                {p}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {getTranslation('chatDisclaimer')}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(text);
            }}
            className="flex gap-2"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              disabled={sending}
            />
            <Button type="submit" className="gap-2 bg-sky-600 hover:bg-sky-700" disabled={sending || !text.trim()}>
              <Send className="h-4 w-4" />
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

