import { useState, useEffect } from 'react';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';

const GroupPage = ({ groupId }: { groupId?: string }) => {
  const [group, setGroup] = useState<any>(null);

  useEffect(() => {
    if (groupId) {
      fetch(`/api/v1/groups/${groupId}`)
        .then(res => res.json())
        .then(data => setGroup(data))
        .catch(err => console.error(err));
    }
  }, [groupId]);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Guruh haqida ma'lumot</h2>
      
      {group ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <PeopleOutlinedIcon fontSize="large" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-800">{group.name}</h3>
              <p className="text-sm font-medium text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded mt-1">
                {group.status || 'ACTIVE'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <p className="text-xs text-slate-500 mb-1">Dars kunlari</p>
              <p className="text-sm font-semibold text-slate-800">{(group.week_day || []).join(', ') || 'Noma\'lum'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Dars vaqti</p>
              <p className="text-sm font-semibold text-slate-800">{group.start_time || 'Noma\'lum'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Boshlanish sanasi</p>
              <p className="text-sm font-semibold text-slate-800">
                {group.start_date ? new Date(group.start_date).toLocaleDateString() : 'Noma\'lum'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Max talabalar</p>
              <p className="text-sm font-semibold text-slate-800">{group.max_student || 0} ta</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Guruh tanlanmagan yoki ma'lumot yuklanmoqda...</p>
      )}
    </div>
  );
};

export default GroupPage;
