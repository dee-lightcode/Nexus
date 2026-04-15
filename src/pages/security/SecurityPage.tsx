import { useState } from 'react';
import { Shield, Eye, EyeOff, CheckCircle, XCircle, Smartphone, Lock, Key, RefreshCw } from 'lucide-react';

const getStrength = (p: string) => {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  if (p.length >= 12) s++;
  return s;
};

const SMETA = [
  { l: '', c: 'bg-gray-200', t: 'text-gray-400' },
  { l: 'Very Weak', c: 'bg-red-500', t: 'text-red-500' },
  { l: 'Weak', c: 'bg-orange-500', t: 'text-orange-500' },
  { l: 'Fair', c: 'bg-yellow-500', t: 'text-yellow-600' },
  { l: 'Strong', c: 'bg-blue-500', t: 'text-blue-600' },
  { l: 'Very Strong', c: 'bg-green-500', t: 'text-green-600' },
];

export default function SecurityPage() {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [saved, setSaved] = useState(false);

  const s = Math.min(getStrength(password), 5);
  const meta = SMETA[s];

  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
    { label: 'Special character', ok: /[^A-Za-z0-9]/.test(password) },
    { label: '12+ characters', ok: password.length >= 12 },
  ];

  const handleOtp = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const n = [...otp]; n[i] = v; setOtp(n);
    if (v && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const verifyOtp = () => {
    if (otp.join('').length === 6) {
      setOtpVerified(true); setTwoFA(true); setOtpSent(false);
    }
  };

  const savePw = () => {
    if (password.length >= 8 && password === confirmPw) {
      setSaved(true);
      setTimeout(() => { setSaved(false); setCurrentPw(''); setConfirmPw(''); setPassword(''); }, 2500);
    }
  };

  const sessions = [
    { device: 'Chrome · Windows', ip: '192.168.1.1', location: 'Karachi, PK', time: 'Active now', current: true },
    { device: 'Safari · iPhone', ip: '203.128.7.42', location: 'Lahore, PK', time: '2 hours ago', current: false },
    { device: 'Firefox · MacOS', ip: '176.32.10.12', location: 'Dubai, UAE', time: '3 days ago', current: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security & Access Control</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account security settings</p>
      </div>

      {/* Score */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${twoFA && s >= 3 ? 'bg-green-50' : 'bg-yellow-50'}`}>
            <Shield size={32} className={twoFA && s >= 3 ? 'text-green-600' : 'text-yellow-500'} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Security Score</h3>
            <p className={`text-sm ${twoFA && s >= 3 ? 'text-green-600' : 'text-yellow-600'}`}>
              {twoFA && s >= 3 ? 'Account well protected' : 'Improve your security below'}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all ${twoFA && s >= 3 ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ width: `${Math.min(((s + (twoFA ? 3 : 0)) / 8) * 100, 100)}%` }} />
              </div>
              <span className="text-sm font-semibold text-gray-700">{Math.min(Math.round(((s + (twoFA ? 3 : 0)) / 8) * 100), 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><Lock size={18} className="text-blue-600" /><h2 className="font-semibold text-gray-800">Change Password</h2></div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Current password</label>
              <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="••••••••"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">New password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= s ? meta.c : 'bg-gray-200'}`} />)}
                  </div>
                  {meta.l && <p className={`text-xs font-medium ${meta.t}`}>{meta.l}</p>}
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    {checks.map(c => (
                      <div key={c.label} className="flex items-center gap-1.5">
                        {c.ok ? <CheckCircle size={12} className="text-green-500 flex-shrink-0" /> : <XCircle size={12} className="text-gray-300 flex-shrink-0" />}
                        <span className={`text-xs ${c.ok ? 'text-green-700' : 'text-gray-400'}`}>{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm new password</label>
              <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="••••••••"
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${confirmPw && confirmPw !== password ? 'border-red-300' : 'border-gray-200'}`} />
              {confirmPw && confirmPw !== password && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
            </div>
          </div>
          <button onClick={savePw} disabled={!password || password !== confirmPw || s < 2}
            className="w-full mt-4 py-2.5 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-40 hover:opacity-90"
            style={{ backgroundColor: saved ? '#16a34a' : '#2563EB' }}>
            {saved ? '✓ Password Updated!' : 'Update Password'}
          </button>
        </div>

        {/* 2FA */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4"><Smartphone size={18} className="text-blue-600" /><h2 className="font-semibold text-gray-800">Two-Factor Authentication</h2></div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
            <div><p className="font-medium text-gray-800 text-sm">Enable 2FA</p><p className="text-xs text-gray-500">Add extra security layer</p></div>
            <button onClick={() => { if (!twoFA) setOtpSent(true); else { setTwoFA(false); setOtpVerified(false); setOtp(['', '', '', '', '', '']); } }}
              className={`relative w-12 h-6 rounded-full transition-colors ${twoFA ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${twoFA ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
          {otpSent && !otpVerified && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-gray-800 mb-1">Enter 6-digit code</p>
              <p className="text-xs text-gray-500 mb-3">Enter any 6 digits for demo</p>
              <div className="flex gap-2 justify-center mb-3">
                {otp.map((d, i) => (
                  <input key={i} id={`otp-${i}`} type="text" maxLength={1} value={d}
                    onChange={e => handleOtp(i, e.target.value)}
                    className="w-10 h-10 border-2 border-gray-200 rounded-xl text-center text-lg font-bold focus:outline-none focus:border-blue-500 transition-colors" />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setOtpSent(false)} className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={verifyOtp} className="flex-1 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90" style={{ backgroundColor: '#16a34a' }}>Verify</button>
              </div>
            </div>
          )}
          {otpVerified && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4">
              <CheckCircle size={18} /><span className="text-sm font-medium">2FA is enabled!</span>
            </div>
          )}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-3"><Key size={14} className="text-gray-500" /><p className="text-sm font-semibold text-gray-800">Role-Based Access</p></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-600 text-white rounded-xl p-3">
                <p className="text-xs font-semibold mb-2">Entrepreneur</p>
                {['Pitch Deck', 'Find Investors', 'Documents', 'Deals'].map(p => (
                  <div key={p} className="flex items-center gap-1 mb-1"><CheckCircle size={10} className="opacity-70" /><p className="text-xs opacity-80">{p}</p></div>
                ))}
              </div>
              <div className="bg-purple-600 text-white rounded-xl p-3">
                <p className="text-xs font-semibold mb-2">Investor</p>
                {['Portfolio', 'Find Startups', 'Deals', 'Analytics'].map(p => (
                  <div key={p} className="flex items-center gap-1 mb-1"><CheckCircle size={10} className="opacity-70" /><p className="text-xs opacity-80">{p}</p></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4"><RefreshCw size={18} className="text-blue-600" /><h3 className="font-semibold text-gray-900">Active Sessions</h3></div>
        <div className="space-y-3">
          {sessions.map((s, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${s.current ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">{s.device}</p>
                  {s.current && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Current</span>}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{s.ip} · {s.location} · {s.time}</p>
              </div>
              {!s.current && <button className="text-xs text-red-500 hover:text-red-700 font-medium">Revoke</button>}
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Security Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Strong Password', desc: 'Use 12+ chars with mixed case, numbers, symbols', ok: s >= 4 },
            { title: '2FA Enabled', desc: 'Two-factor authentication adds extra protection', ok: twoFA },
            { title: 'Profile Complete', desc: 'Complete profile to build trust with investors', ok: true },
          ].map((tip, i) => (
            <div key={i} className={`p-4 rounded-xl border-2 ${tip.ok ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {tip.ok ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-gray-300" />}
                <p className="text-sm font-semibold text-gray-800">{tip.title}</p>
              </div>
              <p className="text-xs text-gray-500">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}