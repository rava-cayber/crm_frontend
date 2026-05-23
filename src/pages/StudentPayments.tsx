import { useState } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const StudentPayments = () => {
  const [filter, setFilter] = useState('Barchasi');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const payments = [
    { id: 1, amount: '2 400 000 so\'m', status: 'To\'langan', type: 'Bank', time: '18 May, 2026 18:39' },
    { id: 2, amount: '2 400 000 so\'m', status: 'To\'langan', type: 'Bank', time: '21 Apr, 2026 10:15' },
    { id: 3, amount: '2 400 000 so\'m', status: 'To\'langan', type: 'Bank', time: '17 Mart, 2026 09:33' },
    { id: 4, amount: '2 400 000 so\'m', status: 'To\'langan', type: 'Bank', time: '27 Fev, 2026 09:24' },
    { id: 5, amount: '2 400 000 so\'m', status: 'To\'langan', type: 'Bank', time: '23 Yan, 2026 10:10' },
    { id: 6, amount: '2 400 000 so\'m', status: 'To\'langan', type: 'Bank', time: '17 Dek, 2025 09:21' },
    { id: 7, amount: '1 560 000 so\'m', status: 'To\'langan', type: 'Bank', time: '24 Noy, 2025 10:16' },
    { id: 8, amount: '1 650 000 so\'m', status: 'To\'langan', type: 'Bank', time: '29 Sen, 2025 10:11' },
    { id: 9, amount: '1 650 000 so\'m', status: 'To\'langan', type: 'Bank', time: '27 Avg, 2025 09:47' },
    { id: 10, amount: '1 650 000 so\'m', status: 'To\'langan', type: 'Bank', time: '29 Iyul, 2025 09:23' },
  ];

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-navy-raised pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#1A2332] dark:text-white uppercase tracking-tight">To'lovlarim</h1>
          <p className="text-xs text-slate-400 font-medium">Barcha amalga oshirilgan to'lovlaringiz tarixi.</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-navy-elevated p-6 rounded-[24px] border border-slate-100 dark:border-navy-raised shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter</label>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 bg-slate-50 dark:bg-navy-raised border border-slate-100 dark:border-navy-raised text-xs font-bold text-[#1A2332] dark:text-white rounded-xl focus:outline-none min-w-[150px]"
          >
            <option value="Barchasi">Barchasi</option>
            <option value="To'langan">To'langan</option>
            <option value="Kutilmoqda">Kutilmoqda</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Boshlanish vaqti</label>
          <div className="relative">
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-4 pr-10 py-3 bg-slate-50 dark:bg-navy-raised border border-slate-100 dark:border-navy-raised text-xs font-bold text-[#1A2332] dark:text-white rounded-xl focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tugash vaqti</label>
          <div className="relative">
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-4 pr-10 py-3 bg-slate-50 dark:bg-navy-raised border border-slate-100 dark:border-navy-raised text-xs font-bold text-[#1A2332] dark:text-white rounded-xl focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-navy-elevated rounded-[32px] border border-slate-100 dark:border-navy-raised overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-navy-raised/30">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Miqdori</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Holati</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">To'lov turi</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vaqti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-raised/50">
              {payments.map((p, idx) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-raised/30 transition-colors">
                  <td className="px-8 py-5 text-xs font-bold text-slate-400">{idx + 1}</td>
                  <td className="px-8 py-5 text-xs font-black text-[#1A2332] dark:text-white">{p.amount}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-wider rounded-md">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-500">{p.type}</td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-500">{p.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentPayments;
