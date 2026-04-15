import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Check, X, Clock, User, Calendar } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  attendee: string;
  status: 'confirmed' | 'pending' | 'declined';
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const INITIAL: Meeting[] = [
  { id: '1', title: 'Series A Discussion', date: '2026-04-14', time: '10:00', attendee: 'Michael Rodriguez', status: 'confirmed' },
  { id: '2', title: 'Product Demo', date: '2026-04-16', time: '14:00', attendee: 'Jennifer Lee', status: 'pending' },
  { id: '3', title: 'Due Diligence', date: '2026-04-18', time: '09:00', attendee: 'David Chen', status: 'confirmed' },
  { id: '4', title: 'Term Sheet Review', date: '2026-04-22', time: '11:00', attendee: 'Sarah Kim', status: 'pending' },
  { id: '5', title: 'Investor Pitch', date: '2026-04-25', time: '15:00', attendee: 'Alex Thompson', status: 'declined' },
];

export default function SchedulingPage() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', date: '', time: '09:00', attendee: '' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const cells = Array.from({ length: totalCells }, (_, i) => {
    if (i < firstDay) return { day: new Date(year, month, 0).getDate() - firstDay + 1 + i, current: false };
    if (i >= firstDay + daysInMonth) return { day: i - firstDay - daysInMonth + 1, current: false };
    return { day: i - firstDay + 1, current: true };
  });

  const toDateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const dayMeetings = (day: number) => meetings.filter(m => m.date === toDateStr(day));

  const handleDayClick = (day: number, current: boolean) => {
    if (!current) return;
    const d = toDateStr(day);
    setSelectedDate(d);
    setForm(f => ({ ...f, date: d }));
  };

  const handleAdd = () => {
    if (!form.title || !form.date || !form.attendee) return;
    setMeetings(p => [...p, { id: Date.now().toString(), ...form, status: 'pending' }]);
    setForm({ title: '', date: '', time: '09:00', attendee: '' });
    setShowModal(false);
  };

  const handleStatus = (id: string, status: Meeting['status']) =>
    setMeetings(p => p.map(m => m.id === id ? { ...m, status } : m));

  const prevMonth = () => month === 0 ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1);
  const nextMonth = () => month === 11 ? (setMonth(0), setYear(y => y + 1)) : setMonth(m => m + 1);

  const DOT: Record<Meeting['status'], string> = { confirmed: 'bg-green-500', pending: 'bg-yellow-400', declined: 'bg-red-400' };
  const BADGE: Record<Meeting['status'], string> = {
    confirmed: 'bg-green-50 text-green-700 border border-green-200',
    pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    declined: 'bg-red-50 text-red-700 border border-red-200',
  };

  const selectedMeetings = selectedDate ? meetings.filter(m => m.date === selectedDate) : [];
  const pending = meetings.filter(m => m.status === 'pending');
  const confirmed = meetings.filter(m => m.status === 'confirmed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meeting Scheduler</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your meetings and availability</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:opacity-90"
          style={{ backgroundColor: '#2563EB' }}>
          <Plus size={16} /> Schedule Meeting
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', count: meetings.length, color: '#2563EB' },
          { label: 'Confirmed', count: confirmed.length, color: '#16a34a' },
          { label: 'Pending', count: pending.length, color: '#d97706' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
            <h2 className="font-semibold text-gray-900">{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          </div>
          <div className="grid grid-cols-7 border-b border-gray-100">
            {DAYS.map(d => <div key={d} className="py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((cell, i) => {
              const dateStr = cell.current ? toDateStr(cell.day) : '';
              const dm = cell.current ? dayMeetings(cell.day) : [];
              const isToday = cell.current && cell.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isSelected = dateStr === selectedDate;
              return (
                <div key={i}
                  onClick={() => handleDayClick(cell.day, cell.current)}
                  className={`min-h-[76px] p-1.5 border-b border-r border-gray-50 transition-colors ${cell.current ? 'cursor-pointer hover:bg-blue-50/40' : 'bg-gray-50/30'} ${isSelected ? 'bg-blue-50' : ''}`}
                >
                  <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm mb-1 font-medium ${isToday ? 'bg-blue-600 text-white' : isSelected ? 'bg-blue-100 text-blue-700' : cell.current ? 'text-gray-800' : 'text-gray-300'}`}>
                    {cell.day}
                  </div>
                  <div className="space-y-0.5">
                    {dm.slice(0, 2).map(m => (
                      <div key={m.id} className={`text-xs px-1 py-0.5 rounded text-white truncate ${DOT[m.status]}`}>
                        {m.time} {m.title}
                      </div>
                    ))}
                    {dm.length > 2 && <div className="text-xs text-gray-400 pl-1">+{dm.length - 2}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {selectedDate && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              {selectedMeetings.length === 0 ? (
                <div className="text-center py-4">
                  <Calendar size={28} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">No meetings</p>
                  <button onClick={() => setShowModal(true)} className="mt-2 text-xs text-blue-600 font-medium hover:underline">+ Add one</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedMeetings.map(m => (
                    <div key={m.id} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{m.title}</p>
                          <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500"><Clock size={11} />{m.time}</div>
                          <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500"><User size={11} />{m.attendee}</div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 ${BADGE[m.status]}`}>{m.status}</span>
                      </div>
                      {m.status === 'pending' && (
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleStatus(m.id, 'confirmed')} className="flex-1 flex items-center justify-center gap-1 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"><Check size={12} />Accept</button>
                          <button onClick={() => handleStatus(m.id, 'declined')} className="flex-1 flex items-center justify-center gap-1 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600"><X size={12} />Decline</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
              Meeting Requests
              {pending.length > 0 && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">{pending.length}</span>}
            </h3>
            {pending.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-3">No pending requests</p>
            ) : (
              <div className="space-y-2">
                {pending.map(m => (
                  <div key={m.id} className="p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                    <p className="text-xs font-semibold text-gray-900">{m.title}</p>
                    <p className="text-xs text-gray-500">{m.attendee} · {m.date} at {m.time}</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleStatus(m.id, 'confirmed')} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"><Check size={12} />Accept</button>
                      <button onClick={() => handleStatus(m.id, 'declined')} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600"><X size={12} />Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Confirmed Meetings</h3>
            {confirmed.length === 0 ? <p className="text-xs text-gray-400 text-center py-3">None yet</p> : (
              <div className="space-y-2">
                {confirmed.map(m => (
                  <div key={m.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{m.title}</p>
                      <p className="text-xs text-gray-400">{m.date} · {m.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">Schedule Meeting</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Meeting title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Series A Discussion"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Time *</label>
                  <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Attendee name *</label>
                <input value={form.attendee} onChange={e => setForm({ ...form, attendee: e.target.value })} placeholder="Full name"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 text-white rounded-xl text-sm font-medium hover:opacity-90" style={{ backgroundColor: '#2563EB' }}>Send Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}