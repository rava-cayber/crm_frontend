import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Login = () => {
  const [phone, setPhone] = useState('+998');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (data.accessToken) {
        try {
          const payloadBase64 = data.accessToken.split('.')[1];
          const payloadJson = atob(payloadBase64);
          const decoded = JSON.parse(payloadJson);
          
          const actualUser = {
            id: decoded.id,
            firstName: decoded.first_name || decoded.firstName || 'User',
            lastName: decoded.last_name || decoded.lastName || '',
            email: decoded.email,
            role: decoded.role || 'SUPERADMIN'
          };
          login(data.accessToken, actualUser);
          
          if (decoded.role === 'STUDENT') {
            navigate('/guruhlar');
          } else {
            navigate('/boshqarish/kurslar');
          }
        } catch (decodeErr) {
          console.error('Failed to decode token:', decodeErr);
          const mockUser = {
            id: 1,
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@crm.com',
            role: 'SUPERADMIN'
          };
          login(data.accessToken, mockUser);
          navigate('/boshqarish/kurslar');
        }
      } else {
        setError(data.message || 'Telefon raqami yoki parol xato');
      }
    } catch (err) {
      setError('Serverga ulanishda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans overflow-hidden">
      {/* Left Side: Dark Illustration Area */}
      <div className="hidden md:flex md:w-1/2 bg-[#1A2332] flex-col items-center justify-center relative p-12">
          <div className="w-full max-w-lg mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <img 
              src="/brain/0de55a1f-38a3-4550-a7f6-0f5a96e10d5e/study_illustration_login_1778480401477.png" 
              alt="Najot Edu Illustration" 
              className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-3xl"
            />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            Najot <span className="text-primary">Edu</span>
          </h1>
        
        {/* Decorative Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] border border-slate-700/30 rounded-full"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] border border-slate-700/30 rounded-full"></div>
      </div>

      {/* Right Side: Login Form Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-24 bg-white relative">
        <div className="max-w-[380px] w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#1A2332] rounded-2xl flex items-center justify-center shadow-xl mb-6 ring-4 ring-slate-50">
               <span className="text-3xl">🪙</span>
            </div>
            <h2 className="text-[22px] font-black text-[#1A2332] uppercase tracking-tight leading-tight mb-2">
              Najot Edu
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Tizimga kirish uchun ma'lumotlaringizni kiriting
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <div className="absolute -top-2.5 left-4 bg-white px-1.5 z-10 transition-all group-focus-within:text-primary">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Telefon raqam *</label>
              </div>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl text-slate-800 font-bold focus:border-[#1A2332] outline-none transition-all placeholder-slate-300"
              />
            </div>

            <div className="relative group">
              <div className="absolute -top-2.5 left-4 bg-white px-1.5 z-10 transition-all group-focus-within:text-primary">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Parol *</label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl text-slate-800 font-bold focus:border-[#1A2332] outline-none transition-all placeholder-slate-300"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center font-bold animate-shake">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#1A2332] hover:bg-[#0F172A] text-white rounded-full font-black text-sm uppercase tracking-widest shadow-2xl shadow-slate-200 transition-all active:scale-[0.97] disabled:opacity-50"
            >
              {isLoading ? 'Yuklanmoqda...' : 'Kirish'}
            </button>
          </form>

          <div className="absolute bottom-8 left-0 right-0 text-center px-4">
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
              Copyright © 2026 CRM System. Barcha huquqlar himoyalangan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
