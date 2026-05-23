import { useThemeContext } from '../ThemeContext';
import { useAuth } from '../AuthContext';
import IconButton from '@mui/material/IconButton';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const Header = () => {
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { user, logout } = useAuth();

  return (
    <header className="h-20 bg-white dark:bg-navy-elevated flex items-center justify-between px-8 border-b border-slate-100 dark:border-navy-raised transition-all">
      {/* Left: Date Range */}
      <div className="bg-slate-50 dark:bg-navy-raised px-4 py-2 rounded-xl border border-slate-100 dark:border-navy-raised">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">May 1, 2026 - May 31, 2026</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Toggle */}
        <div className="bg-slate-100 dark:bg-navy-raised p-1 rounded-full flex items-center gap-1">
          <div className="bg-[#8b5cf6] text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-[#8b5cf6]/30 cursor-pointer">UZ</div>
          <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 cursor-pointer">RU</div>
        </div>

        {/* Dark Mode */}
        <IconButton onClick={toggleTheme} className="bg-white dark:bg-navy-raised border border-slate-100 dark:border-navy-raised shadow-sm" sx={{ color: isDarkMode ? '#facc15' : '#1e293b' }}>
          <DarkModeOutlinedIcon fontSize="small" />
        </IconButton>

        {/* Logout */}
        <IconButton onClick={logout} className="bg-red-50 text-red-500 border border-red-100 shadow-sm hover:bg-red-100">
          <LogoutOutlinedIcon fontSize="small" />
        </IconButton>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-100 dark:border-navy-raised">
          <div className="text-right">
             <h4 className="text-sm font-black text-[#1A2332] dark:text-white uppercase leading-none">{user?.firstName || 'ADMIN'}</h4>
             <p className="text-[10px] text-slate-400 font-bold lowercase mt-1">{user?.email || 'admin@crm.com'}</p>
          </div>
          <div className="w-10 h-10 bg-[#8b5cf6] rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-[#8b5cf6]/20">
             SA
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
