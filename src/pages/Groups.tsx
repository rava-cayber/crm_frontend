import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const Groups = () => {
  const { token, user } = useAuth();
  const role = user?.role;
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [groupsData, setGroupsData] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [studentToAdd, setStudentToAdd] = useState<string>('');
  const [showArchive, setShowArchive] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    course_id: '',
    teacher_id: '',
    room_id: '',
    start_date: '',
    week_day: [] as string[],
    start_time: '',
    max_student: 20
  });

  const [editData, setEditData] = useState({
    name: '',
    description: '',
    course_id: '',
    teacher_id: '',
    room_id: '',
    start_date: '',
    week_day: [] as string[],
    start_time: '',
    max_student: 20
  });

  const stats = [
    { title: 'Jami guruhlar', count: groupsData.length, icon: <GroupsIcon />, color: 'text-purple-500', bg: 'bg-purple-50' },
    { title: 'O\'qituvchilar', count: teachers.length, icon: <ChatBubbleOutlinedIcon />, color: 'text-purple-500', bg: 'bg-purple-50' },
    { title: 'O\'quvchilar', count: groupsData.reduce((acc, g) => acc + (g.studentGroups?.length || 0), 0), icon: <MenuBookIcon />, color: 'text-teal-500', bg: 'bg-teal-50' },
  ];

  const fetchGroups = async () => {
    try {
      const url = role === 'STUDENT'
        ? '/api/v1/students/my/groups'
        : `/api/v1/groups/all?status=${showArchive ? 'inactive' : 'active'}`;
      const res = await fetch(url, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      const data = await res.json();
      setGroupsData(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInitialData = () => {
    fetch('/api/v1/courses', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json()).then(data => setCourses(data.data || []));
    fetch('/api/v1/teachers', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json()).then(data => setTeachers(data.data || []));
    fetch('/api/v1/rooms', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json()).then(data => setRooms(data.data || []));
    fetch('/api/v1/students', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json()).then(data => setAllStudents(data.data || []));
  };

  useEffect(() => {
    if (token) {
      fetchGroups();
      fetchInitialData();
    }
  }, [token, showArchive]);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          course_id: Number(formData.course_id),
          teacher_id: Number(formData.teacher_id),
          room_id: Number(formData.room_id),
          max_student: Number(formData.max_student)
        })
      });
      const result = await res.json();
      if (res.ok) {
        setDrawerOpen(false);
        await fetchGroups();
        setFormData({
          name: '', description: '', course_id: '', teacher_id: '', room_id: '',
          start_date: '', week_day: [], start_time: '', max_student: 20
        });
        alert("Guruh muvaffaqiyatli qo'shildi!");
      } else {
        alert("Xatolik: " + (result.message || "Noma'lum xatolik"));
      }
    } catch (err) {
      console.error(err);
      alert("Server bilan bog'lanishda xatolik yuz berdi");
    }
  };

  const handleEditOpen = (group: any) => {
    setSelectedGroup(group);
    setEditData({
      name: group.name || '',
      description: group.description || '',
      course_id: group.courses?.id || '',
      teacher_id: group.teachers?.id || '',
      room_id: group.rooms?.id || '',
      start_date: group.start_date ? new Date(group.start_date).toISOString().split('T')[0] : '',
      week_day: group.week_day || [],
      start_time: group.start_time || '',
      max_student: group.max_student || 20
    });
    setEditDrawerOpen(true);
  };

  const handleUpdateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/v1/groups/${selectedGroup.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...editData,
          course_id: Number(editData.course_id),
          teacher_id: Number(editData.teacher_id),
          room_id: Number(editData.room_id),
          max_student: Number(editData.max_student)
        })
      });
      const result = await res.json();
      if (res.ok) {
        setEditDrawerOpen(false);
        await fetchGroups();
        alert("Guruh ma'lumotlari yangilandi!");
      } else {
        alert("Xatolik: " + (result.message || "Noma'lum xatolik"));
      }
    } catch (err) {
      console.error(err);
      alert("Server bilan bog'lanishda xatolik yuz berdi");
    }
  };

  const handleDeleteGroup = (id: number) => {
    if (!confirm("Guruhni o'chirishni tasdiqlaysizmi?")) return;
    fetch(`/api/v1/groups/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(() => fetchGroups())
    .catch(err => console.error(err));
  };

  const handleAddStudentToGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId || !studentToAdd) return;
    try {
      const res = await fetch('/api/v1/groups/add-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          group_id: selectedGroupId,
          student_id: Number(studentToAdd)
        })
      });
      const result = await res.json();
      if (res.ok) {
        setAddStudentOpen(false);
        setStudentToAdd('');
        await fetchGroups();
        alert("Talaba guruhga qo'shildi!");
      } else {
        alert("Xatolik: " + (result.message || "Noma'lum xatolik"));
      }
    } catch (err) {
      console.error(err);
      alert("Server bilan bog'lanishda xatolik yuz berdi");
    }
  };

  if (role === 'STUDENT') {
    return (
      <div className="space-y-8 py-6 max-w-7xl mx-auto animate-fade-in">
        <div className="border-b border-slate-100 dark:border-navy-raised pb-6">
          <h1 className="text-2xl font-black text-[#1A2332] dark:text-white uppercase tracking-tight">Guruhlarim</h1>
          <p className="text-xs text-slate-400 font-medium">Siz a'zo bo'lgan guruhlar ro'yxati.</p>
        </div>

        <div className="bg-white dark:bg-navy-elevated rounded-[32px] border border-slate-100 dark:border-navy-raised overflow-hidden shadow-sm">
          <div className="px-8 pt-6 border-b border-slate-100 dark:border-navy-raised">
            <div className="flex gap-8">
              <button 
                onClick={() => setShowArchive(false)}
                className={`pb-4 border-b-2 ${!showArchive ? 'border-primary text-primary font-black' : 'border-transparent text-slate-400'} text-xs uppercase tracking-wider transition-all`}
              >
                Faol
              </button>
              <button 
                onClick={() => setShowArchive(true)}
                className={`pb-4 border-b-2 ${showArchive ? 'border-primary text-primary font-black' : 'border-transparent text-slate-400'} text-xs uppercase tracking-wider transition-all`}
              >
                Tugagan
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-navy-raised/30">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Guruh nomi</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Yo'nalishi</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">O'qituvchi</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Boshlash vaqti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-raised/50">
                {groupsData.map((group, idx) => (
                  <tr 
                    key={group.id} 
                    onClick={() => navigate(`/guruhlar/${group.id}`)} 
                    className="cursor-pointer hover:bg-slate-50/50 dark:hover:bg-navy-raised/30 transition-colors"
                  >
                    <td className="px-8 py-6 text-xs font-bold text-slate-400">{idx + 1}</td>
                    <td className="px-8 py-6 text-xs font-black text-[#1A2332] dark:text-white">{group.name}</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-navy-raised rounded-full text-[10px] font-bold text-slate-500">
                        {group.courses?.name || 'Programming'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Avatar src={group.teachers?.photo} sx={{ width: 24, height: 24 }} />
                        <span className="text-xs font-bold text-slate-500">
                          {group.teachers?.full_name || 'John Doe'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-500">
                      {group.start_date ? new Date(group.start_date).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#1A2332] dark:text-white">Guruhlar</h1>
          <p className="text-xs text-slate-400 font-medium">Ushbu sahifada siz guruhlarni boshqarishingiz mumkin.</p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDrawerOpen(true)}
          className="bg-primary hover:bg-primary/90 rounded-2xl px-6 py-3 font-bold capitalize shadow-lg shadow-primary/20"
        >
          Guruh qo'shish
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-navy-elevated rounded-[32px] p-8 border border-slate-50 dark:border-navy-raised flex items-start gap-6 shadow-sm">
            <div className={`w-14 h-14 ${stat.bg} dark:bg-navy-raised rounded-2xl flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-3xl font-black text-[#1A2332] dark:text-white">{stat.count}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-navy-elevated rounded-[32px] border border-slate-50 dark:border-navy-raised overflow-hidden shadow-sm">
        <div className="px-8 pt-6 border-b border-slate-50 dark:border-navy-raised">
          <div className="flex gap-8">
            <button 
              onClick={() => setShowArchive(false)}
              className={`pb-4 border-b-2 ${!showArchive ? 'border-primary text-primary' : 'border-transparent text-slate-400'} text-xs font-black uppercase tracking-wider transition-all`}
            >
              Guruhlar
            </button>
            <button 
              onClick={() => setShowArchive(true)}
              className={`pb-4 border-b-2 ${showArchive ? 'border-primary text-primary' : 'border-transparent text-slate-400'} text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:text-slate-600 transition-all`}
            >
              <DeleteOutlinedIcon sx={{ fontSize: 16 }} /> Arxiv
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-navy-raised/30">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Guruh</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kurs</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Davomiyligi</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dars vaqti</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Xona</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">O'qituvchi</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Talabalar</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-navy-raised">
              {groupsData.map((group) => (
                <tr key={group.id} onClick={() => navigate(`/guruhlar/${group.id}`)} className="cursor-pointer hover:bg-slate-50/50 dark:hover:bg-navy-raised/30 transition-colors">
                  <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <Switch checked={group.status === 'active'} size="small" color="primary" />
                      <span className="text-[10px] font-black text-primary uppercase">{group.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-black text-[#1A2332] dark:text-white">{group.name}</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-navy-raised rounded-full text-[10px] font-bold text-slate-500">{group.courses?.name}</span>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-500">{new Date(group.start_date).toLocaleDateString()}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-[#1A2332] dark:text-white">{group.start_time}</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase leading-tight mt-1">{group.week_day?.join(', ')}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[10px] font-black text-slate-500 tracking-wider uppercase">{group.rooms?.name}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Avatar src={group.teachers?.photo} sx={{ width: 24, height: 24 }} />
                      <span className="text-xs font-bold text-slate-500">{group.teachers?.full_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center text-xs font-black text-[#1A2332] dark:text-white">{group.studentGroups?.length || 0}</td>
                  <td className="px-8 py-6 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <IconButton size="small" onClick={() => { setSelectedGroupId(group.id); setAddStudentOpen(true); }} className="text-slate-300 hover:text-green-500 cursor-pointer transition-colors">
                        <PersonAddIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEditOpen(group)} className="text-slate-300 hover:text-blue-500 cursor-pointer transition-colors">
                        <EditOutlinedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteGroup(group.id)} className="text-slate-300 hover:text-red-500 cursor-pointer transition-colors">
                        <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student to Group Drawer */}
      <Drawer anchor="right" open={addStudentOpen} onClose={() => setAddStudentOpen(false)}>
        <div className="w-[450px] h-full flex flex-col bg-white dark:bg-navy-elevated">
          <div className="p-8 border-b border-slate-50 dark:border-navy-raised flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#1A2332] dark:text-white uppercase tracking-tight">Talaba qo'shish</h2>
              <p className="text-xs text-slate-400 font-medium">Guruhga talaba tanlang.</p>
            </div>
            <button onClick={() => setAddStudentOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-navy-raised rounded-xl text-slate-400 hover:text-red-500 transition-colors">
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleAddStudentToGroup} className="p-8 flex-1 overflow-y-auto space-y-5">
            <TextField fullWidth select label="Talaba tanlang" value={studentToAdd} onChange={e => setStudentToAdd(e.target.value)} required>
              {allStudents.map(s => <MenuItem key={s.id} value={s.id}>{s.full_name} ({s.phone})</MenuItem>)}
            </TextField>
            <div className="pt-6 flex gap-3">
              <Button onClick={() => setAddStudentOpen(false)} className="flex-1 py-3.5 text-slate-400 font-bold capitalize">Bekor qilish</Button>
              <Button type="submit" variant="contained" className="flex-1 py-3.5 bg-primary hover:bg-primary/90 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">Qo'shish</Button>
            </div>
          </form>
        </div>
      </Drawer>

      {/* Add Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="w-[500px] h-full flex flex-col bg-white dark:bg-navy-elevated">
          <div className="p-8 border-b border-slate-50 dark:border-navy-raised flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#1A2332] dark:text-white uppercase tracking-tight">Guruh qo'shish</h2>
              <p className="text-xs text-slate-400 font-medium">Yangi guruh ma'lumotlarini kiriting.</p>
            </div>
            <button onClick={() => setDrawerOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-navy-raised rounded-xl text-slate-400 hover:text-red-500 transition-colors">
              <CloseIcon />
            </button>
          </div>

          <form onSubmit={handleCreateGroup} className="p-8 flex-1 overflow-y-auto space-y-5">
            <TextField fullWidth label="Guruh nomi" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <TextField fullWidth label="Tavsif" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />

            <TextField fullWidth select label="Kurs" value={formData.course_id} onChange={e => setFormData({...formData, course_id: e.target.value})} required>
              {courses.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </TextField>
            <TextField fullWidth select label="O'qituvchi" value={formData.teacher_id} onChange={e => setFormData({...formData, teacher_id: e.target.value})} required>
              {teachers.map(t => <MenuItem key={t.id} value={t.id}>{t.full_name}</MenuItem>)}
            </TextField>
            <TextField fullWidth select label="Xona" value={formData.room_id} onChange={e => setFormData({...formData, room_id: e.target.value})} required>
              {rooms.map(r => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
            </TextField>
            <TextField fullWidth label="Maksimal talaba" type="number" value={formData.max_student} onChange={e => setFormData({...formData, max_student: Number(e.target.value)})} required />
            <TextField fullWidth type="date" label="Boshlanish sanasi" slotProps={{ inputLabel: { shrink: true } }} value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required />
            <TextField fullWidth type="time" label="Dars vaqti" slotProps={{ inputLabel: { shrink: true } }} value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} required />

            <FormControl fullWidth>
              <InputLabel>Dars kunlari</InputLabel>
              <Select
                multiple
                value={formData.week_day}
                onChange={e => setFormData({...formData, week_day: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value})}
                renderValue={(selected) => selected.join(', ')}
              >
                {DAYS.map((day) => (
                  <MenuItem key={day} value={day}>
                    <Checkbox checked={formData.week_day.indexOf(day) > -1} />
                    <ListItemText primary={day} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="pt-6 flex gap-3">
              <Button onClick={() => setDrawerOpen(false)} className="flex-1 py-3.5 text-slate-400 font-bold capitalize">Bekor qilish</Button>
              <Button type="submit" variant="contained" className="flex-1 py-3.5 bg-primary hover:bg-primary/90 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">Saqlash</Button>
            </div>
          </form>
        </div>
      </Drawer>

      {/* Edit Drawer */}
      <Drawer anchor="right" open={editDrawerOpen} onClose={() => setEditDrawerOpen(false)}>
        <div className="w-[500px] h-full flex flex-col bg-white dark:bg-navy-elevated">
          <div className="p-8 border-b border-slate-50 dark:border-navy-raised flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#1A2332] dark:text-white uppercase tracking-tight">Guruhni tahrirlash</h2>
              <p className="text-xs text-slate-400 font-medium">Guruh ma'lumotlarini yangilang.</p>
            </div>
            <button onClick={() => setEditDrawerOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-navy-raised rounded-xl text-slate-400 hover:text-red-500 transition-colors">
              <CloseIcon />
            </button>
          </div>

          <form onSubmit={handleUpdateGroup} className="p-8 flex-1 overflow-y-auto space-y-5">
            <TextField fullWidth label="Guruh nomi" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} required />
            <TextField fullWidth label="Tavsif" value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} />

            <TextField fullWidth select label="Kurs" value={editData.course_id} onChange={e => setEditData({...editData, course_id: e.target.value})} required>
              {courses.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </TextField>
            <TextField fullWidth select label="O'qituvchi" value={editData.teacher_id} onChange={e => setEditData({...editData, teacher_id: e.target.value})} required>
              {teachers.map(t => <MenuItem key={t.id} value={t.id}>{t.full_name}</MenuItem>)}
            </TextField>
            <TextField fullWidth select label="Xona" value={editData.room_id} onChange={e => setEditData({...editData, room_id: e.target.value})} required>
              {rooms.map(r => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
            </TextField>
            <TextField fullWidth label="Maksimal talaba" type="number" value={editData.max_student} onChange={e => setEditData({...editData, max_student: Number(e.target.value)})} required />
            <TextField fullWidth type="date" label="Boshlanish sanasi" slotProps={{ inputLabel: { shrink: true } }} value={editData.start_date} onChange={e => setEditData({...editData, start_date: e.target.value})} required />
            <TextField fullWidth type="time" label="Dars vaqti" slotProps={{ inputLabel: { shrink: true } }} value={editData.start_time} onChange={e => setEditData({...editData, start_time: e.target.value})} required />

            <FormControl fullWidth>
              <InputLabel>Dars kunlari</InputLabel>
              <Select
                multiple
                value={editData.week_day}
                onChange={e => setEditData({...editData, week_day: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value})}
                renderValue={(selected) => selected.join(', ')}
              >
                {DAYS.map((day) => (
                  <MenuItem key={day} value={day}>
                    <Checkbox checked={editData.week_day.indexOf(day) > -1} />
                    <ListItemText primary={day} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="pt-6 flex gap-3">
              <Button onClick={() => setEditDrawerOpen(false)} className="flex-1 py-3.5 text-slate-400 font-bold capitalize">Bekor qilish</Button>
              <Button type="submit" variant="contained" className="flex-1 py-3.5 bg-primary hover:bg-primary/90 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">Saqlash</Button>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
};

export default Groups;
