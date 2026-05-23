import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Pagination from '@mui/material/Pagination';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { useAuth } from '../AuthContext';

const Students = () => {
  const { token } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [showArchive, setShowArchive] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '+998',
    address: '',
    birth_date: '',
    photo: null as File | null
  });
  const [editData, setEditData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    birth_date: '',
    photo: null as File | null
  });

  const fetchStudents = async () => {
    try {
      const res = await fetch(`/api/v1/students?status=${showArchive ? 'inactive' : 'active'}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      const data = await res.json();
      setStudentsData(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchStudents();
  }, [token, showArchive]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('full_name', formData.full_name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('phone', formData.phone);
    data.append('address', formData.address);
    data.append('birth_date', formData.birth_date);
    if (formData.photo) data.append('photo', formData.photo);

    try {
      const res = await fetch('/api/v1/students', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
      const result = await res.json();
      if (res.ok) {
        setDrawerOpen(false);
        await fetchStudents();
        setFormData({ full_name: '', email: '', password: '', phone: '+998', address: '', birth_date: '', photo: null });
        alert("Talaba muvaffaqiyatli qo'shildi!");
      } else {
        alert("Xatolik: " + (result.message || "Noma'lum xatolik"));
      }
    } catch (err) {
      console.error(err);
      alert("Server bilan bog'lanishda xatolik yuz berdi");
    }
  };

  const handleEditOpen = (student: any) => {
    setSelectedStudent(student);
    setEditData({
      full_name: student.full_name || '',
      email: student.email || '',
      phone: student.phone || '',
      address: student.address || '',
      birth_date: student.birth_date ? new Date(student.birth_date).toISOString().split('T')[0] : '',
      photo: null
    });
    setEditDrawerOpen(true);
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('full_name', editData.full_name);
    data.append('email', editData.email);
    data.append('phone', editData.phone);
    data.append('address', editData.address);
    data.append('birth_date', editData.birth_date);
    if (editData.photo) data.append('photo', editData.photo);

    try {
      const res = await fetch(`/api/v1/students/${selectedStudent.id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
      const result = await res.json();
      if (res.ok) {
        setEditDrawerOpen(false);
        await fetchStudents();
        alert("Ma'lumotlar yangilandi!");
      } else {
        alert("Xatolik: " + (result.message || "Noma'lum xatolik"));
      }
    } catch (err) {
      console.error(err);
      alert("Server bilan bog'lanishda xatolik yuz berdi");
    }
  };

  const handleDeleteStudent = (id: number) => {
    if (!confirm("Talabani o'chirishni tasdiqlaysizmi?")) return;
    fetch(`/api/v1/students/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(() => fetchStudents())
    .catch(err => console.error(err));
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#1A2332] dark:text-white">Talabalar</h1>
          <p className="text-xs text-slate-400 font-medium">Ushbu sahifada siz talabalar ro'yxatini boshqarishingiz mumkin.</p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDrawerOpen(true)}
          className="bg-primary hover:bg-primary/90 rounded-2xl px-6 py-3 font-bold capitalize shadow-lg shadow-primary/20"
        >
          Talaba qo'shish
        </Button>
      </div>

      <div className="bg-white dark:bg-navy-elevated rounded-[32px] border border-slate-50 dark:border-navy-raised overflow-hidden shadow-sm">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 dark:border-navy-raised">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowArchive(false)}
              className={`flex items-center gap-2 px-4 py-2 border ${!showArchive ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-500'} rounded-xl text-xs font-bold hover:bg-slate-50 transition-all`}
            >
              <FilterListIcon fontSize="small" /> Talabalar
            </button>
            <button 
              onClick={() => setShowArchive(true)}
              className={`flex items-center gap-2 px-4 py-2 border ${showArchive ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-500'} rounded-xl text-xs font-bold hover:bg-slate-50 transition-all`}
            >
              Arxiv
            </button>
          </div>
          <div className="relative w-full md:w-80">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" fontSize="small" />
            <input
              type="text"
              placeholder="Qidirish..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-navy-raised border border-slate-100 dark:border-navy-raised rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-navy-raised/50 border-b border-slate-100 dark:border-navy-raised">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomi</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Telefon</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tug'ilgan sanasi</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-navy-raised">
              {studentsData.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-raised/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={`http://localhost:3000/files/${student.photo}`} sx={{ width: 32, height: 32 }} />
                      <span className="text-xs font-bold text-[#1A2332] dark:text-white">{student.full_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">{student.phone}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">{student.email}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">{student.birth_date ? new Date(student.birth_date).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <IconButton size="small" onClick={() => handleEditOpen(student)} className="text-slate-400 hover:text-blue-500">
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteStudent(student.id)} className="text-slate-400 hover:text-red-500">
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-slate-50 dark:border-navy-raised flex items-center justify-center">
          <Pagination count={Math.ceil(studentsData.length / 10) || 1} color="primary" shape="rounded" />
        </div>
      </div>

      {/* Add Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="w-[450px] h-full flex flex-col bg-white dark:bg-navy-elevated">
          <div className="p-8 border-b border-slate-50 dark:border-navy-raised flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#1A2332] dark:text-white uppercase tracking-tight">Talaba qo'shish</h2>
              <p className="text-xs text-slate-400 font-medium">Yangi talaba ma'lumotlarini kiriting.</p>
            </div>
            <button onClick={() => setDrawerOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-navy-raised rounded-xl text-slate-400 hover:text-red-500 transition-colors">
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleCreateStudent} className="p-8 flex-1 overflow-y-auto space-y-5">
            <TextField fullWidth label="F.I.SH" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required />
            <TextField fullWidth label="Telefon" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
            <TextField fullWidth label="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            <TextField fullWidth label="Parol" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            <TextField fullWidth label="Tug'ilgan sana" type="date" slotProps={{ inputLabel: { shrink: true } }} value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} required />
            <TextField fullWidth label="Manzil" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profil surati</label>
              <div className="border-2 border-dashed border-slate-100 dark:border-navy-raised rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-navy-raised transition-colors cursor-pointer relative">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFormData({...formData, photo: e.target.files ? e.target.files[0] : null})} />
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-3">
                  <CloudUploadOutlinedIcon />
                </div>
                <p className="text-sm font-bold text-[#1A2332] dark:text-white">{formData.photo ? formData.photo.name : 'Rasm yuklash'}</p>
                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG (max 2MB)</p>
              </div>
            </div>
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
              <h2 className="text-xl font-black text-[#1A2332] dark:text-white uppercase tracking-tight">Talabani tahrirlash</h2>
              <p className="text-xs text-slate-400 font-medium">Talaba ma'lumotlarini yangilang.</p>
            </div>
            <button onClick={() => setEditDrawerOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-navy-raised rounded-xl text-slate-400 hover:text-red-500 transition-colors">
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleUpdateStudent} className="p-8 flex-1 overflow-y-auto space-y-5">
            <TextField fullWidth label="F.I.SH" value={editData.full_name} onChange={e => setEditData({...editData, full_name: e.target.value})} required />
            <TextField fullWidth label="Telefon" value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} required />
            <TextField fullWidth label="Email" type="email" value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} required />
            <TextField fullWidth label="Tug'ilgan sana" type="date" slotProps={{ inputLabel: { shrink: true } }} value={editData.birth_date} onChange={e => setEditData({...editData, birth_date: e.target.value})} />
            <TextField fullWidth label="Manzil" value={editData.address} onChange={e => setEditData({...editData, address: e.target.value})} required />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yangi rasm (ixtiyoriy)</label>
              <div className="border-2 border-dashed border-slate-100 dark:border-navy-raised rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-navy-raised transition-colors cursor-pointer relative">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setEditData({...editData, photo: e.target.files ? e.target.files[0] : null})} />
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-3">
                  <CloudUploadOutlinedIcon />
                </div>
                <p className="text-sm font-bold text-[#1A2332] dark:text-white">{editData.photo ? editData.photo.name : 'Rasm yuklash'}</p>
                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG (max 2MB)</p>
              </div>
            </div>
            <div className="pt-6 flex gap-3">
              <Button onClick={() => setEditDrawerOpen(false)} className="flex-1 py-3.5 text-slate-400 font-bold capitalize">Bekor qilish</Button>
              <Button type="submit" variant="contained" className="flex-1 py-3.5 bg-primary hover:bg-primary/90 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">Yangilash</Button>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
};

export default Students;
