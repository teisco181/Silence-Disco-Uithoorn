import React, { useState, useEffect, useRef } from 'react';
import { useRental } from '../context/RentalContext';
import { MessageSquare, X, Send, MapPin, Sparkles, User, ShieldCheck } from 'lucide-react';
import brandLogo from '../assets/images/logo_silence_disco_uithoorn_1793259331317.jpg';

export const ChatWidget: React.FC = () => {
  const {
    isChatDrawerOpen,
    setIsChatDrawerOpen,
    userProfile,
    isAdmin,
    chatMessages,
    handleSendMessage,
    unreadChatCount,
    setIsAuthModalOpen,
    setActiveTab,
  } = useRental();

  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'Kan ik zaterdagmiddag ophalen in Uithoorn?',
    'Zijn alle telefoon- en DJ kabels inbegrepen?',
    'Hoe werkt de borg teruggave bij inlevering?',
  ];

  // Auto scroll to bottom
  useEffect(() => {
    if (isChatDrawerOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatDrawerOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const text = messageInput.trim();
    setMessageInput('');
    await handleSendMessage(text);
  };

  const handleQuickQuestion = async (q: string) => {
    await handleSendMessage(q);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isChatDrawerOpen && (
        <button
          onClick={() => setIsChatDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white rounded-full shadow-2xl shadow-pink-500/30 border border-pink-400/40 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          aria-label="Open live chat met Silence Disco Uithoorn"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-cyan-400 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center animate-bounce shadow-md">
                {unreadChatCount}
              </span>
            )}
          </div>
          <span className="text-xs font-bold tracking-wide">
            Chat met ons <span className="text-pink-200 hidden sm:inline">(Uithoorn)</span>
          </span>
        </button>
      )}

      {/* Slide-in Chat Drawer / Modal */}
      {isChatDrawerOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[400px] h-[560px] max-h-[85vh] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={brandLogo}
                alt="Silence Disco Uithoorn"
                className="w-10 h-10 rounded-full border border-pink-500/40 object-cover"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white">Silence Disco Uithoorn</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-pink-500" />
                  Direct antwoord van de verhuurder
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isAdmin && (
                <button
                  onClick={() => {
                    setIsChatDrawerOpen(false);
                    setActiveTab('beheer');
                  }}
                  className="p-1.5 text-xs text-pink-300 hover:text-white rounded-lg hover:bg-slate-800"
                  title="Open Beheer Klantenservice"
                >
                  <ShieldCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsChatDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Account status banner */}
          <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-[11px]">
            <div className="text-slate-400 truncate">
              {userProfile ? (
                <span>
                  Ingelogd als: <strong className="text-white">{userProfile.displayName}</strong>
                </span>
              ) : (
                <span className="text-slate-400">Als gastchat verbonden</span>
              )}
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline shrink-0 cursor-pointer"
            >
              {userProfile ? 'Account' : 'Inloggen'}
            </button>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/70">
            {/* Welcome greeting */}
            <div className="flex flex-col items-start">
              <span className="text-[10px] text-slate-500 mb-0.5">Silence Disco Uithoorn</span>
              <div className="max-w-[85%] p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-tl-none leading-relaxed">
                👋 Welkom bij <strong>Silence Disco Verhuur Uithoorn</strong>! Heb je vragen over de beschikbaarheid, afhalen in Uithoorn of het aansluiten van je muziek? Stel je vraag direct hieronder.
              </div>
            </div>

            {/* Quick Question suggestions if few messages */}
            {chatMessages.length === 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                  Veelgestelde vragen:
                </span>
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickQuestion(q)}
                    className="w-full text-left p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-[11px] text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            )}

            {/* Dynamic messages */}
            {chatMessages.map((msg) => {
              const isMine =
                (isAdmin && msg.senderRole === 'admin') ||
                (!isAdmin && msg.senderRole === 'customer');

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-500 mb-0.5">
                    {msg.senderRole === 'admin' ? 'Silence Disco Uithoorn' : msg.senderName}
                  </span>
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                      isMine
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-900 text-slate-100 rounded-tl-none border border-slate-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-[9px] opacity-70 mt-1 block text-right font-mono">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input form */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Typ je bericht..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-400 hover:to-cyan-400 disabled:opacity-30 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
