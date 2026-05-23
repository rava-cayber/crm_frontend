import CoursePage from '../components/CoursePage';

const Courses = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Kurslar</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">O'quv markazidagi barcha kurslarni boshqarish.</p>
      </div>
      <CoursePage />
    </div>
  );
};

export default Courses;
