import { useState, useEffect } from 'react';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import { useAuth } from '../AuthContext';

const Dashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    groups: 0,
    courses: 0,
    students: 0,
    rooms: 0,
    teachers: 0
  });

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [g, c, s, r, t] = await Promise.all([
        fetch('/api/v1/groups/all', { headers }).then(res => res.json()),
        fetch('/api/v1/courses', { headers }).then(res => res.json()),
        fetch('/api/v1/students', { headers }).then(res => res.json()),
        fetch('/api/v1/rooms', { headers }).then(res => res.json()),
        fetch('/api/v1/teachers', { headers }).then(res => res.json()),
      ]);

      setStats({
        groups: Array.isArray(g.data) ? g.data.length : 0,
        courses: Array.isArray(c.data) ? c.data.length : 0,
        students: Array.isArray(s.data) ? s.data.length : 0,
        rooms: Array.isArray(r.data) ? r.data.length : 0,
        teachers: Array.isArray(t.data) ? t.data.length : 0,
      });
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const cards = [
    { title: 'Guruhlar', count: stats.groups, icon: <GroupsIcon />, color: 'text-purple-500', bg: 'bg-purple-50' },
    { title: 'Kurslar', count: stats.courses, icon: <MenuBookIcon />, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Talabalar', count: stats.students, icon: <SchoolIcon />, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { title: 'Xonalar', count: stats.rooms, icon: <BusinessIcon />, color: 'text-teal-500', bg: 'bg-teal-50' },
    { title: 'O\'qituvchilar', count: stats.teachers, icon: <PeopleAltOutlinedIcon />, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-10 py-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-[#1A2332] dark:text-white">Salom, creator!</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Najot Edu CRM tizimiga xush kelibsiz!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white dark:bg-navy-elevated rounded-[32px] p-10 border border-slate-50 dark:border-navy-raised flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer hover:-translate-y-2">
            <div className={`w-16 h-16 ${card.bg} dark:bg-navy-raised rounded-2xl flex items-center justify-center ${card.color} mb-6 group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2">{card.title}</p>
            <h3 className="text-4xl font-black text-[#1A2332] dark:text-white">{card.count}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
