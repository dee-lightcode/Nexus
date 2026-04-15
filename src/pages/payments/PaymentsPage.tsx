import { useState } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownLeft, RefreshCw, TrendingUp, CreditCard, X, Check, Plus } from 'lucide-react';

type TxType = 'deposit' | 'withdraw' | 'transfer' | 'funding';
type TxStatus = 'completed' | 'pending' | 'failed';
type ModalType = 'deposit' | 'withdraw' | 'transfer' | 'fund' | null;

interface Transaction {
  id: string; type: TxType; amount: number;
  sender: string; receiver: string; status: TxStatus;
  date: string; description: string;
}

const INITIAL_TXS: Transaction[] = [
  { id: '1', type: 'funding', amount: 50000, sender: 'James Wilson', receiver: 'You', status: 'completed', date: '2026-04-10', description: 'Seed round funding tranche 1' },
  { id: '2', type: 'deposit', amount: 25000, sender: 'Bank Transfer', receiver: 'You', status: 'completed', date: '2026-04-08', description: 'Wallet top-up' },
  { id: '3', type: 'transfer', amount: 5000, sender: 'You', receiver: 'Legal Consulting', status: 'completed', date: '2026-04-06', description: 'Legal consulting fee' },
  { id: '4', type: 'withdraw', amount: 10000, sender: 'You', receiver: 'Bank Account', status: 'pending', date: '2026-04-12', description: 'Withdrawal to bank' },
  { id: '5', type: 'funding', amount: 70000, sender: 'Aisha Khan', receiver: 'You', status: 'pending', date: '2026-04-11', description: 'Series A tranche 2' },
];

const TYPE_ICON = { deposit: ArrowDownLeft, withdraw: ArrowUpRight, transfer: RefreshCw, funding: TrendingUp };
const TYPE_STYLE: Record<TxType, { color: string; bg: string }> = {
  deposit:  { color: 'text-green-600',  bg: 'bg-green-50'  },
  withdraw: { color: 'text-red-600',    bg: 'bg-red-50'    },
  transfer: { color: 'text-blue-600',   bg: 'bg-blue-50'   },
  funding:  { color: 'text-purple-600', bg: 'bg-purple-50' },
};
const STATUS_BADGE: Record<TxStatus, string> = {
  completed: 'bg-green-50 text-green-700 border border-green-200',
  pending:   'bg-yellow-50 text-yellow-700 border border-yellow-200',
  failed:    'bg-red-50 text-red-700 border border-red-200',
};

export default function PaymentsPage() {
  const [balance, setBalance] = useState(24500);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TXS);
  const [modal, setModal] = useState<ModalType>(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | TxType>('all');

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);
  const totalIn  = transactions.filter(t => ['deposit','funding'].includes(t.type) && t.status === 'completed').reduce((s,t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => ['withdraw','transfer'].includes(t.type) && t.status === 'completed').reduce((s,t) => s + t.amount, 0);

  const handleAction = async () => {
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const newTx: Transaction = {
      id: Date.now().toString(),
      type: modal === 'fund' ? 'funding' : modal!,
      amount: amt,
      sender: modal === 'deposit' ? 'Bank Transfer' : 'You',
      receiver: modal === 'deposit' ? 'You' : recipient || 'Recipient',
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      description: note || `${modal} transaction`,
    };
    setTransactions(p => [newTx, ...p]);
    if (modal === 'deposit') setBalance(b => b + amt);
    else if (modal !== 'fund') setBalance(b => b - amt);
    setLoading(false); setModal(null); setAmount(''); setRecipient(''); setNote('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your wallet and transactions</p>
      </div>

      {/* Wallet card */}
      <div className="rounded-2xl p-6 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563EB)' }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-blue-200 text-sm mb-1">Wallet Balance</p>
            <p className="text-4xl font-bold">${balance.toLocaleString()}</p>
            <p className="text-blue-200 text-sm mt-1">Business Nexus Wallet</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <CreditCard size={24} />
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          {([
            { l: 'Deposit',  t: 'deposit'  as ModalType, I: ArrowDownLeft, c: 'bg-green-500 hover:bg-green-600' },
            { l: 'Withdraw', t: 'withdraw' as ModalType, I: ArrowUpRight,  c: 'bg-red-500 hover:bg-red-600'   },
            { l: 'Transfer', t: 'transfer' as ModalType, I: RefreshCw,     c: 'bg-white/20 hover:bg-white/30' },
            { l: 'Fund Deal',t: 'fund'     as ModalType, I: TrendingUp,    c: 'bg-purple-500 hover:bg-purple-600' },
          ]).map(a => (
            <button key={a.l} onClick={() => setModal(a.t)} className={`flex items-center gap-1.5 ${a.c} text-white px-4 py-2 rounded-xl text-sm font-medium transition-all`}>
              <a.I size={15} />{a.l}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Money In</p>
          <p className="text-xl font-bold text-green-600">+${totalIn.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Money Out</p>
          <p className="text-xl font-bold text-red-600">-${totalOut.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Transactions</p>
          <p className="text-xl font-bold text-blue-600">{transactions.length}</p>
        </div>
      </div>

      {/* Funding flow */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-purple-600" /> Investor → Entrepreneur Funding Flow
        </h3>
        <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
          <div className="flex-1 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2"><DollarSign size={20} className="text-blue-600" /></div>
            <p className="text-sm font-semibold text-gray-800">James Wilson</p>
            <p className="text-xs text-gray-400">Investor</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ArrowUpRight size={28} className="text-purple-500" />
            <p className="text-xs text-purple-600 font-medium">$50,000</p>
          </div>
          <div className="flex-1 text-center">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2"><TrendingUp size={20} className="text-teal-600" /></div>
            <p className="text-sm font-semibold text-gray-800">Sarah Ahmed</p>
            <p className="text-xs text-gray-400">Entrepreneur</p>
          </div>
        </div>
        <button onClick={() => setModal('fund')} className="w-full mt-4 py-2.5 text-white rounded-xl text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2" style={{ backgroundColor: '#7c3aed' }}>
          <Plus size={14} /> Send Funding
        </button>
      </div>

      {/* Transaction table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Transaction History</h3>
          <div className="flex gap-1.5 flex-wrap">
            {(['all', 'deposit', 'withdraw', 'transfer', 'funding'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                style={filter === f ? { backgroundColor: '#2563EB' } : {}}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                {['Type', 'Description', 'Sender', 'Receiver', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(tx => {
                const Icon = TYPE_ICON[tx.type];
                const { color, bg } = TYPE_STYLE[tx.type];
                return (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg}`}>
                        <Icon size={15} className={color} />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700 max-w-[150px]"><p className="truncate">{tx.description}</p></td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{tx.sender}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{tx.receiver}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">${tx.amount.toLocaleString()}</td>
                    <td className="py-3 px-4"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[tx.status]}`}>{tx.status}</span></td>
                    <td className="py-3 px-4 text-gray-400 text-xs">{tx.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No transactions</p>}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-gray-900 capitalize">{modal === 'fund' ? 'Fund a Deal' : modal}</h2>
                <p className="text-xs text-gray-500 mt-0.5">Balance: <span className="font-semibold">${balance.toLocaleString()}</span></p>
              </div>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Amount (USD) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
                    className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold" />
                </div>
              </div>
              {modal !== 'deposit' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">{modal === 'fund' ? 'Entrepreneur' : 'Recipient'} *</label>
                  <input value={recipient} onChange={e => setRecipient(e.target.value)}
                    placeholder={modal === 'fund' ? 'Sarah Ahmed' : 'Recipient name'}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Note (optional)</label>
                <input value={note} onChange={e => setNote(e.target.value)} placeholder="Add a description..."
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">Quick amounts</p>
                <div className="flex gap-2">
                  {[1000, 5000, 10000, 25000].map(a => (
                    <button key={a} onClick={() => setAmount(a.toString())}
                      className="flex-1 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all">
                      ${a.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleAction} disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-white rounded-xl text-sm font-medium disabled:opacity-50 hover:opacity-90"
                style={{ backgroundColor: '#2563EB' }}>
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
                {loading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}