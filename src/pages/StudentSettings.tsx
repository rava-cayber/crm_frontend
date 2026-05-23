import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useAuth } from '../AuthContext';

const StudentSettings = () => {
  const { user } = useAuth();
  
  const [photo, setPhoto] = useState('/brain/f39d9136-2bd5-42f1-b828-efe213bc48ec/mock_avatar_student.png');

  // Dynamically resolve names
  const firstName = user?.firstName || 'Alex';
  const lastName = user?.lastName || 'Johnson';
  const phone = user?.phone || '(+998) 93 111 00 11';
  const email = user?.email || 'student1@gmail.com';
  
  const contracts = [
    { id: 1, name: 'Tashkent 03-07-2025 Bootcamp.pdf' },
    { id: 2, name: 'Tashkent | ESKI 4 oylik Shartnoma.pdf' }
  ];

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto">
      <div className="border-b border-slate-100 dark:border-navy-raised pb-6">
        <h1 className="text-2xl font-black text-[#1A2332] dark:text-white uppercase tracking-tight">Sozlamalar</h1>
        <p className="text-xs text-slate-400 font-medium">Shaxsiy ma'lumotlaringiz va hisob sozlamalari.</p>
      </div>

      {/* Personal Info Card */}
      <div className="bg-white dark:bg-navy-elevated p-8 rounded-[32px] border border-slate-100 dark:border-navy-raised shadow-sm">
        <h2 className="text-lg font-black text-[#1A2332] dark:text-white mb-6 uppercase tracking-tight">Shaxsiy ma'lumotlar</h2>
        
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {/* Avatar Area */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            <div className="w-32 h-32 rounded-full border-4 border-slate-50 dark:border-navy-raised overflow-hidden shadow-md">
              <img 
                src={photo} 
                alt="Student Photo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop";
                }}
              />
            </div>
            <button className="px-4 py-2 bg-green-50 dark:bg-green-500/20 hover:bg-green-100 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
              Talabga mos
            </button>
            <p className="text-[9px] text-slate-400 text-center max-w-[150px]">
              500x500 o'lcham, JPEG, JPG, PNG format, maksimum 2MB
            </p>
          </div>

          {/* Details Area */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ism</span>
              <p className="text-base font-black text-[#1A2332] dark:text-white">{firstName}</p>
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Familiya</span>
              <p className="text-base font-black text-[#1A2332] dark:text-white">{lastName}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Telefon raqam</span>
              <p className="text-base font-black text-[#1A2332] dark:text-white">{phone}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tug'ilgan sana</span>
              <p className="text-base font-black text-[#1A2332] dark:text-white">15 May, 2005</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jinsi</span>
              <p className="text-base font-black text-[#1A2332] dark:text-white">Male</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HH ID</span>
              <p className="text-base font-black text-[#1A2332] dark:text-white">37207</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Security & Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Login info */}
        <div className="bg-white dark:bg-navy-elevated p-8 rounded-[32px] border border-slate-100 dark:border-navy-raised shadow-sm flex flex-col justify-between min-h-[160px]">
          <div>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Kirish</h3>
            <p className="text-xl font-black text-[#1A2332] dark:text-white">37207</p>
          </div>
        </div>

        {/* Password block */}
        <div className="bg-white dark:bg-navy-elevated p-8 rounded-[32px] border border-slate-100 dark:border-navy-raised shadow-sm flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Parol</h3>
            <button className="w-8 h-8 flex items-center justify-center bg-slate-50 dark:bg-navy-raised rounded-xl text-slate-400 hover:text-primary transition-all">
              <EditIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
          <p className="text-xl font-black text-[#1A2332] dark:text-white">••••••••</p>
        </div>

        {/* Notifications block */}
        <div className="bg-white dark:bg-navy-elevated p-8 rounded-[32px] border border-slate-100 dark:border-navy-raised shadow-sm flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Bildirishnoma sozlamalari</h3>
            <button className="w-8 h-8 flex items-center justify-center bg-slate-50 dark:bg-navy-raised rounded-xl text-slate-400 hover:text-primary transition-all">
              <EditIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
          <p className="text-xs text-slate-400 font-bold">Faollashtirilgan</p>
        </div>
      </div>

      {/* Contracts Card */}
      <div className="bg-white dark:bg-navy-elevated p-8 rounded-[32px] border border-slate-100 dark:border-navy-raised shadow-sm">
        <h2 className="text-lg font-black text-[#1A2332] dark:text-white mb-6 uppercase tracking-tight">Shartnomalarim</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contracts.map((c) => (
            <div 
              key={c.id} 
              className="flex items-center justify-between p-5 bg-slate-50 dark:bg-navy-raised/50 border border-slate-100 dark:border-navy-raised rounded-2xl cursor-pointer hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <AttachFileIcon className="text-slate-400" sx={{ fontSize: 20 }} />
                <span className="text-xs font-bold text-[#1A2332] dark:text-white">{c.name}</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yuklab olish</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentSettings;
