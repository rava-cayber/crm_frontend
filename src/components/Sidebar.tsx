import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useAuth } from '../AuthContext';

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const [isManagementHovered, setIsManagementHovered] = useState(false);
  const { user } = useAuth();
  const role = user?.role;

  const menuItems = role === 'STUDENT' ? [
    { path: '/asosiy', name: 'Bosh sahifa', icon: <HomeOutlinedIcon /> },
    { path: '/student/tolovlarim', name: 'To\'lovlarim', icon: <CreditCardIcon /> },
    { path: '/guruhlar', name: 'Guruhlarim', icon: <PeopleOutlineOutlinedIcon /> },
    { path: '/student/sozlamalar', name: 'Sozlamalar', icon: <SettingsOutlinedIcon /> },
  ] : [
    { path: '/asosiy', name: 'Asosiy', icon: <HomeOutlinedIcon /> },
    { path: '/oqituvchilar', name: 'O\'qituvchilar', icon: <PersonOutlineOutlinedIcon /> },
    { path: '/guruhlar', name: 'Guruhlar', icon: <PeopleOutlineOutlinedIcon /> },
    { path: '/talabalar', name: 'Talabalar', icon: <SchoolOutlinedIcon /> },
    { path: '/sovg\'alar', name: 'Sovg\'alar', icon: <CardGiftcardOutlinedIcon /> },
    { path: '/profil', name: 'Profil', icon: <PersonIcon /> },
  ];

  const managementSubItems = [
    { path: '/boshqarish/kurslar', name: 'Kurslar', icon: <MenuBookIcon /> },
    { path: '/boshqarish/xonalar', name: 'Xonalar', icon: <BusinessIcon /> },
    { path: '/boshqarish/xodimlar', name: 'Xodimlar', icon: <GroupsIcon /> },
    { path: '/boshqarish/xabar-yuborish', name: 'Xabar yuborish', icon: <MessageOutlinedIcon /> },
    { path: '/boshqarish/telegram-bot', name: 'Telegram Bot', icon: <SendOutlinedIcon /> },
  ];

  return (
    <aside className="relative flex h-screen overflow-visible">
      {/* Primary Sidebar */}
      <div className={`bg-white dark:bg-navy-elevated transition-all duration-300 flex flex-col border-r border-slate-100 dark:border-navy-raised z-20 ${isOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-navy-raised gap-3">
          <div className="w-10 h-10 bg-[#1A2332] rounded-xl flex items-center justify-center shadow-lg shrink-0">
             <span className="text-xl">🪙</span>
          </div>
          {isOpen && <span className="font-black text-xl text-[#1A2332] dark:text-white tracking-tight uppercase">Najot Edu</span>}
        </div>

        <div className="flex-1 py-6 flex flex-col justify-between overflow-y-auto">
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-2xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-slate-50 dark:bg-navy-raised text-[#1A2332] dark:text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-navy-raised'
                  }`
                }
              >
                <div className="flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                {isOpen && (
                  <span className="ml-4 text-sm font-bold flex-1">{item.name}</span>
                )}
              </NavLink>
            ))}

            {/* Boshqarish Trigger */}
            {role !== 'STUDENT' && (
              <div 
                onMouseEnter={() => setIsManagementHovered(true)}
                onMouseLeave={() => setIsManagementHovered(false)}
                className="relative mt-2"
              >
                <div 
                  className={`flex items-center px-4 py-4 rounded-2xl transition-all duration-300 cursor-pointer shadow-lg ${
                    isManagementHovered || window.location.pathname.startsWith('/boshqarish')
                      ? 'bg-[#8b5cf6] text-white shadow-[#8b5cf6]/30 translate-x-1'
                      : 'bg-white dark:bg-navy-elevated text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-center shrink-0">
                    <SettingsOutlinedIcon />
                  </div>
                  {isOpen && (
                    <span className="ml-4 text-sm font-bold flex-1">Boshqarish</span>
                  )}
                </div>

                {/* Side Submenu (Connected) */}
                <div 
                  className={`fixed top-0 bottom-0 ${isOpen ? 'left-64' : 'left-20'} w-[300px] bg-white dark:bg-navy-elevated border-r border-slate-100 dark:border-navy-raised transition-all duration-300 transform z-10 before:absolute before:top-0 before:bottom-0 before:-left-4 before:w-4 before:bg-transparent ${
                    isManagementHovered ? 'translate-x-0 opacity-100 visible' : '-translate-x-full opacity-0 invisible'
                  }`}
                >
                  <div className="h-16 flex items-center px-8 border-b border-slate-100 dark:border-navy-raised">
                     <h2 className="text-xl font-black text-[#1A2332] dark:text-white uppercase tracking-wider">Menu</h2>
                  </div>
                  
                  {/* Middle Chevron Button */}
                  <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-30">
                     <div className="w-8 h-8 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#8b5cf6]/40 cursor-pointer hover:scale-110 transition-transform">
                        <ChevronLeftIcon fontSize="small" />
                     </div>
                  </div>

                  <div className="p-4 space-y-2">
                    {managementSubItems.map((subItem) => (
                      <NavLink
                        key={subItem.name}
                        to={subItem.path}
                        className={({ isActive }) =>
                          `flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all duration-200 ${
                            isActive
                              ? 'bg-slate-50 dark:bg-navy-raised text-[#1A2332] dark:text-white font-black'
                              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-navy-raised'
                          }`
                        }
                      >
                        <div className="shrink-0">{subItem.icon}</div>
                        <span className="text-base font-bold">{subItem.name}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Subscription Card */}
          {isOpen && role !== 'STUDENT' && (
            <div className="px-4 mt-10">
              <div className="bg-slate-50 dark:bg-navy-raised rounded-3xl p-6 relative overflow-hidden border border-slate-100 dark:border-navy-raised">
                 <div className="flex items-center gap-3 mb-4">
                    <CardGiftcardOutlinedIcon className="text-[#1A2332] dark:text-white" />
                    <span className="font-black text-xs text-[#1A2332] dark:text-white uppercase tracking-widest">Obuna</span>
                 </div>
                 <p className="text-[10px] font-black text-red-500 uppercase tracking-tighter mb-4">Obunangiz tugagan</p>
                 <button className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/20 active:scale-[0.98]">
                    Obunani yangilash
                  </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
