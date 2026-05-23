import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArchiveIcon from '@mui/icons-material/Archive';
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import { useAuth } from '../AuthContext';

const RoomPage = () => {
  const [roomsData, setRoomsData] = useState<any[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  
  const [newRoom, setNewRoom] = useState({
    name: '',
    capacity: 20,
    status: 'active'
  });

  const [editData, setEditData] = useState({
    name: '',
    capacity: 20,
    status: 'active'
  });
  
  const { token } = useAuth();
  const [showArchive, setShowArchive] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await fetch(`/api/v1/rooms?status=${showArchive ? 'inactive' : 'active'}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      const data = await res.json();
      setRoomsData(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchRooms();
  }, [token, showArchive]);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/v1/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newRoom),
      });
      const result = await response.json();
      if (response.ok) {
        setDrawerOpen(false);
        setNewRoom({ name: '', capacity: 20, status: 'active' });
        await fetchRooms();
        alert("Xona muvaffaqiyatli qo'shildi!");
      } else {
        alert("Xatolik: " + (result.message || "Noma'lum xatolik"));
      }
    } catch (err) {
      console.error(err);
      alert("Server bilan bog'lanishda xatolik yuz berdi");
    }
  };

  const handleEditOpen = (room: any) => {
    setSelectedRoom(room);
    setEditData({
      name: room.name || '',
      capacity: room.capacity || 20,
      status: room.status || 'active'
    });
    setEditDrawerOpen(true);
  };

  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/v1/rooms/${selectedRoom.id}`, {
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
        await fetchRooms();
        alert("Xona ma'lumotlari yangilandi!");
      } else {
        alert("Xatolik: " + (result.message || "Noma'lum xatolik"));
      }
    } catch (err) {
      console.error(err);
      alert("Server bilan bog'lanishda xatolik yuz berdi");
    }
  };

  const handleDeleteRoom = (id: number) => {
    if (!confirm("Xonani o'chirishni tasdiqlaysizmi?")) return;
    fetch(`/api/v1/rooms/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(() => fetchRooms())
    .catch(err => console.error(err));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Xonalar</h2>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-navy-elevated border border-slate-200 dark:border-navy-raised rounded-xl p-1 shadow-sm">
             <button 
              onClick={() => setShowArchive(false)}
              className={`p-2 ${!showArchive ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'} rounded-lg transition-all flex items-center gap-2 text-sm font-medium`}
             >
                <FilterListIcon fontSize="small" /> Xonalar
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
            Xona qo'shish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {roomsData.length > 0 ? roomsData.map((room, index) => (
          <div key={index} className="bg-white dark:bg-navy-elevated rounded-2xl p-6 border border-slate-100 dark:border-navy-raised relative group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-slate-50 dark:bg-navy-raised rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                 <DoorFrontIcon />
              </div>
              <div className="flex opacity-0 group-hover:opacity-100 transition-all gap-1">
                <button onClick={() => handleDeleteRoom(room.id)} className="w-8 h-8 flex items-center justify-center bg-slate-50 dark:bg-navy-raised rounded-lg text-slate-400 hover:text-red-500 transition-colors"><DeleteOutlinedIcon fontSize="small" /></button>
                <button onClick={() => handleEditOpen(room)} className="w-8 h-8 flex items-center justify-center bg-slate-50 dark:bg-navy-raised rounded-lg text-slate-400 hover:text-blue-500 transition-colors"><EditOutlinedIcon fontSize="small" /></button>
              </div>
            </div>
            
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{room.name}</h3>
            <div className="flex items-center gap-2 mb-4">
               <span className={`w-2 h-2 rounded-full ${room.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
               <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{room.status}</span>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-navy-raised">
               <span className="text-xs text-slate-500 font-medium">Sig'imi:</span>
               <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{room.capacity} kishi</span>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
             <DoorFrontIcon sx={{ fontSize: 60, opacity: 0.2 }} />
             <p className="mt-4 font-medium">Xonalar topilmadi</p>
          </div>
        )}
      </div>

      {/* Add Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="w-[450px] h-full flex flex-col bg-white dark:bg-navy-elevated">
          <div className="p-8 border-b border-slate-50 dark:border-navy-raised flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#1A2332] dark:text-white uppercase tracking-tight">Xona qo'shish</h2>
              <p className="text-xs text-slate-400 font-medium">Yangi xona ma'lumotlarini kiriting.</p>
            </div>
            <button onClick={() => setDrawerOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-navy-raised rounded-xl text-slate-400 hover:text-red-500 transition-colors">
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleAddRoom} className="p-8 flex-1 overflow-y-auto space-y-5">
            <TextField fullWidth label="Xona nomi" value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} required />
            <TextField fullWidth label="Sig'imi" type="number" value={newRoom.capacity} onChange={e => setNewRoom({...newRoom, capacity: Number(e.target.value)})} required />
            
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
              <h2 className="text-xl font-black text-[#1A2332] dark:text-white uppercase tracking-tight">Xonani tahrirlash</h2>
              <p className="text-xs text-slate-400 font-medium">Xona ma'lumotlarini yangilang.</p>
            </div>
            <button onClick={() => setEditDrawerOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-navy-raised rounded-xl text-slate-400 hover:text-red-500 transition-colors">
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleUpdateRoom} className="p-8 flex-1 overflow-y-auto space-y-5">
            <TextField fullWidth label="Xona nomi" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} required />
            <TextField fullWidth label="Sig'imi" type="number" value={editData.capacity} onChange={e => setEditData({...editData, capacity: Number(e.target.value)})} required />
            
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

export default RoomPage;
