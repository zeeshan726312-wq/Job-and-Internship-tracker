import { useState } from 'react';
import { X, Video, Send, MessageSquare, ExternalLink, Sparkles, CheckCircle2, User, Copy } from 'lucide-react';

const ChatAndMeetingModal = ({ candidateName, candidateEmail, currentUser, onClose }) => {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'video'
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Recruiter', text: `Hello ${candidateName || 'Candidate'}, thanks for applying! We would like to connect with you.`, time: '10:00 AM' }
  ]);
  const [inputText, setInputText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const roomName = `TrackerPro-Interview-${(candidateName || 'Candidate').replace(/\s+/g, '')}-${Date.now().toString().slice(-4)}`;
  const videoRoomUrl = `https://meet.jit.si/${roomName}`;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: currentUser?.name || 'Recruiter',
        text: inputText.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputText('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoRoomUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" /> Direct 1-on-1 Hub
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Candidate: <span className="font-bold text-slate-900 dark:text-white">{candidateName || 'Candidate'}</span> ({candidateEmail})
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-300 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'chat' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Instant Chat
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'video' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" /> WebRTC Video Room
          </button>
        </div>

        {activeTab === 'chat' ? (
          /* INSTANT DIRECT CHAT */
          <div className="space-y-3">
            <div className="h-56 overflow-y-auto space-y-2 p-3 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800">
              {messages.map(msg => (
                <div key={msg.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{msg.sender}</span>
                    <span className="text-slate-400">{msg.time}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type direct message..."
                className="input-field flex-1 text-xs py-2 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="btn bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 text-xs font-bold keep-white border-0 flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </form>
          </div>
        ) : (
          /* WEBRTC VIDEO MEETING ROOM GENERATOR */
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
              <h4 className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
                <Video className="w-4 h-4" /> 1-Click Secure WebRTC Video Interview Room
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                An encrypted, instant HD WebRTC video room has been generated for your interview session with <span className="font-bold text-slate-900 dark:text-white">{candidateName}</span>.
              </p>
            </div>

            <div>
              <label className="form-label font-bold text-slate-700 dark:text-slate-300">Generated Video Room Link</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={videoRoomUrl}
                  readOnly
                  className="input-field flex-1 text-xs py-2 bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-800 font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className="btn secondary py-2 px-3 text-xs font-bold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> {copiedLink ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <a
                href={videoRoomUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 text-xs flex items-center justify-center gap-2 keep-white shadow-lg border-0 rounded-xl"
              >
                <ExternalLink className="w-4 h-4" /> Launch Video Meeting Room Now ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatAndMeetingModal;
