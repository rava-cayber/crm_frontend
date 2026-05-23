import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArchiveIcon from '@mui/icons-material/Archive';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import GroupsIcon from '@mui/icons-material/Groups';
import { useAuth } from '../AuthContext';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const CoursePage = () => {
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  
  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    price: 0,
    duration_month: 0,
    duration_hours: 0,
    level: 'beginner'
  });

  const [editData, setEditData] = useState({
    name: '',
    description: '',
    price: 0,
    duration_month: 0,
    duration_hours: 0,
    level: 'beginner'
  });
  
  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    description: '',
    teacher_id: '',
    room_id: '',
    start_date: '',
    week_day: [] as string[],
    start_time: '',
    max_student: 20
  });

  const [showArchive, setShowArchive] = useState(false);

  const { token } = useAuth();
  const colors = ['bg-slate-50', 'bg-purple-50', 'bg-yellow-50', 'bg-green-50', 'bg-blue-50', 'bg-pink-50'];

  const fetchCourses = async () => {
    try {
      const res = await fetch(`/api/v1/courses?status=${showArchive ? 'inactive' : 'active'}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      const data = await res.json();
      setCoursesData(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCourses();
      fetch('/api/v1/teachers', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json()).then(data => setTeachers(data.data || []));
      fetch('/api/v1/rooms', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json()).then(data => setRooms(data.data || []));
    }
  }, [token, showArchive]);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/v1/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCourse),
      });
      const result = await response.json();
      if (response.ok) {
        setDrawerOpen(false);
        setNewCourse({ name: '', description: '', price: 0, duration_month: 0, duration_hours: 0, level: 'beginner' });
        await fetchCourses();
        alert("Kurs muvaffaqiyatli qo'shildi!");
      } else {
        alert("Xatolik: " + (result.message || "Noma'lum xatolik"));
      }
    } catch (err) {
      console.error(err);
      alert("Server bilan bog'lanishda xatolik yuz berdi");
    }
  };

  const handleEditOpen = (course: any) => {
    setSelectedCourse(course);
    setEditData({
      name: course.name || '',
      description: course.description || '',
      price: course.price || 0,
      duration_month: course.duration_month || 0,
      duration_hours: course.duration_hours || 0,
      level: course.level || 'beginner'
    });
    setEditDrawerOpen(true);
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/v1/courses/${selectedCourse.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData),
      });
      const result = await response.json();
      if (response.ok) {
        setEditDrawerOpen(false);
        await fetchCourses();
        alert("Kurs ma'lumotlari yangilandi!");
      } else {
        alert("Xatolik: " + (result.message || "Noma'lum xatolik"));
      }
    } catch (err) {
      console.error(err);
      alert("Server bilan bog'lanishda xatolik yuz berdi");
    }
  };

  const handleDeleteCourse = (id: number) => {
    if (!confirm("Kursni o'chirishni tasdiqlaysizmi?")) return;
    fetch(`/api/v1/courses/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(() => fetchCourses())
    .catch(err => console.error(err));
  };

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    try {
      const res = await fetch('/api/v1/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...groupFormData,
          course_id: selectedCourse.id,
          teacher_id: Number(groupFormData.teacher_id),
          room_id: Number(groupFormData.room_id),
          max_student: Number(groupFormData.max_student)
        })
      });
      const result = await res.json();
      if (res.ok) {
        setAddGroupOpen(false);
        setGroupFormData({
          name: '', description: '', teacher_id: '', room_id: '',
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Kurslar</h2>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-navy-elevated border border-slate-200 dark:border-navy-raised rounded-xl p-1 shadow-sm">
             <button 
              onClick={() => setShowArchive(false)}
              className={`p-2 ${!showArchive ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'} rounded-lg transition-all flex items-center gap-2 text-sm font-medium`}
             >
                <FilterListIcon fontSize="small" /> Kurslar
             </button>
             <div className="w-px h-6 bg-slate-200 dark:bg-navy-raised mx-1"></div>
             <button 
              onClick={() => setShowArchive(true)}
              className={`p-2 ${showArchive ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'} rounded-lg transition-all flex items-center gap-2 text-sm font-medium`}
             >
                <ArchiveIcon fontSize="small" /> Arxiv
             </button>
          </div>

          <Button 
            variant="contained" 
            onClick={() => setDrawerOpen(true)}
            startIcon={<AddIcon />} 
            className="bg-primary hover:bg-primary/90 rounded-2xl px-6 py-3 font-bold capitalize shadow-lg shadow-primary/20"
          >
            Kurs qo'shish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {coursesData.length > 0 ? coursesData.map((course, index) => (
          <div key={index} className={`${colors[index % colors.length]} dark:bg-navy-raised rounded-2xl p-6 border border-slate-100 dark:border-navy-raised relative group transition-all duration-300 hover:shadow-xl hover:-translate-y-2`}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-white dark:bg-navy-elevated rounded-xl flex items-center justify-center text-primary shadow-sm">
                 <span className="font-bold text-lg">{course.name?.charAt(0)}</span>
              </div>
              <div className="flex opacity-0 group-hover:opacity-100 transition-all gap-1 translate-y-[-10px] group-hover:translate-y-0">
                <button onClick={() => handleDeleteCourse(course.id)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-navy-elevated rounded-lg text-slate-400 hover:text-red-500 shadow-sm"><DeleteOutlinedIcon fontSize="small" /></button>
                <button onClick={() => handleEditOpen(course)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-navy-elevated rounded-lg text-slate-400 hover:text-blue-500 shadow-sm"><EditOutlinedIcon fontSize="small" /></button>
                <button onClick={() => { setSelectedCourse(course); setAddGroupOpen(true); }} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-navy-elevated rounded-lg text-slate-400 hover:text-green-500 shadow-sm"><GroupsIcon fontSize="small" /></button>
              </div>
            </div>
            
            <h3 className="font-bold text-slate-800 dark:text-white text-base mb-2">{course.name || 'Unnamed Course'}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 h-8">{course.description || 'No description available.'}</p>
            
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-200/50 dark:border-navy-elevated">
              <span className="bg-white/80 dark:bg-navy-elevated px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{course.duration_hours || 0} soat</span>
              <span className="bg-white/80 dark:bg-navy-elevated px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{course.duration_month || 0} oy</span>
              <div className="flex-1 text-right">
                <span className="text-primary font-bold text-sm">{new Intl.NumberFormat().format(course.price || 0)} sum</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
             <ArchiveIcon sx={{ fontSize: 60, opacity: 0.2 }} />
             <p className="mt-4 font-medium">Hozircha kurslar mavjud emas</p>
          </div>
        )}
      </div>

      {/* Add Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="w-[450px] h-full flex flex-col bg-white dark:bg-navy-elevated">
          <div className="p-8 border-b border-slate-50 dark:border-navy-raised flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#1A2332] dark:text-white uppercase tracking-tight">Kurs qo'shish</h2>
              <p className="text-xs text-slate-400 font-medium">Yangi kurs ma'lumotlarini kiriting.</p>
            </div>
            <button onClick={() => setDrawerOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-navy-raised rounded-xl text-slate-400 hover:text-red-500 transition-colors">
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleAddCourse} className="p-8 flex-1 overflow-y-auto space-y-5">
            <TextField fullWidth label="Kurs nomi" value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} required />
            <TextField fullWidth label="Tavsif" multiline rows={4} value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} />
            <TextField fullWidth label="Narxi (sum)" type="number" value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: Number(e.target.value)})} required />
            <TextField fullWidth label="Davomiyligi (oy)" type="number" value={newCourse.duration_month} onChange={e => setNewCourse({...newCourse, duration_month: Number(e.target.value)})} required />
            <TextField fullWidth label="Davomiyligi (soat)" type="number" value={newCourse.duration_hours} onChange={e => setNewCourse({...newCourse, duration_hours: Number(e.target.value)})} required />
            
            <div className="pt-6 flex gap-3">
              <Button onClick={() => setDrawerOpen(false)} className="flex-1 py-3.5 text-slate-400 font-bold capitalize">Bekor qilish</Button>
              <Button type="submit" variant="contained" className="flex-1 py-3.5 bg-primary hover:bg-primary/90 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">Saqlash</Button>
            </div>
          </form>
        </div>
      </Drawer>

      {/* Edit Drawer */}
      <Drawer anchor="right" open={editDrawerOpen} onClose={() => setEditDrawerOpen(false)}>
        <div className="w-[450px] h-full flex flex-col bg-white dark:bg-navy-elevated">
          <div className="p-8 border-b border-slate-50 dark:border-navy-raised flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#1A2332] dark:text-white uppercase tracking-tight">Kursni tahrirlash</h2>
              <p className="text-xs text-slate-400 font-medium">Kurs ma'lumotlarini yangilang.</p>
            </div>
            <button onClick={() => setEditDrawerOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-navy-raised rounded-xl text-slate-400 hover:text-red-500 transition-colors">
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleUpdateCourse} className="p-8 flex-1 overflow-y-auto space-y-5">
            <TextField fullWidth label="Kurs nomi" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} required />
            <TextField fullWidth label="Tavsif" multiline rows={4} value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} />
            <TextField fullWidth label="Narxi (sum)" type="number" value={editData.price} onChange={e => setEditData({...editData, price: Number(e.target.value)})} required />
            <TextField fullWidth label="Davomiyligi (oy)" type="number" value={editData.duration_month} onChange={e => setEditData({...editData, duration_month: Number(e.target.value)})} required />
            <TextField fullWidth label="Davomiyligi (soat)" type="number" value={editData.duration_hours} onChange={e => setEditData({...editData, duration_hours: Number(e.target.value)})} required />
            
            <div className="pt-6 flex gap-3">
              <Button onClick={() => setEditDrawerOpen(false)} className="flex-1 py-3.5 text-slate-400 font-bold capitalize">Bekor qilish</Button>
              <Button type="submit" variant="contained" className="flex-1 py-3.5 bg-primary hover:bg-primary/90 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">Saqlash</Button>
            </div>
          </form>
        </div>
      </Drawer>
      {/* Add Group to Course Drawer */}
      <Drawer anchor="right" open={addGroupOpen} onClose={() => setAddGroupOpen(false)}>
        <div className="w-[500px] h-full flex flex-col bg-white dark:bg-navy-elevated">
          <div className="p-8 border-b border-slate-50 dark:border-navy-raised flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#1A2332] dark:text-white uppercase tracking-tight">Guruh qo'shish</h2>
              <p className="text-xs text-slate-400 font-medium">{selectedCourse?.name} kursi uchun guruh yarating.</p>
            </div>
            <button onClick={() => setAddGroupOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-navy-raised rounded-xl text-slate-400 hover:text-red-500 transition-colors">
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleAddGroup} className="p-8 flex-1 overflow-y-auto space-y-5">
            <TextField fullWidth label="Guruh nomi" value={groupFormData.name} onChange={e => setGroupFormData({...groupFormData, name: e.target.value})} required />
            <TextField fullWidth label="Tavsif" value={groupFormData.description} onChange={e => setGroupFormData({...groupFormData, description: e.target.value})} />
            
            <TextField fullWidth select label="O'qituvchi" value={groupFormData.teacher_id} onChange={e => setGroupFormData({...groupFormData, teacher_id: e.target.value})} required>
              {teachers.map(t => <MenuItem key={t.id} value={t.id}>{t.full_name}</MenuItem>)}
            </TextField>
            <TextField fullWidth select label="Xona" value={groupFormData.room_id} onChange={e => setGroupFormData({...groupFormData, room_id: e.target.value})} required>
              {rooms.map(r => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
            </TextField>
            <TextField fullWidth label="Maksimal talaba" type="number" value={groupFormData.max_student} onChange={e => setGroupFormData({...groupFormData, max_student: Number(e.target.value)})} required />
            <TextField fullWidth type="date" label="Boshlanish sanasi" slotProps={{ inputLabel: { shrink: true } }} value={groupFormData.start_date} onChange={e => setGroupFormData({...groupFormData, start_date: e.target.value})} required />
            <TextField fullWidth type="time" label="Dars vaqti" slotProps={{ inputLabel: { shrink: true } }} value={groupFormData.start_time} onChange={e => setGroupFormData({...groupFormData, start_time: e.target.value})} required />

            <FormControl fullWidth>
              <InputLabel>Dars kunlari</InputLabel>
              <Select
                multiple
                value={groupFormData.week_day}
                onChange={e => setGroupFormData({...groupFormData, week_day: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value})}
                renderValue={(selected) => selected.join(', ')}
              >
                {DAYS.map((day) => (
                  <MenuItem key={day} value={day}>
                    <Checkbox checked={groupFormData.week_day.indexOf(day) > -1} />
                    <ListItemText primary={day} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="pt-6 flex gap-3">
              <Button onClick={() => setAddGroupOpen(false)} className="flex-1 py-3.5 text-slate-400 font-bold capitalize">Bekor qilish</Button>
              <Button type="submit" variant="contained" className="flex-1 py-3.5 bg-primary hover:bg-primary/90 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">Saqlash</Button>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
};

export default CoursePage;
