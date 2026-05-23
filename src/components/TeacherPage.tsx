import { useState, useEffect } from 'react';

const TeacherPage = ({ teacherId }: { teacherId?: string }) => {
  const [teacher, setTeacher] = useState<any>(null);

  useEffect(() => {
    if (teacherId) {
      fetch(`/api/v1/teachers/${teacherId}`)
        .then(res => res.json())
        .then(data => setTeacher(data))
        .catch(err => console.error(err));
    }
  }, [teacherId]);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-4">O'qituvchi profili</h2>
      {teacher ? (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <img src={teacher.photo || `https://i.pravatar.cc/150?img=11`} alt="Avatar" className="w-16 h-16 rounded-full" />
                <div>
                    <h3 className="font-bold text-lg">{teacher.full_name}</h3>
                    <p className="text-sm text-slate-500">{teacher.phone}</p>
                </div>
            </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500">O'qituvchi tanlanmagan yoki ma'lumot yuklanmoqda...</p>
      )}
    </div>
  );
};

export default TeacherPage;
