import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Branches = () => {
  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#1A2332] dark:text-white">Filiallar</h1>
          <p className="text-xs text-slate-400 font-medium">Ushbu sahifada siz filiallarni boshqarishingiz mumkin.</p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className="bg-primary hover:bg-primary/90 rounded-2xl px-6 py-3 font-bold capitalize shadow-lg shadow-primary/20"
        >
          Filial qo'shish
        </Button>
      </div>

      <div className="bg-white dark:bg-navy-elevated rounded-[32px] border border-slate-50 dark:border-navy-raised p-12 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-16 h-16 bg-slate-50 dark:bg-navy-raised rounded-2xl flex items-center justify-center text-slate-300 mb-4">
          <AddIcon sx={{ fontSize: 32 }} />
        </div>
        <p className="text-sm font-bold text-slate-400">Hozircha filiallar mavjud emas</p>
        <p className="text-xs text-slate-300 mt-1">Yangi filial qo'shish uchun tugmani bosing</p>
      </div>
    </div>
  );
};

export default Branches;
