import { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, MessageCircle, Users, Phone } from 'lucide-react';

interface ChatMsg { id: number; sender: string; message: string; time: string; }

export default function VideoCallPage() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    { id: 1, sender: 'Michael Rodriguez', message: 'Hello! Ready for the call?', time: '10:00 AM' },
    { id: 2, sender: 'You', message: 'Yes, starting now!', time: '10:01 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [timerRef, setTimerRef] = useState<ReturnType<typeof setInterval> | null>(null);

  const startCall = () => {
    setIsCallActive(true);
    const t = setInterval(() => setCallDuration(d => d + 1), 1000);
    setTimerRef(t);
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
    if (timerRef) clearInterval(timerRef);
    setTimerRef(null);
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setChatMessages(p => [...p, {
      id: Date.now(), sender: 'You', message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setNewMessage('');
  };

  const upcoming = [
    { name: 'Michael Rodriguez', role: 'Investor', time: 'Today, 10:00 AM', initials: 'MR' },
    { name: 'Jennifer Lee', role: 'Investor', time: 'Tomorrow, 2:00 PM', initials: 'JL' },
    { name: 'David Chen', role: 'Entrepreneur', time: 'Apr 18, 11:00 AM', initials: 'DC' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Video Call</h1>
        <p className="text-sm text-gray-500 mt-1">Connect face to face with investors and entrepreneurs</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden" style={{ height: '420px' }}>
            {isCallActive ? (
              <>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <span className="text-white text-3xl font-bold">MR</span>
                    </div>
                    <p className="text-white text-xl font-semibold">Michael Rodriguez</p>
                    <p className="text-gray-400 text-sm mt-1">Connected · {fmt(callDuration)}</p>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-700 rounded-xl overflow-hidden border-2 border-white/30">
                  {isVideoOn ? (
                    <div className="w-full h-full flex items-center justify-center bg-blue-800">
                      <span className="text-white text-sm font-bold">You</span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-600">
                      <VideoOff size={20} className="text-gray-400" />
                    </div>
                  )}
                </div>
                {isScreenSharing && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Monitor size={14} /> Screen Sharing
                  </div>
                )}
                {isMuted && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <MicOff size={14} /> Muted
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                  <Video size={40} className="text-gray-400" />
                </div>
                <p className="text-white text-xl font-semibold mb-2">Ready to join?</p>
                <p className="text-gray-400 text-sm mb-6">Meeting with Michael Rodriguez</p>
                <button onClick={startCall} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition flex items-center gap-2">
                  <Video size={20} /> Start Call
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <button onClick={() => setIsMuted(!isMuted)} className={`w-12 h-12 rounded-full flex items-center justify-center transition ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button onClick={() => setIsVideoOn(!isVideoOn)} className={`w-12 h-12 rounded-full flex items-center justify-center transition ${!isVideoOn ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            <button onClick={() => setIsScreenSharing(!isScreenSharing)} className={`w-12 h-12 rounded-full flex items-center justify-center transition ${isScreenSharing ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              <Monitor size={20} />
            </button>
            <button onClick={() => setShowChat(!showChat)} className={`w-12 h-12 rounded-full flex items-center justify-center transition ${showChat ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              <MessageCircle size={20} />
            </button>
            <button className="w-12 h-12 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center transition">
              <Users size={20} />
            </button>
            {isCallActive && (
              <button onClick={endCall} className="w-14 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition">
                <PhoneOff size={22} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 mt-3">
            <span className={`text-xs flex items-center gap-1 ${isMuted ? 'text-red-500' : 'text-gray-400'}`}>
              {isMuted ? <MicOff size={12} /> : <Mic size={12} />}{isMuted ? 'Muted' : 'Unmuted'}
            </span>
            <span className={`text-xs flex items-center gap-1 ${!isVideoOn ? 'text-red-500' : 'text-gray-400'}`}>
              {isVideoOn ? <Video size={12} /> : <VideoOff size={12} />}{isVideoOn ? 'Camera On' : 'Camera Off'}
            </span>
            {isScreenSharing && <span className="text-xs flex items-center gap-1 text-blue-500"><Monitor size={12} />Sharing</span>}
          </div>
        </div>

        {showChat && (
          <div className="w-72 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col" style={{ maxHeight: '520px' }}>
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <MessageCircle size={16} className="text-blue-600" /> In-call Chat
              </h3>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs text-gray-400 mb-1">{msg.sender}</span>
                  <div className={`px-3 py-2 rounded-xl text-sm ${msg.sender === 'You' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    {msg.message}
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-100 flex gap-2">
              <input value={newMessage} onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <Phone size={16} className="rotate-45" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Upcoming Calls</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcoming.map((call, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 flex items-center gap-3 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {call.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{call.name}</p>
                <p className="text-xs text-gray-400">{call.role}</p>
                <p className="text-xs text-blue-600 mt-0.5">{call.time}</p>
              </div>
              <button onClick={startCall} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition flex-shrink-0">
                Join
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}