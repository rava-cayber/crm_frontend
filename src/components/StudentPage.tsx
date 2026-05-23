import { useState, useEffect } from 'react';

const StudentPage = ({ studentId }: { studentId?: string }) => {
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    if (studentId) {
      fetch(`/api/v1/students/${studentId}`)
        .then(res => res.json())
        .then(data => setStudent(data))
        .catch(err => console.error(err));
    }
  }, [studentId]);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Talaba profili</h2>
      {student ? (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <img src={student.photo || `https://i.pravatar.cc/150?img=5`} alt="Avatar" className="w-16 h-16 rounded-full" />
                <div>
                    <h3 className="font-bold text-lg">{student.full_name}</h3>
                    <p className="text-sm text-slate-500">{student.phone}</p>
                </div>
            </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Talaba tanlanmagan yoki ma'lumot yuklanmoqda...</p>
      )}
    </div>
  );
};

export default StudentPage;
