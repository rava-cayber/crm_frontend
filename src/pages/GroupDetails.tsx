import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const role = user?.role;
  
  const [group, setGroup] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  
  const [studentLessonStatuses, setStudentLessonStatuses] = useState<Record<number, {
    status: 'Berilmagan' | 'Bajarilmagan' | 'Kutayotganlar' | 'Qabul qilingan' | 'Qaytarilgan';
    deadline: string;
    videoCount: number;
    homework: any;
    answer: any;
    result: any;
  }>>({});
  const [studentStatusFilter, setStudentStatusFilter] = useState('Barchasi');

  const [activeStudentLesson, setActiveStudentLesson] = useState<any>(null);
  const [expandedLessons, setExpandedLessons] = useState<Record<number, boolean>>({});
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [ratingModalLesson, setRatingModalLesson] = useState<any>(null);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [ratingComment, setRatingComment] = useState<string>('');
  const [showRatingSuccess, setShowRatingSuccess] = useState<boolean>(false);
  const [homeworkErrorAlert, setHomeworkErrorAlert] = useState<string | null>(null);
  const [studentAnswerText, setStudentAnswerText] = useState<string>('');
  const [studentAnswerAttachedFile, setStudentAnswerAttachedFile] = useState<File | null>(null);
  
  const [activeTab, setActiveTab] = useState('darsliklar'); // 'malumotlar', 'darsliklar', 'davomat'
  const [subTab, setSubTab] = useState('uyga_vazifa'); // 'uyga_vazifa', 'videolar', 'imtihonlar', 'jurnal'
  

  const [lessonTopic, setLessonTopic] = useState('');
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});
  const [selectedJournalDate, setSelectedJournalDate] = useState<Date>(new Date());
  const [hasExistingLesson, setHasExistingLesson] = useState(false);
  const [showAllDates, setShowAllDates] = useState(false);
  const [showHomeworkForm, setShowHomeworkForm] = useState(false);
  const [selectedLessonForHomework, setSelectedLessonForHomework] = useState<number | null>(null);
  const [viewingHomeworkDetails, setViewingHomeworkDetails] = useState(false);
  const [activeHomeworkView, setActiveHomeworkView] = useState<'list' | 'submissions' | 'review'>('list');
  const [homeworkFilter, setHomeworkFilter] = useState<'pending' | 'rejected' | 'approved' | 'not_submitted'>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [gradingSliderValue, setGradingSliderValue] = useState<number>(60);
  const [lessonHwStats, setLessonHwStats] = useState<Record<number, { pending: number, graded: number, total: number }>>({});
  
  // Homework Management State
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [lessonHomeworks, setLessonHomeworks] = useState<any[]>([]);
  const [homeworkAnswers, setHomeworkAnswers] = useState<any[]>([]);
  
  const [newHomeworkTitle, setNewHomeworkTitle] = useState('');
  const [newHomeworkFile, setNewHomeworkFile] = useState<File | null>(null);
  const [uploadingHomework, setUploadingHomework] = useState(false);

  const [studentAnswerTitle, setStudentAnswerTitle] = useState('');
  const [studentAnswerFile, setStudentAnswerFile] = useState<File | null>(null);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  const [gradingFeedback, setGradingFeedback] = useState('');
  const [savingGrade, setSavingGrade] = useState(false);

  // Video Management State
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [selectedLessonForVideo, setSelectedLessonForVideo] = useState<number | null>(null);
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [watchVideoUrl, setWatchVideoUrl] = useState<string | null>(null);

  // Statistics State
  const [showStatistics, setShowStatistics] = useState(false);
  const [groupStatistics, setGroupStatistics] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);

  // Exam State
  const [exams, setExams] = useState<any[]>([]);
  const [showExamForm, setShowExamForm] = useState(false);
  const [examTopic, setExamTopic] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [examDeadlineDate, setExamDeadlineDate] = useState('');
  const [examDeadlineTime, setExamDeadlineTime] = useState('');
  const [examLessonId, setExamLessonId] = useState<number | null>(null);
  const [editingExamId, setEditingExamId] = useState<number | null>(null);
  const [creatingExam, setCreatingExam] = useState(false);
  const [examMenuOpen, setExamMenuOpen] = useState<number | null>(null);

  const fetchHomeworkForLesson = async (lessonId: number) => {
    try {
      const res = await fetch(`/api/v1/homework/lesson/${lessonId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLessonHomeworks(data.data);
        if (data.data && data.data.length > 0) {
          fetchHomeworkAnswers(data.data[0].id, lessonId);
        }
      } else {
        setLessonHomeworks([]);
      }
    } catch (err) {
      console.error(err);
      setLessonHomeworks([]);
    }
  };

  const fetchGroupStatistics = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch(`/api/v1/homework/statistics/group/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setGroupStatistics(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchExams = async () => {
    try {
      const res = await fetch(`/api/v1/exam/group/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setExams(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatExamDateInput = (value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
  };

  const resetExamForm = () => {
    setShowExamForm(false);
    setEditingExamId(null);
    setExamTopic('');
    setExamDescription('');
    setExamDeadlineDate('');
    setExamDeadlineTime('');
    setExamLessonId(null);
  };

  const openCreateExamForm = () => {
    resetExamForm();
    setShowExamForm(true);
  };

  const openEditExamForm = (exam: any) => {
    setEditingExamId(exam.id);
    setExamTopic(exam.topic || '');
    setExamDescription(exam.description || '');
    setExamDeadlineDate(formatExamDateInput(exam.deadline_date));
    setExamDeadlineTime(exam.deadline_time || '');
    setExamLessonId(exam.lesson_id || null);
    setShowExamForm(true);
    setExamMenuOpen(null);
  };

  const handleSaveExam = async () => {
    if (!examTopic) return;
    setCreatingExam(true);
    try {
      const res = await fetch(editingExamId ? `/api/v1/exam/${editingExamId}` : '/api/v1/exam', {
        method: editingExamId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          group_id: Number(id),
          topic: examTopic,
          description: examDescription || undefined,
          lesson_id: examLessonId || undefined,
          deadline_date: examDeadlineDate || undefined,
          deadline_time: examDeadlineTime || undefined
        })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        alert(editingExamId ? "Imtihon yangilandi!" : "Imtihon yaratildi!");
        resetExamForm();
        fetchExams();
      } else {
        alert("Xatolik: " + result.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingExam(false);
    }
  };

  const handleDeleteExam = async (examId: number) => {
    if (!window.confirm("Imtihonni o'chirishni xohlaysizmi?")) return;
    try {
      const res = await fetch(`/api/v1/exam/${examId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (res.ok && result.success) {
        alert("Imtihon o'chirildi!");
        fetchExams();
      } else {
        alert("Xatolik: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("O'chirishda xatolik yuz berdi");
    }
    setExamMenuOpen(null);
  };

  const handleUpdateExamStatus = async (examId: number, status: 'faol' | 'tugagan') => {
    try {
      const res = await fetch(`/api/v1/exam/${examId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        fetchExams();
      } else {
        alert("Xatolik: " + result.message);
      }
    } catch (err) {
      console.error(err);
    }
    setExamMenuOpen(null);
  };

  const fetchHomeworkAnswers = async (homeworkId: number, lessonId?: number) => {
    try {
      const res = await fetch(`/api/v1/homework/answers/${homeworkId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setHomeworkAnswers(data.data);
        if (lessonId) {
          const answers = data.data;
          const pending = answers.filter((a: any) => !a.homeworkResults || a.homeworkResults.length === 0).length;
          const graded = answers.filter((a: any) => a.homeworkResults && a.homeworkResults.length > 0 && a.homeworkResults[0].grade >= 60).length;
          setLessonHwStats(prev => ({
            ...prev,
            [lessonId]: { pending, graded, total: answers.length }
          }));
        }
      } else {
        setHomeworkAnswers([]);
      }
    } catch (err) {
      console.error(err);
      setHomeworkAnswers([]);
    }
  };

  const handleCreateHomework = async () => {
    const lessonId = selectedLessonForHomework || selectedLesson?.id;
    if (!lessonId || !newHomeworkTitle || !newHomeworkFile) return;
    setUploadingHomework(true);
    try {
      const formData = new FormData();
      formData.append('lesson_id', lessonId.toString());
      formData.append('group_id', id || '');
      formData.append('title', newHomeworkTitle);
      formData.append('file', newHomeworkFile);

      const res = await fetch('/api/v1/homework', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const result = await res.json();
      if (res.ok && result.success) {
        alert("Uy vazifasi muvaffaqiyatli yuklandi!");
        setNewHomeworkTitle('');
        setNewHomeworkFile(null);
        if (selectedLesson) fetchHomeworkForLesson(selectedLesson.id);
      } else {
        alert("Xatolik: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Yuklashda xatolik yuz berdi");
    } finally {
      setUploadingHomework(false);
    }
  };

  const handleUploadVideo = async () => {
    if (!selectedLessonForVideo || !newVideoFile) return;
    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('file', newVideoFile);

      const res = await fetch(`/api/v1/lessons/video/${selectedLessonForVideo}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const result = await res.json();
      if (res.ok && result.success) {
        alert("Video muvaffaqiyatli yuklandi!");
        setNewVideoFile(null);
        setShowVideoForm(false);
        setSelectedLessonForVideo(null);
        fetchLessons();
      } else {
        alert("Xatolik: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Yuklashda xatolik yuz berdi");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleDeleteVideo = async (lessonId: number) => {
    if (!window.confirm("Videoni o'chirishni xohlaysizmi?")) return;
    try {
      const res = await fetch(`/api/v1/lessons/video/${lessonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await res.json();
      if (res.ok && result.success) {
        alert("Video o'chirildi!");
        fetchLessons();
      } else {
        alert("Xatolik: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("O'chirishda xatolik yuz berdi");
    }
  };

  const handleSubmitAnswer = async (homeworkId: number) => {
    if (!studentAnswerTitle || !studentAnswerFile) return;
    setSubmittingAnswer(true);
    try {
      const formData = new FormData();
      formData.append('homework_id', homeworkId.toString());
      formData.append('title', studentAnswerTitle);
      formData.append('file', studentAnswerFile);

      const res = await fetch('/api/v1/homework/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const result = await res.json();
      if (res.ok && result.success) {
        alert("Javobingiz muvaffaqiyatli topshirildi!");
        setStudentAnswerTitle('');
        setStudentAnswerFile(null);
        await fetchLessons();
        setViewingHomeworkDetails(false);
      } else {
        alert("Xatolik: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Topshirishda xatolik yuz berdi");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  useEffect(() => {
    if (selectedLesson) {
      fetchHomeworkForLesson(selectedLesson.id);
    }
  }, [selectedLesson]);

  useEffect(() => {
    if (lessons && lessons.length > 0) {
      if (!selectedLesson) {
        setSelectedLesson(lessons[0]);
      }
      // Load stats for all lessons in background
      lessons.forEach(async (lesson) => {
        try {
          const res = await fetch(`/api/v1/homework/lesson/${lesson.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success && data.data && data.data.length > 0) {
            const hwId = data.data[0].id;
            const resAns = await fetch(`/api/v1/homework/answers/${hwId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const dataAns = await resAns.json();
            if (dataAns.success) {
              const answers = dataAns.data;
              const pending = answers.filter((a: any) => !a.homeworkResults || a.homeworkResults.length === 0).length;
              const graded = answers.filter((a: any) => a.homeworkResults && a.homeworkResults.length > 0 && a.homeworkResults[0].grade >= 60).length;
              setLessonHwStats(prev => ({
                ...prev,
                [lesson.id]: { pending, graded, total: answers.length }
              }));
            }
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
  }, [lessons]);

  const checkAndLoadAttendance = async (date: Date) => {
    if (!lessons || !date || students.length === 0) return;
    const existingLesson = lessons.find(l => {
      const d = new Date(l.created_at);
      return d.getDate() === date.getDate() &&
             d.getMonth() === date.getMonth() &&
             d.getFullYear() === date.getFullYear();
    });

    if (existingLesson) {
      setHasExistingLesson(true);
      setLessonTopic(existingLesson.topic);
      try {
        const res = await fetch(`/api/v1/attendance/lesson/${existingLesson.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const map: Record<number, boolean> = {};
          students.forEach(s => map[s.id] = false);
          data.data.forEach((att: any) => {
            map[att.student_id] = att.isPresent;
          });
          setAttendance(map);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setHasExistingLesson(false);
      setLessonTopic('');
      const resetAttendance: Record<number, boolean> = {};
      students.forEach(s => resetAttendance[s.id] = false);
      setAttendance(resetAttendance);
    }
  };

  useEffect(() => {
    if (selectedJournalDate && lessons.length > 0 && students.length > 0) {
      checkAndLoadAttendance(selectedJournalDate);
    }
  }, [selectedJournalDate, lessons, students]);

  const fetchGroupDetails = async () => {
    try {
      const res = await fetch(`/api/v1/groups/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setGroup(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch(`/api/v1/groups/one/students/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
        const initialAttendance: Record<number, boolean> = {};
        data.data.forEach((s: any) => initialAttendance[s.id] = false); // Default is false (not swiped)
        setAttendance(initialAttendance);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadStudentHomeworkStatuses = async (loadedLessons: any[]) => {
    if (!token || !loadedLessons || loadedLessons.length === 0) return;
    const studentProfile = students.find(s => s.phone === (user as any)?.phone || s.email === user?.email);
    const sId = studentProfile?.id || user?.id;

    for (const lesson of loadedLessons) {
      try {
        const hwRes = await fetch(`/api/v1/homework/lesson/${lesson.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const hwData = await hwRes.json();
        
        let status: 'Berilmagan' | 'Bajarilmagan' | 'Kutayotganlar' | 'Qabul qilingan' | 'Qaytarilgan' = 'Berilmagan';
        let deadline = '-';
        let hwObj = null;
        let ansObj = null;
        let resObj = null;
        
        if (hwData.success && hwData.data && hwData.data.length > 0) {
          const homework = hwData.data[0];
          hwObj = homework;
          
          const deadlineTime = new Date(lesson.created_at).getTime() + 86400000;
          deadline = new Date(deadlineTime).toLocaleString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
          
          const ansRes = await fetch(`/api/v1/homework/answers/${homework.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const ansData = await ansRes.json();
          
          if (ansData.success && ansData.data) {
            const myAnswer = ansData.data.find((a: any) => a.student_id === sId);
            if (myAnswer) {
              ansObj = myAnswer;
              if (myAnswer.homeworkResults && myAnswer.homeworkResults.length > 0) {
                const result = myAnswer.homeworkResults[0];
                resObj = result;
                status = result.status === true || result.grade >= 60 ? 'Qabul qilingan' : 'Qaytarilgan';
              } else {
                status = 'Kutayotganlar';
              }
            } else {
              const now = new Date().getTime();
              if (now > deadlineTime) {
                status = 'Bajarilmagan';
              } else {
                status = 'Bajarilmagan';
              }
            }
          }
        }
        
        setStudentLessonStatuses(prev => ({
          ...prev,
          [lesson.id]: {
            status,
            deadline,
            videoCount: lesson.id % 2 === 0 ? 1 : 2,
            homework: hwObj,
            answer: ansObj,
            result: resObj
          }
        }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const fetchLessons = async () => {
    try {
      const res = await fetch(`/api/v1/lessons/group/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLessons(data.data);
        if (role === 'STUDENT' || user?.role === 'STUDENT') {
          loadStudentHomeworkStatuses(data.data);
          if (data.data.length > 0) {
            setActiveStudentLesson(data.data[0]);
            setExpandedLessons({ [data.data[0].id]: true });
            setActiveVideo(data.data[0].video || null);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token && id) {
      fetchGroupDetails();
      fetchStudents();
      fetchLessons();
      fetchExams();
    }
  }, [token, id]);

  useEffect(() => {
    if (token && id && lessons.length > 0 && students.length > 0 && role === 'STUDENT') {
      loadStudentHomeworkStatuses(lessons);
    }
  }, [students, token, id, role]);

  const handleSaveLesson = async () => {
    try {
      const res = await fetch('/api/v1/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          group_id: Number(id),
          topic: lessonTopic,
          description: ''
        })
      });
      const result = await res.json();
      if (res.ok) {
        const newLessonId = result.data?.id;
        
        // Send attendance ONLY for students who are marked as true (swiped right)
        if (newLessonId) {
          const attendedStudents = Object.entries(attendance)
            .filter(([_, isPresent]) => isPresent)
            .map(([studentId]) => Number(studentId));

          await Promise.all(attendedStudents.map(studentId => 
            fetch('/api/v1/attendance', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                lesson_id: newLessonId,
                student_id: studentId,
                isPresent: true
              })
            }).catch(e => console.error("Attendance error:", e))
          ));
        }

        alert("Dars muvaffaqiyatli saqlandi!");
        setLessonTopic('');
        // Reset attendance to false
        const resetAttendance: Record<number, boolean> = {};
        students.forEach(s => resetAttendance[s.id] = false);
        setAttendance(resetAttendance);
        
        fetchLessons();
      } else {
        alert("Xatolik: " + result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getGroupMonth = () => {
    if (!group?.start_date) return 1;
    const start = new Date(group.start_date);
    const now = new Date();
    if (now < start) return 1;
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 30) + 1;
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const courseName = group?.courses?.name || '';
  const isBootcamp = courseName.toLowerCase().includes('bootcamp');
  const courseType = isBootcamp ? 'BOOTCAMP' : 'STANDARD';
  const durationMonth = group?.courses?.duration_month || 0;
  const weekDays = group?.week_day || [];
  const lessonsPerMonth = weekDays.length * 4 || 12;
  const totalLessons = durationMonth * lessonsPerMonth;
  const averageAge = students.length > 0 ? Math.round(students.reduce((sum, s) => sum + calculateAge(s.birth_date), 0) / students.length) : 0;
  const tolovTuri = `T|${courseName}|oyma-oy|${new Date(group?.start_date || Date.now()).toLocaleDateString('uz-UZ')}`;
  const maxStudent = group?.max_student || 0;
  const currentStudents = students.length;

  if (role === 'STUDENT' || user?.role === 'STUDENT') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-navy-dark text-[#1A2332] dark:text-white p-6 relative">
        <Snackbar
          open={showRatingSuccess}
          autoHideDuration={4500}
          onClose={() => setShowRatingSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={() => setShowRatingSuccess(false)} severity="success" variant="filled" sx={{ width: '100%', fontWeight: 700 }}>
            Dars baholandi
          </Alert>
        </Snackbar>

        <Snackbar
          open={Boolean(homeworkErrorAlert)}
          autoHideDuration={4500}
          onClose={() => setHomeworkErrorAlert(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={() => setHomeworkErrorAlert(null)} severity="error" variant="filled" sx={{ width: '100%', fontWeight: 700 }}>
            {homeworkErrorAlert}
          </Alert>
        </Snackbar>

        {/* Alerts / Notifications */}
        {false && showRatingSuccess && (
          <div className="fixed top-4 right-4 z-50 bg-[#E8F5E9] dark:bg-green-500/20 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400 px-6 py-4 rounded-2xl flex items-center justify-between shadow-xl min-w-[320px] animate-slide-in">
            <div className="flex items-center gap-3">
              <span className="text-xl">✓</span>
              <span className="text-sm font-black">Dars baholandi</span>
            </div>
            <button onClick={() => setShowRatingSuccess(false)} className="text-green-700 dark:text-green-400 font-bold text-xs ml-4">✕</button>
          </div>
        )}

        {false && homeworkErrorAlert && (
          <div className="fixed top-4 right-4 z-50 bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl flex items-center justify-between shadow-xl min-w-[320px] animate-slide-in">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠</span>
              <span className="text-sm font-black">{homeworkErrorAlert}</span>
            </div>
            <button onClick={() => setHomeworkErrorAlert(null)} className="text-red-600 dark:text-red-400 font-bold text-xs ml-4">✕</button>
          </div>
        )}

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel: Active Lesson Content & Video Player */}
          <div className="lg:col-span-8 space-y-6">
            {activeStudentLesson ? (
              <div className="space-y-6">
                {/* Video Player or Thumbnail */}
                <div className="bg-black rounded-[32px] overflow-hidden aspect-video relative shadow-lg border border-slate-100 dark:border-navy-raised flex items-center justify-center group">
                  <video 
                    src={activeVideo ? `/files/files/${activeVideo}` : ''}
                    controls
                    className="w-full h-full object-cover"
                    poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200"
                  />
                  {!activeVideo && (
                    <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center text-center p-8 space-y-4">
                      <div className="w-16 h-16 bg-[#FF7E54] hover:bg-[#FF7E54]/90 rounded-full flex items-center justify-center text-white text-2xl font-bold cursor-pointer shadow-lg transition-transform transform hover:scale-105">
                        ▶
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white">{activeStudentLesson.topic}</h3>
                        <p className="text-xs text-slate-400 font-bold mt-1">Dars videosini ko'rish uchun o'ng tarafdan videoni tanlang</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rating trigger */}
                <div className="flex justify-between items-center bg-white dark:bg-navy-elevated p-6 rounded-[24px] border border-slate-100 dark:border-navy-raised shadow-sm">
                  <div>
                    <h2 className="text-lg font-black text-[#1A2332] dark:text-white">{activeStudentLesson.topic}</h2>
                    <p className="text-xs text-slate-400 font-bold mt-0.5">Dars sanasi: {new Date(activeStudentLesson.created_at).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setRatingModalLesson(activeStudentLesson);
                      setRatingValue(0);
                      setRatingComment('');
                    }}
                    className="px-5 py-3 bg-[#EFEBE9] hover:bg-[#D7CCC8] text-[#5D4037] text-xs font-black uppercase tracking-wider rounded-xl transition-colors"
                  >
                    Darsni baholash
                  </button>
                </div>

                {/* Tabs Block */}
                <div className="bg-white dark:bg-navy-elevated p-8 rounded-[32px] border border-slate-100 dark:border-navy-raised shadow-sm space-y-6">
                  <div className="border-b border-slate-100 dark:border-navy-raised pb-4 flex gap-6">
                    <button className="text-sm font-black text-primary border-b-2 border-primary pb-4">
                      Vazifalar
                    </button>
                  </div>

                  {(() => {
                    const statusObj = studentLessonStatuses[activeStudentLesson.id] || { status: 'Berilmagan', deadline: '-', homework: null, answer: null };
                    const hw = statusObj.homework;
                    const ans = statusObj.answer;

                    if (statusObj.status === 'Berilmagan') {
                      return (
                        <div className="py-12 text-center text-xs font-black text-slate-400 uppercase tracking-wider">
                          Uyga vazifa berilmagan
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-6">
                        {/* Red muddati banner */}
                        <div className="bg-[#FFEBEE] dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-6 py-4 rounded-2xl flex justify-between items-center">
                          <span className="text-xs font-black text-red-600 uppercase tracking-wide">
                            🚨 Uyga vazifa muddati: {statusObj.deadline}
                          </span>
                          <span className="text-xs font-bold text-red-500">
                            Fayllar soni: {hw?.file ? 1 : 0}
                          </span>
                        </div>

                        {/* Homework description */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Topshiriq matni</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 font-bold bg-slate-50 dark:bg-navy-raised/30 p-5 rounded-2xl leading-relaxed">
                            {hw?.title}
                          </p>
                        </div>

                        {/* Submit answer module */}
                        <div className="border-t border-slate-100 dark:border-navy-raised pt-6 space-y-4">
                          <div className="relative">
                            <textarea
                              rows={3}
                              value={studentAnswerText}
                              onChange={(e) => setStudentAnswerText(e.target.value)}
                              placeholder="Fayl biriktiring va izoh qoldiring"
                              maxLength={1000}
                              className="w-full pl-6 pr-24 py-4 bg-slate-50 dark:bg-navy-raised/30 border border-slate-100 dark:border-navy-raised text-xs font-bold text-[#1A2332] dark:text-white rounded-[24px] focus:outline-none focus:border-primary/40 transition-colors placeholder:text-slate-400"
                            />
                            
                            <div className="absolute right-6 bottom-4 flex items-center gap-3">
                              <span className="text-[10px] font-bold text-slate-400">{studentAnswerText.length} / 1000</span>
                              
                              <label className="cursor-pointer text-slate-400 hover:text-primary transition-colors">
                                <input 
                                  type="file" 
                                  accept="video/*"
                                  className="hidden" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    setStudentAnswerAttachedFile(file);
                                    if (file) {
                                      alert(`Video biriktirildi: ${file.name}`);
                                    }
                                  }}
                                />
                                📎
                              </label>

                              <button
                                onClick={async () => {
                                  if (!hw || !hw.id) {
                                    setHomeworkErrorAlert("homeworkId must be an integer number");
                                    return;
                                  }
                                  if (!studentAnswerText.trim()) {
                                    alert("Iltimos, javob izohini kiriting!");
                                    return;
                                  }
                                  try {
                                    const formData = new FormData();
                                    formData.append('homework_id', hw.id.toString());
                                    formData.append('title', studentAnswerText);
                                    if (studentAnswerAttachedFile) {
                                      formData.append('file', studentAnswerAttachedFile);
                                    }

                                    const res = await fetch('/api/v1/homework/submit', {
                                      method: 'POST',
                                      headers: {
                                        'Authorization': `Bearer ${token}`
                                      },
                                      body: formData
                                    });
                                    const result = await res.json();
                                    if (result.success) {
                                      setShowRatingSuccess(true); // Re-use rating alert style or dynamic alert
                                      setStudentAnswerText('');
                                      setStudentAnswerAttachedFile(null);
                                      await fetchLessons();
                                    } else {
                                      setHomeworkErrorAlert(result.message || "Xatolik yuz berdi");
                                    }
                                  } catch (e) {
                                    console.error(e);
                                    setHomeworkErrorAlert("Topshirishda tarmoq xatosi yuz berdi");
                                  }
                                }}
                                className="w-8 h-8 bg-[#FF7E54] hover:bg-[#FF7E54]/90 text-white rounded-full flex items-center justify-center text-sm shadow-md transition-all active:scale-95"
                              >
                                ➤
                              </button>
                            </div>
                          </div>
                          
                          {studentAnswerAttachedFile && (
                            <p className="text-[10px] font-black text-primary uppercase tracking-wider">
                              Biriktirilgan fayl: 📁 {studentAnswerAttachedFile.name}
                            </p>
                          )}

                          {ans && (
                            <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 rounded-2xl space-y-1">
                              <h5 className="text-[10px] font-black text-green-700 dark:text-green-400 uppercase tracking-wider">Topshirilgan javobingiz:</h5>
                              <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">{ans.title}</p>
                              {ans.file && <p className="text-[10px] text-slate-400 font-bold mt-1">Yuborilgan fayl: {ans.file}</p>}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-navy-elevated p-12 rounded-[32px] border border-slate-100 dark:border-navy-raised shadow-sm text-center flex flex-col items-center justify-center space-y-4">
                <span className="text-6xl">📚</span>
                <div>
                  <h3 className="text-lg font-black text-[#1A2332] dark:text-white uppercase tracking-wider">Darsni tanlang</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1">O'ng tarafdagi ro'yxatdan darsni tanlab, videolarni va uyga vazifalarni ko'rishingiz mumkin.</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Lessons List Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-navy-elevated p-6 rounded-[32px] border border-slate-100 dark:border-navy-raised shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-navy-raised pb-4">
                <h3 className="text-sm font-black text-[#1A2332] dark:text-white uppercase tracking-wider">Darslar ro'yxati</h3>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-500 dark:bg-navy-raised dark:text-slate-400 text-[10px] font-black rounded-md">
                  {lessons.length} ta dars
                </span>
              </div>

              {/* Status Filter */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Uy vazifa statusi</label>
                <select 
                  value={studentStatusFilter}
                  onChange={(e) => setStudentStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-slate-50 dark:bg-navy-raised/50 border border-slate-100 dark:border-navy-raised text-xs font-bold text-[#1A2332] dark:text-white rounded-xl focus:outline-none"
                >
                  <option value="Barchasi">Barchasi</option>
                  <option value="Qabul qilingan">Qabul qilingan</option>
                  <option value="Berilmagan">Berilmagan</option>
                  <option value="Qaytarilgan">Qaytarilgan</option>
                  <option value="Bajarilmagan">Bajarilmagan</option>
                  <option value="Kutayotganlar">Kutayotganlar</option>
                </select>
              </div>

              {/* Lessons Stack */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {lessons
                  .filter(lesson => {
                    if (studentStatusFilter === 'Barchasi') return true;
                    return studentLessonStatuses[lesson.id]?.status === studentStatusFilter;
                  })
                  .map((lesson) => {
                    const isSelected = activeStudentLesson?.id === lesson.id;
                    const isExpanded = expandedLessons[lesson.id];
                    const statusObj = studentLessonStatuses[lesson.id] || { status: 'Berilmagan', deadline: '-', videoCount: 0 };
                    
                    let badgeColor = 'bg-slate-100 text-slate-500 dark:bg-navy-raised dark:text-slate-400';
                    if (statusObj.status === 'Bajarilmagan') badgeColor = 'bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400';
                    if (statusObj.status === 'Kutayotganlar') badgeColor = 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400';
                    if (statusObj.status === 'Qabul qilingan') badgeColor = 'bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400';
                    if (statusObj.status === 'Qaytarilgan') badgeColor = 'bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400';

                    return (
                      <div 
                        key={lesson.id}
                        className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isSelected ? 'border-[#FF7E54] bg-[#FFF8F6] dark:bg-navy-raised/20 shadow-sm' : 'border-slate-100 dark:border-navy-raised hover:border-slate-200 dark:hover:border-navy-raised/80 bg-white dark:bg-navy-elevated'}`}
                      >
                        <div 
                          onClick={() => {
                            setActiveStudentLesson(lesson);
                            setExpandedLessons(prev => ({ ...prev, [lesson.id]: !prev[lesson.id] }));
                            setActiveVideo(lesson.video || null);
                          }}
                          className="p-5 flex justify-between items-center cursor-pointer gap-4"
                        >
                          <div className="space-y-1">
                            <h4 className="text-xs font-black text-[#1A2332] dark:text-white leading-tight">{lesson.topic}</h4>
                            <p className="text-[10px] text-slate-400 font-bold">Dars sanasi: {new Date(lesson.created_at).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <span className="text-xs text-slate-400 font-bold transition-transform duration-200">
                            {isExpanded ? '▲' : '▼'}
                          </span>
                        </div>

                        {isExpanded && (
                          <div className="bg-slate-50/50 dark:bg-navy-raised/10 px-5 pb-4 border-t border-slate-100/50 dark:border-navy-raised/30 pt-3 space-y-2">
                            {lesson.video && (
                              <div 
                                onClick={() => setActiveVideo(lesson.video)}
                                className="flex items-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-raised/30"
                              >
                                <span>🎬</span>
                                <span>Video: {lesson.video}</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center pt-2 border-t border-slate-100/30">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Vazifa holati</span>
                              <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md ${badgeColor}`}>
                                {statusObj.status}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                {lessons.length === 0 && (
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider text-center py-6">Hozircha darslar yuklanmagan</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rating Modal */}
        {ratingModalLesson && (
          <div className="fixed inset-0 z-50 bg-[#1A2332]/60 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-navy-elevated p-8 rounded-[32px] max-w-md w-full shadow-2xl space-y-6 border border-slate-100 dark:border-navy-raised transform transition-all duration-300 scale-100">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-[#1A2332] dark:text-white leading-tight">Darsni baholang: {ratingModalLesson.topic}</h3>
                <p className="text-xs text-slate-400 font-bold">Fikringiz biz uchun muhim!</p>
              </div>

              {/* Star Rating Selector */}
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star}
                    onClick={() => setRatingValue(star)}
                    className={`text-4xl cursor-pointer transition-colors duration-150 ${star <= ratingValue ? 'text-amber-500' : 'text-slate-200 dark:text-navy-raised'}`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Textarea */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fikr-mulohaza (ixtiyoriy)</label>
                <textarea
                  rows={4}
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Izoh qoldiring"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-navy-raised/50 border border-slate-100 dark:border-navy-raised text-xs font-bold text-[#1A2332] dark:text-white rounded-2xl focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setRatingModalLesson(null)}
                  className="flex-1 py-4 border border-slate-100 dark:border-navy-raised text-[#1A2332] dark:text-white text-xs font-black uppercase tracking-wider rounded-2xl hover:bg-slate-50 dark:hover:bg-navy-raised transition-colors"
                >
                  Bekor qilish
                </button>
                <button 
                  disabled={ratingValue === 0}
                  onClick={() => {
                    setShowRatingSuccess(true);
                    setRatingModalLesson(null);
                    setTimeout(() => setShowRatingSuccess(false), 5000);
                  }}
                  className="flex-1 py-4 bg-[#A1887F] hover:bg-[#8D6E63] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-brown-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Baholash
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto">
      {/* Watch Video Modal */}
      {watchVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-navy-elevated w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl animate-slide-in relative">
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-navy-raised/50 border-b border-slate-100 dark:border-navy-raised">
              <h3 className="text-sm font-black text-[#1A2332] dark:text-white">Video ko'rish</h3>
              <IconButton onClick={() => setWatchVideoUrl(null)} className="text-slate-400 hover:text-red-500">
                <CloseIcon />
              </IconButton>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              <video 
                src={`/files/files/${watchVideoUrl}`}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-navy-raised pb-6">
        <IconButton onClick={() => navigate('/guruhlar')} className="text-slate-400 hover:text-primary transition-colors">
          <ArrowBackIcon />
        </IconButton>
        <h1 className="text-2xl font-black text-[#1A2332] dark:text-white">{group?.name}</h1>
        <span className="px-3 py-1 bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400 text-xs font-black uppercase tracking-wider rounded-md">Aktiv</span>
        <div className="ml-auto">
          <Button 
            variant={showStatistics ? "contained" : "outlined"} 
            onClick={() => {
              if (!showStatistics) {
                fetchGroupStatistics();
              }
              setShowStatistics(!showStatistics);
            }}
            className={showStatistics ? "bg-primary rounded-xl font-bold" : "border-slate-200 text-slate-500 font-bold rounded-xl dark:border-navy-raised dark:text-slate-400"}
          >
            Statistika
          </Button>
        </div>
      </div>

      {showStatistics ? (
        <div className="space-y-6">
          <div className="flex gap-6 border-b border-slate-200 dark:border-navy-raised">
            <button className="px-2 py-4 text-sm font-black border-b-2 border-[#10B981] text-[#10B981]">Bajarilishi bo'yicha</button>
            <button className="px-2 py-4 text-sm font-black text-slate-400">Tekshirilishi bo'yicha</button>
          </div>

          <div className="flex items-end gap-4 bg-white dark:bg-navy-elevated p-6 rounded-2xl border border-slate-100 dark:border-navy-raised">
            <div className="space-y-2 flex-1">
              <label className="text-xs font-bold text-slate-500">Saralash</label>
              <select className="w-full bg-[#E8F5E9] text-[#10B981] font-black p-3 rounded-xl border-none outline-none appearance-none">
                <option>Qabul qilinganlar bo'yicha</option>
              </select>
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-xs font-bold text-slate-500">O'quv oyi bo'yicha</label>
              <select className="w-full bg-[#E8F5E9] text-[#10B981] font-black p-3 rounded-xl border-none outline-none appearance-none">
                <option>7-oy (01.05 - 05.06)</option>
              </select>
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-xs font-bold text-slate-500">Davr oralig'i bo'yicha</label>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-navy-dark p-3 rounded-xl border border-slate-200 dark:border-navy-raised">
                <input type="text" placeholder="Sana" className="bg-transparent w-full outline-none text-sm font-bold text-slate-500" />
                <span className="text-slate-400">→</span>
                <input type="text" placeholder="Sana" className="bg-transparent w-full outline-none text-sm font-bold text-slate-500" />
              </div>
            </div>
            <button className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-3 rounded-xl font-bold transition-colors h-[46px]">Qidiruv</button>
            <button className="border border-slate-200 dark:border-navy-raised text-slate-500 dark:text-slate-300 px-6 py-3 rounded-xl font-bold transition-colors hover:bg-slate-50 dark:hover:bg-navy-raised/50 h-[46px]">Tozalash</button>
          </div>

          <div className="bg-white dark:bg-navy-elevated rounded-2xl border border-slate-100 dark:border-navy-raised overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-navy-raised bg-white dark:bg-navy-elevated">
                <tr>
                  <th className="px-4 py-4">#</th>
                  <th className="px-4 py-4 border-l border-slate-100 dark:border-navy-raised">F.I.Sh</th>
                  <th className="px-4 py-4 border-l border-slate-100 dark:border-navy-raised">O'rtacha bahosi</th>
                  <th className="px-4 py-4 border-l border-slate-100 dark:border-navy-raised">Qabul qilinganlar</th>
                  <th className="px-4 py-4 border-l border-slate-100 dark:border-navy-raised">Qaytarilganlar</th>
                  <th className="px-4 py-4 border-l border-slate-100 dark:border-navy-raised">Bajarilmagan</th>
                  <th className="px-4 py-4 border-l border-slate-100 dark:border-navy-raised">Kutayotganlar</th>
                </tr>
              </thead>
              <tbody>
                {statsLoading ? (
                  <tr><td colSpan={7} className="text-center py-12 text-slate-400 font-bold">Yuklanmoqda...</td></tr>
                ) : groupStatistics.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-slate-400 font-bold">Ma'lumot topilmadi</td></tr>
                ) : groupStatistics.map((stat, idx) => {
                  const qabulPercentage = stat.total_homeworks ? Math.round((stat.qabul_qilinganlar / stat.total_homeworks) * 100) : 0;
                  const qaytarilganPercentage = stat.total_homeworks ? Math.round((stat.qaytarilganlar / stat.total_homeworks) * 100) : 0;
                  const bajarilmaganPercentage = stat.total_homeworks ? Math.round((stat.bajarilmagan / stat.total_homeworks) * 100) : 0;
                  const kutayotganPercentage = stat.total_homeworks ? Math.round((stat.kutayotganlar / stat.total_homeworks) * 100) : 0;
                  
                  const isHigh = stat.ortacha_baho >= 80;
                  
                  return (
                    <tr key={stat.student_id} className={`border-b border-slate-50 dark:border-navy-raised/50 ${isHigh ? 'bg-[#98F59B] dark:bg-green-900/40 text-[#1A2332] dark:text-white' : 'bg-white dark:bg-navy-elevated text-[#1A2332] dark:text-slate-200'}`}>
                      <td className="px-4 py-4 font-bold">{idx + 1}</td>
                      <td className={`px-4 py-4 font-bold border-l ${isHigh ? 'border-[#8AE68D] dark:border-green-800' : 'border-slate-100 dark:border-navy-raised'} text-[#2185D0] dark:text-blue-400`}>{stat.full_name}</td>
                      <td className={`px-4 py-4 font-bold border-l ${isHigh ? 'border-[#8AE68D] dark:border-green-800' : 'border-slate-100 dark:border-navy-raised'}`}>{stat.ortacha_baho}</td>
                      <td className={`px-4 py-4 font-medium border-l ${isHigh ? 'border-[#8AE68D] dark:border-green-800' : 'border-slate-100 dark:border-navy-raised'}`}>{stat.qabul_qilinganlar}({qabulPercentage}%)</td>
                      <td className={`px-4 py-4 font-medium border-l ${isHigh ? 'border-[#8AE68D] dark:border-green-800' : 'border-slate-100 dark:border-navy-raised'}`}>{stat.qaytarilganlar}({qaytarilganPercentage}%)</td>
                      <td className={`px-4 py-4 font-medium border-l ${isHigh ? 'border-[#8AE68D] dark:border-green-800' : 'border-slate-100 dark:border-navy-raised'}`}>{stat.bajarilmagan}({bajarilmaganPercentage}%)</td>
                      <td className={`px-4 py-4 font-medium border-l ${isHigh ? 'border-[#8AE68D] dark:border-green-800' : 'border-slate-100 dark:border-navy-raised'}`}>{stat.kutayotganlar}({kutayotganPercentage}%)</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          <div className="flex border-b border-slate-200 dark:border-navy-raised">
        {[
          { id: 'malumotlar', label: "Ma'lumotlar" },
          { id: 'darsliklar', label: "Guruh darsliklari" },
          { id: 'davomat', label: "Akademik davomati" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-black transition-all ${activeTab === tab.id ? 'border-b-2 border-primary text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'darsliklar' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-navy-elevated p-1 rounded-xl w-fit mb-6">
            {[
              { id: 'uyga_vazifa', label: "Uyga vazifa" },
              { id: 'videolar', label: "Videolar" },
              { id: 'imtihonlar', label: "Imtihonlar" },
              { id: 'jurnal', label: "Jurnal" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${subTab === tab.id ? 'bg-white dark:bg-navy-raised shadow-sm text-[#1A2332] dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>



          {role === 'STUDENT' && subTab === 'uyga_vazifa' && !viewingHomeworkDetails && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col gap-1.5 w-72">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uy vazifa statusi</label>
                <select 
                  value={studentStatusFilter}
                  onChange={(e) => setStudentStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-white dark:bg-navy-elevated border border-slate-100 dark:border-navy-raised text-xs font-bold text-[#1A2332] dark:text-white rounded-xl focus:outline-none shadow-sm"
                >
                  <option value="Barchasi">Barchasi</option>
                  <option value="Qabul qilingan">Qabul qilingan</option>
                  <option value="Berilmagan">Berilmagan</option>
                  <option value="Qaytarilgan">Qaytarilgan</option>
                  <option value="Bajarilmagan">Bajarilmagan</option>
                  <option value="Kutayotganlar">Kutayotganlar</option>
                </select>
              </div>

              <div className="bg-white dark:bg-navy-elevated rounded-[32px] border border-slate-100 dark:border-navy-raised overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 dark:bg-navy-raised/30">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mavzular</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Video</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Uyga vazifa Holati</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Uyga vazifa tugash vaqti</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dars sanasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-navy-raised/50">
                    {lessons
                      .filter(lesson => {
                        if (studentStatusFilter === 'Barchasi') return true;
                        return studentLessonStatuses[lesson.id]?.status === studentStatusFilter;
                      })
                      .map((lesson) => {
                        const statusObj = studentLessonStatuses[lesson.id] || { status: 'Berilmagan', deadline: '-', videoCount: 0 };
                        
                        let badgeBg = 'bg-slate-100 text-slate-500 dark:bg-navy-raised dark:text-slate-400';
                        if (statusObj.status === 'Bajarilmagan') badgeBg = 'bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400';
                        if (statusObj.status === 'Kutayotganlar') badgeBg = 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400';
                        if (statusObj.status === 'Qabul qilingan') badgeBg = 'bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400';
                        if (statusObj.status === 'Qaytarilgan') badgeBg = 'bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400';

                        return (
                          <tr 
                            key={lesson.id}
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setViewingHomeworkDetails(true);
                            }}
                            className="hover:bg-slate-50/50 dark:hover:bg-navy-raised/30 transition-colors cursor-pointer"
                          >
                            <td className="px-8 py-6 text-xs font-black text-[#1A2332] dark:text-white">{lesson.topic}</td>
                            <td className="px-8 py-6 text-center">
                              <span className="w-6 h-6 inline-flex items-center justify-center border border-blue-200 dark:border-navy-raised text-blue-500 rounded-full text-[10px] font-bold">
                                {statusObj.videoCount}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md ${badgeBg}`}>
                                {statusObj.status}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-xs font-bold text-slate-500">{statusObj.deadline}</td>
                            <td className="px-8 py-6 text-xs font-bold text-slate-500">
                              {new Date(lesson.created_at).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                          </tr>
                        );
                      })}
                    {lessons.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-8 py-12 text-center text-xs font-black text-slate-400 uppercase tracking-wider">
                          Darslar ro'yxati bo'sh
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {role === 'STUDENT' && subTab === 'uyga_vazifa' && viewingHomeworkDetails && selectedLesson && (
            <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
              <div className="flex items-center gap-3">
                <IconButton onClick={() => setViewingHomeworkDetails(false)} className="text-slate-400 hover:text-primary transition-colors">
                  <ArrowBackIcon />
                </IconButton>
                <h3 className="text-xl font-black text-[#1A2332] dark:text-white uppercase tracking-tight">
                  Ortga qaytish
                </h3>
              </div>

              {(() => {
                const statusObj = studentLessonStatuses[selectedLesson.id] || { status: 'Berilmagan', deadline: '-', homework: null, answer: null, result: null };
                const hw = statusObj.homework;
                const ans = statusObj.answer;
                const res = statusObj.result;

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Homework Description */}
                    <div className="bg-white dark:bg-navy-elevated p-8 rounded-[32px] border border-slate-100 dark:border-navy-raised shadow-sm space-y-6">
                      <div className="border-b border-slate-100 dark:border-navy-raised pb-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Mavzu nomi</h4>
                        <p className="text-lg font-black text-[#1A2332] dark:text-white">{selectedLesson.topic}</p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Vazifa matni</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-navy-raised/50 p-4 rounded-2xl">
                          {hw?.title || "Ustoz tomonidan vazifa matni kiritilmagan."}
                        </p>
                      </div>

                      {hw?.file && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Biriktirilgan fayl</h4>
                          <a 
                            href={`/src/uploads/files/${hw.file}`}
                            download
                            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-navy-raised/50 border border-slate-100 dark:border-navy-raised rounded-2xl cursor-pointer hover:border-primary/50 transition-colors"
                          >
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{hw.file}</span>
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Yuklab olish</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Right: Submission Area */}
                    <div className="bg-white dark:bg-navy-elevated p-8 rounded-[32px] border border-slate-100 dark:border-navy-raised shadow-sm space-y-6">
                      <h4 className="text-sm font-black text-[#1A2332] dark:text-white uppercase tracking-tight">Mening javobim</h4>

                      {/* Not Assigned */}
                      {statusObj.status === 'Berilmagan' && (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                          <span className="text-4xl">📝</span>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Ushbu darsga vazifa yuklanmagan</p>
                        </div>
                      )}

                      {/* Needs Submission / Resubmission */}
                      {(statusObj.status === 'Bajarilmagan' || statusObj.status === 'Qaytarilgan') && (
                        <div className="space-y-4">
                          {statusObj.status === 'Qaytarilgan' && (
                            <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl space-y-1">
                              <h5 className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">Vazifa qaytarilgan:</h5>
                              <p className="text-xs text-amber-600 dark:text-amber-300 font-medium">Baholangan: {res?.grade} ball. Izoh: {res?.title}</p>
                            </div>
                          )}

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Javob izohi</label>
                            <textarea
                              rows={4}
                              value={studentAnswerTitle}
                              onChange={(e) => setStudentAnswerTitle(e.target.value)}
                              placeholder="Vazifa bo'yicha izohingizni yozing..."
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-navy-raised/50 border border-slate-100 dark:border-navy-raised text-xs font-medium text-[#1A2332] dark:text-white rounded-2xl focus:outline-none focus:border-primary/50 transition-colors"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fayl biriktirish</label>
                            <input 
                              type="file"
                              accept="video/*"
                              onChange={(e) => setStudentAnswerFile(e.target.files?.[0] || null)}
                              className="text-xs text-slate-400 font-bold file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                          </div>

                          <Button
                            variant="contained"
                            disabled={submittingAnswer || !hw}
                            onClick={() => handleSubmitAnswer(hw.id)}
                            className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black uppercase tracking-wider rounded-2xl py-4 shadow-lg shadow-green-500/20 transition-all text-xs animate-pulse"
                          >
                            {submittingAnswer ? "Topshirilmoqda..." : "Javobni topshirish"}
                          </Button>
                        </div>
                      )}

                      {/* Pending Review */}
                      {statusObj.status === 'Kutayotganlar' && (
                        <div className="space-y-6">
                          <div className="p-5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl flex items-center gap-3">
                            <span className="text-2xl">⏳</span>
                            <div>
                              <h5 className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider">Tekshirilishi kutilmoqda</h5>
                              <p className="text-[10px] text-blue-500 font-bold">Javobingiz topshirilgan, tez orada ustozingiz tomonidan tekshiriladi.</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sizning izohingiz:</h5>
                              <p className="text-xs text-slate-600 dark:text-slate-300 font-bold bg-slate-50 dark:bg-navy-raised/50 p-4 rounded-xl mt-1">{ans?.title}</p>
                            </div>
                            {ans?.file && (
                              <div>
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yuborilgan fayl:</h5>
                                <p className="text-xs font-bold text-slate-500 mt-1">📁 {ans.file}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Accepted */}
                      {statusObj.status === 'Qabul qilingan' && (
                        <div className="space-y-6">
                          <div className="p-5 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 rounded-2xl flex items-center gap-3">
                            <span className="text-2xl">🎉</span>
                            <div>
                              <h5 className="text-xs font-black text-green-700 dark:text-green-400 uppercase tracking-wider">Qabul qilingan</h5>
                              <p className="text-[10px] text-green-500 font-bold">Javob muvaffaqiyatli qabul qilindi!</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-navy-raised/50 p-5 rounded-2xl text-center space-y-1">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baholangan ball</h5>
                              <p className="text-3xl font-black text-green-600">{res?.grade} / 100</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-navy-raised/50 p-5 rounded-2xl text-center flex flex-col justify-center">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Natija</h5>
                              <p className="text-sm font-black text-[#1A2332] dark:text-white uppercase mt-1">O'tdi</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ustoz izohi:</h5>
                              <p className="text-xs text-slate-600 dark:text-slate-300 font-bold bg-slate-50 dark:bg-navy-raised/50 p-4 rounded-xl mt-1">{res?.title || "Izoh qoldirilmagan."}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {role !== 'STUDENT' && subTab === 'uyga_vazifa' && !showHomeworkForm && !viewingHomeworkDetails && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  variant="contained"
                  onClick={() => setShowHomeworkForm(true)}
                  sx={{ backgroundColor: '#10B981', '&:hover': { backgroundColor: '#059669' }, borderRadius: '12px', textTransform: 'none', fontWeight: 800, px: 3 }}
                >
                  Uyga vazifa qo'shish
                </Button>
              </div>

              <div className="bg-white dark:bg-navy-elevated rounded-2xl border border-slate-100 dark:border-navy-raised overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 dark:bg-navy-raised/50 border-b border-slate-100 dark:border-navy-raised">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-slate-400 w-12">#</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400">Mavzu</th>
                      <th className="px-4 py-4 text-xs font-black text-slate-400 w-16 text-center" title="O'quvchilar soni">
                        👤
                      </th>
                      <th className="px-4 py-4 text-xs font-black text-slate-400 w-16 text-center" title="Tekshirilishi kutilayotgan vazifalar">
                        ⏰
                      </th>
                      <th className="px-4 py-4 text-xs font-black text-slate-400 w-16 text-center" title="Qabul qilinganlar">
                        ✅
                      </th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400">Berilgan vaqt</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400">Tugash vaqti</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-400">Dars sanasi</th>
                      <th className="px-4 py-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-navy-raised">
                    {lessons.map((lesson, i) => {
                      const stats = lessonHwStats[lesson.id] || { pending: 0, graded: 0, total: 0 };
                      const hasPending = stats.pending > 0;
                      return (
                        <tr
                          key={lesson.id}
                          onClick={() => {
                            setSelectedLesson(lesson);
                            setViewingHomeworkDetails(true);
                            setActiveHomeworkView('submissions');
                          }}
                          className={`transition-colors cursor-pointer ${
                            hasPending
                              ? 'bg-[#FF7E54]/10 dark:bg-[#FF7E54]/5 hover:bg-[#FF7E54]/15 dark:hover:bg-[#FF7E54]/10'
                              : 'hover:bg-slate-50/50 dark:hover:bg-navy-raised/30'
                          } ${selectedLesson?.id === lesson.id ? 'border-l-4 border-[#FF7E54]' : ''}`}
                        >
                          <td className="px-6 py-4 text-sm font-bold text-slate-500">{i + 1}</td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-black px-3 py-1.5 rounded-lg inline-block ${hasPending ? 'bg-[#FF7E54] text-white' : 'bg-slate-100 dark:bg-navy-raised text-[#1A2332] dark:text-white'}`}>
                              {lesson.topic}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm font-bold text-slate-500 text-center">{students.length}</td>
                          <td className="px-4 py-4 text-sm font-bold text-[#F97316] text-center">
                            {stats.pending}
                          </td>
                          <td className="px-4 py-4 text-sm font-bold text-[#10B981] text-center">
                            {stats.graded}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                {new Date(lesson.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                              <span className="text-xs font-bold text-slate-400">
                                {new Date(lesson.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                {new Date(new Date(lesson.created_at).getTime() + 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                              <span className="text-xs font-bold text-slate-400">
                                {new Date(new Date(lesson.created_at).getTime() + 86400000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                            {new Date(lesson.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-4 py-4 text-right text-slate-400">⋮</td>
                        </tr>
                      );
                    })}
                    {lessons.length === 0 && (
                      <tr><td colSpan={9} className="px-6 py-8 text-center text-sm font-bold text-slate-400">Hozircha darslar mavjud emas</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {subTab === 'uyga_vazifa' && viewingHomeworkDetails && selectedLesson && activeHomeworkView === 'submissions' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <IconButton onClick={() => setViewingHomeworkDetails(false)} className="text-slate-400">
                  <ArrowBackIcon />
                </IconButton>
                <h3 className="text-xl font-black text-[#1A2332] dark:text-white">
                  {selectedLesson.topic}
                </h3>
              </div>

              <div className="bg-white dark:bg-navy-elevated rounded-2xl border border-slate-100 dark:border-navy-raised p-6 shadow-sm">
                <div className="grid grid-cols-2 gap-8 mb-6 pb-6 border-b border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-1">Mavzu</p>
                    <p className="text-sm font-black text-[#1A2332] dark:text-white">{selectedLesson.topic}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-1">Tugash vaqti</p>
                    <p className="text-sm font-black text-[#1A2332] dark:text-white">
                      {new Date(new Date(selectedLesson.created_at).getTime() + 86400000).toLocaleString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Submissions Tabs Filters */}
                {(() => {
                  const pending = homeworkAnswers.filter(a => !a.homeworkResults || a.homeworkResults.length === 0);
                  const approved = homeworkAnswers.filter(a => a.homeworkResults && a.homeworkResults.length > 0 && a.homeworkResults[0].grade >= 60);
                  const rejected = homeworkAnswers.filter(a => a.homeworkResults && a.homeworkResults.length > 0 && a.homeworkResults[0].grade < 60);
                  const notSubmitted = students.filter(s => !homeworkAnswers.some(a => a.student_id === s.id));

                  const counts = {
                    pending: pending.length,
                    approved: approved.length,
                    rejected: rejected.length,
                    not_submitted: notSubmitted.length
                  };

                  const getFilteredList = () => {
                    if (homeworkFilter === 'pending') return pending;
                    if (homeworkFilter === 'approved') return approved;
                    if (homeworkFilter === 'rejected') return rejected;
                    return notSubmitted.map(s => ({ id: null, students: s, created_at: null }));
                  };

                  const filteredList = getFilteredList();

                  return (
                    <div className="space-y-6">
                      <div className="flex gap-4 border-b border-slate-100 pb-3">
                        {[
                          { id: 'pending', label: 'Kutayotganlar', color: 'bg-yellow-500' },
                          { id: 'rejected', label: 'Qaytarilganlar', color: 'bg-red-500' },
                          { id: 'approved', label: 'Qabul qilinganlar', color: 'bg-green-500' },
                          { id: 'not_submitted', label: 'Bajarilmagan', color: 'bg-slate-500' }
                        ].map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => setHomeworkFilter(tab.id as any)}
                            className={`flex items-center gap-2 pb-2 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                              homeworkFilter === tab.id
                                ? 'border-[#10B981] text-[#10B981]'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            {tab.label}
                            <span className={`${tab.color} text-white text-[10px] font-black rounded-full px-2 py-0.5 ml-1`}>
                              {counts[tab.id as keyof typeof counts]}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Submissions Table list */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400">
                              <th className="py-3 text-xs font-black uppercase">O'quvchi ismi</th>
                              <th className="py-3 text-xs font-black uppercase">Uyga vazifa jo'natilgan vaqt</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredList.map((item: any, i) => {
                              const s = item.students;
                              return (
                                <tr
                                  key={i}
                                  onClick={() => {
                                    if (item.id) {
                                      setSelectedSubmission(item);
                                      setGradingSliderValue(item.homeworkResults?.[0]?.grade || 60);
                                      setGradingFeedback(item.homeworkResults?.[0]?.title || '');
                                      setActiveHomeworkView('review');
                                    }
                                  }}
                                  className={`hover:bg-slate-50 dark:hover:bg-navy-raised/20 transition-all ${item.id ? 'cursor-pointer' : ''}`}
                                >
                                  <td className="py-4 font-black text-sm text-[#1A2332] dark:text-white flex items-center gap-2">
                                    <Avatar src={s.photo} sx={{ width: 28, height: 28 }} />
                                    {s.first_name} {s.last_name}
                                  </td>
                                  <td className="py-4 text-sm font-bold text-slate-500">
                                    {item.created_at
                                      ? new Date(item.created_at).toLocaleString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                      : 'Jo\'natilmagan'}
                                  </td>
                                </tr>
                              );
                            })}
                            {filteredList.length === 0 && (
                              <tr>
                                <td colSpan={2} className="py-8 text-center text-sm font-bold text-slate-400">
                                  Hozircha hech kim mavjud emas
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {subTab === 'uyga_vazifa' && viewingHomeworkDetails && selectedLesson && activeHomeworkView === 'review' && selectedSubmission && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className="cursor-pointer hover:underline" onClick={() => setActiveHomeworkView('submissions')}>
                  {homeworkFilter === 'pending'
                    ? 'Kutayotganlar'
                    : homeworkFilter === 'approved'
                    ? 'Qabul qilinganlar'
                    : 'Qaytarilganlar'}
                </span>
                <span>&gt;</span>
                <span className="text-[#1A2332] dark:text-white font-black">Uy vazifa</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 max-w-3xl">
                {/* Task Details Card */}
                <div className="bg-white dark:bg-navy-elevated rounded-2xl border border-slate-100 dark:border-navy-raised p-6 shadow-sm space-y-4">
                  <h4 className="text-sm font-black text-[#1A2332] dark:text-white uppercase tracking-wider">Uy vazifasi</h4>
                  <div className="p-4 bg-slate-50 dark:bg-navy-raised rounded-xl">
                    <p className="text-xs font-bold text-slate-400 mb-1">Izoh:</p>
                    <p className="text-sm font-black text-[#1A2332] dark:text-white">
                      {lessonHomeworks[0]?.title || 'Homework tekshirish qismini qilish backend'}
                    </p>
                  </div>
                </div>

                {/* Submission Details Card */}
                <div className="bg-white dark:bg-navy-elevated rounded-2xl border border-slate-100 dark:border-navy-raised p-6 shadow-sm space-y-6">
                  <h4 className="text-sm font-black text-[#1A2332] dark:text-white uppercase tracking-wider">
                    {selectedSubmission.students.first_name} {selectedSubmission.students.last_name}
                  </h4>

                  <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-6">
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-1">Vaqti:</p>
                      <p className="text-sm font-black text-[#1A2332] dark:text-white">
                        {new Date(selectedSubmission.created_at).toLocaleString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-1">Fayllar soni:</p>
                      <p className="text-sm font-black text-[#1A2332] dark:text-white">
                        {selectedSubmission.file ? 1 : 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-1">Status:</p>
                      {(() => {
                        const hasRes = selectedSubmission.homeworkResults && selectedSubmission.homeworkResults.length > 0;
                        const gradeVal = hasRes ? selectedSubmission.homeworkResults[0].grade : null;
                        const isApp = gradeVal !== null && gradeVal >= 60;
                        return (
                          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md ${
                            gradeVal === null
                              ? 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                              : isApp
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-250'
                              : 'bg-red-50 text-red-500 border border-red-150'
                          }`}>
                            {gradeVal === null ? 'Kutayotgan' : isApp ? 'Qabul qilingan' : 'Qaytarilgan'}
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50/30 border border-blue-100 rounded-xl space-y-1">
                    <p className="text-xs font-bold text-slate-400">Uyga vazifa izohi:</p>
                    <p className="text-sm font-black text-blue-500 break-all">
                      {selectedSubmission.title.includes('http') ? (
                        <a href={selectedSubmission.title} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {selectedSubmission.title}
                        </a>
                      ) : (
                        selectedSubmission.title
                      )}
                    </p>
                    {selectedSubmission.file && (
                      <div className="mt-2 pt-2 border-t border-blue-50">
                        <a
                          href={`/files/files/${selectedSubmission.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-primary hover:bg-primary-dark text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg inline-block shadow-sm transition-all"
                        >
                          📎 Yuklab olish
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Banner notification */}
                  <div className="p-4 bg-blue-50 text-blue-700 text-xs font-black rounded-xl border border-blue-150 flex items-start gap-2.5">
                    <span className="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black mt-0.5">i</span>
                    <p>
                      60-100 oralig'ida ball qo'yilgan vazifa 'Qabul qilingan', 0-59 oralig'ida ball qo'yilgan vazifa 'Qaytarilgan' hisoblanadi.
                    </p>
                  </div>

                  {/* Grade inputs */}
                  <div className="space-y-6 pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black text-[#1A2332] dark:text-white">Ball</span>
                        <span className="bg-[#10B981] text-white font-black text-sm px-2.5 py-1 rounded-lg">
                          {gradingSliderValue}
                        </span>
                      </div>
                      <div className="relative pt-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={gradingSliderValue}
                          onChange={e => setGradingSliderValue(Number(e.target.value))}
                          className="w-full accent-[#10B981] h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                          <span>0</span>
                          <span>20</span>
                          <span>40</span>
                          <span className="text-[#10B981]">60 (O'tish bali)</span>
                          <span>80</span>
                          <span>100</span>
                        </div>
                      </div>
                    </div>

                    {/* Feedback files zone mock */}
                    <div className="space-y-2">
                      <span className="text-sm font-black text-[#1A2332] dark:text-white">Fayllar</span>
                      <div className="border-2 border-dashed border-slate-200 dark:border-navy-raised rounded-xl p-8 text-center hover:border-[#10B981] transition-colors cursor-pointer bg-slate-50/50">
                        <div className="flex flex-col items-center gap-2">
                          <svg className="w-10 h-10 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-xs font-black text-slate-500">
                            Faylni yuklash uchun ushbu hudud ustiga bosing yoki faylni shu yerga olib keling
                          </p>
                          <p className="text-[10px] font-bold text-slate-400">
                            .jpg, .png, .pdf, .mp4, .docs formatlaridan birida bo'lishi mumkin
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Feedback textarea comment */}
                    <div className="space-y-2">
                      <span className="text-sm font-black text-[#1A2332] dark:text-white">Izohingiz</span>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Ushbu topshiriq bo'yicha fikringiz..."
                        value={gradingFeedback}
                        onChange={e => setGradingFeedback(e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setActiveHomeworkView('submissions');
                          setSelectedSubmission(null);
                        }}
                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 800, px: 4 }}
                      >
                        Bekor qilish
                      </Button>
                      <Button
                        variant="contained"
                        onClick={async () => {
                          if (selectedSubmission === null) return;
                          setSavingGrade(true);
                          try {
                            const res = await fetch('/api/v1/homework/grade', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify({
                                homework_answer_id: selectedSubmission.id,
                                grade: Number(gradingSliderValue),
                                title: gradingFeedback || (gradingSliderValue >= 60 ? 'Qabul qilindi' : 'Qaytarildi'),
                                status: gradingSliderValue >= 60
                              })
                            });
                            const result = await res.json();
                            if (res.ok && result.success) {
                              alert("Baholash muvaffaqiyatli saqlandi!");
                              setGradingFeedback('');
                              if (lessonHomeworks.length > 0) {
                                await fetchHomeworkAnswers(lessonHomeworks[0].id, selectedLesson.id);
                              }
                              setActiveHomeworkView('submissions');
                              setSelectedSubmission(null);
                            } else {
                              alert("Xatolik: " + result.message);
                            }
                          } catch (err) {
                            console.error(err);
                            alert("Baholashda xatolik yuz berdi");
                          } finally {
                            setSavingGrade(false);
                          }
                        }}
                        disabled={savingGrade}
                        sx={{ backgroundColor: '#10B981', '&:hover': { backgroundColor: '#059669' }, borderRadius: '12px', textTransform: 'none', fontWeight: 800, px: 4 }}
                      >
                        {savingGrade ? 'Saqlanmoqda...' : 'Baholash'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {subTab === 'uyga_vazifa' && showHomeworkForm && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <IconButton onClick={() => setShowHomeworkForm(false)} className="text-slate-400"><ArrowBackIcon /></IconButton>
                <h3 className="text-xl font-black text-[#1A2332] dark:text-white">Yangi uyga vazifa yaratish</h3>
              </div>

              <div className="bg-white dark:bg-navy-elevated rounded-2xl border border-slate-100 dark:border-navy-raised p-8 shadow-sm max-w-2xl">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-black text-[#1A2332] dark:text-white mb-2 block">
                      <span className="text-red-500">* </span>Mavzu
                    </label>
                    <select
                      value={selectedLessonForHomework || ''}
                      onChange={e => setSelectedLessonForHomework(Number(e.target.value))}
                      className="w-full border border-slate-200 dark:border-navy-raised rounded-xl px-4 py-3 text-sm font-bold bg-white dark:bg-navy-elevated text-[#1A2332] dark:text-white focus:outline-none focus:border-[#10B981] transition-colors"
                    >
                      <option value="">Mavzulardan birini tanlang</option>
                      {lessons.map(l => (
                        <option key={l.id} value={l.id}>{l.topic}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-black text-[#1A2332] dark:text-white mb-2 block">
                      <span className="text-red-500">* </span>Izoh
                    </label>
                    <textarea
                      value={newHomeworkTitle}
                      onChange={e => setNewHomeworkTitle(e.target.value)}
                      placeholder="Uy vazifasi haqida batafsil izoh yozing..."
                      rows={5}
                      className="w-full border border-slate-200 dark:border-navy-raised rounded-xl px-4 py-3 text-sm font-bold bg-white dark:bg-navy-elevated text-[#1A2332] dark:text-white focus:outline-none focus:border-[#10B981] transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <div className="border-2 border-dashed border-slate-200 dark:border-navy-raised rounded-xl p-6 text-center hover:border-[#10B981] transition-colors cursor-pointer"
                      onClick={() => document.getElementById('hw-file-input')?.click()}>
                      <input type="file" accept="video/*" id="hw-file-input" className="hidden" onChange={e => setNewHomeworkFile(e.target.files ? e.target.files[0] : null)} />
                      <p className="text-sm font-bold text-slate-400">
                        {newHomeworkFile ? (
                          <span className="text-[#10B981]">🎥 {newHomeworkFile.name}</span>
                        ) : (
                          <>↓ Yuklash</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pt-4">
                    <Button
                      variant="outlined"
                      onClick={() => { setShowHomeworkForm(false); setNewHomeworkTitle(''); setNewHomeworkFile(null); setSelectedLessonForHomework(null); }}
                      sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 800, px: 4, color: '#64748b', borderColor: '#e2e8f0' }}
                    >
                      Bekor qilish
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (selectedLessonForHomework) {
                          const lesson = lessons.find((l: any) => l.id === selectedLessonForHomework);
                          if (lesson) setSelectedLesson(lesson);
                          handleCreateHomework();
                          setShowHomeworkForm(false);
                          setSelectedLessonForHomework(null);
                        }
                      }}
                      disabled={!selectedLessonForHomework || !newHomeworkTitle || !newHomeworkFile || uploadingHomework}
                      sx={{ backgroundColor: '#F97316', '&:hover': { backgroundColor: '#EA580C' }, borderRadius: '12px', textTransform: 'none', fontWeight: 800, px: 4 }}
                    >
                      {uploadingHomework ? "Yuklanmoqda..." : "E'lon qilish"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {subTab === 'videolar' && !showVideoForm && (
            <div className="bg-white dark:bg-navy-elevated rounded-2xl border border-slate-100 dark:border-navy-raised shadow-sm">
              <div className="p-6 border-b border-slate-100 dark:border-navy-raised flex justify-end">
                <Button
                  variant="contained"
                  onClick={() => setShowVideoForm(true)}
                  sx={{ backgroundColor: '#10B981', '&:hover': { backgroundColor: '#059669' }, borderRadius: '8px', textTransform: 'none', fontWeight: 800, px: 3 }}
                >
                  Qo'shish
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#1A2332] dark:text-white">
                  <thead className="bg-slate-50 dark:bg-navy-raised/50 text-xs text-slate-500 font-bold border-b border-slate-100 dark:border-navy-raised">
                    <tr>
                      <th className="px-6 py-4 font-black">Video nomi</th>
                      <th className="px-6 py-4 font-black">Dars nomi</th>
                      <th className="px-6 py-4 font-black">Status</th>
                      <th className="px-6 py-4 font-black">Dars sanasi</th>
                      <th className="px-6 py-4 font-black">Hajmi</th>
                      <th className="px-6 py-4 font-black">Qo'shilgan vaqti</th>
                      <th className="px-6 py-4 font-black">Harakatlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lessons.filter(l => l.video).length > 0 ? lessons.filter(l => l.video).map((lesson) => (
                      <tr key={lesson.id} className="border-b border-slate-50 dark:border-navy-raised/50 hover:bg-slate-50/50 dark:hover:bg-navy-raised/20 transition-colors">
                        <td className="px-6 py-4 font-bold flex items-center gap-2">
                          <span className="text-[#10B981]">🎥</span> {lesson.video}
                        </td>
                        <td className="px-6 py-4 font-bold">{lesson.topic}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-50 text-green-600 dark:bg-green-500/20 dark:text-green-400 text-xs font-black rounded-md border border-green-100 dark:border-green-500/30">Tayyor</span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-500">{new Date(lesson.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td className="px-6 py-4 font-medium text-slate-500">{((lesson.id * 123) % 800 + 150).toFixed(2)} MB</td>
                        <td className="px-6 py-4 font-medium text-slate-500">{new Date(lesson.update_at || lesson.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-4 items-center">
                            <button onClick={() => setWatchVideoUrl(lesson.video)} className="text-[#2185D0] hover:text-blue-700 text-lg transition-transform hover:scale-110" title="Ko'rish">
                              👁
                            </button>
                            <button onClick={() => { setSelectedLessonForVideo(lesson.id); setShowVideoForm(true); }} className="text-[#F97316] hover:text-[#EA580C] text-lg transition-transform hover:scale-110" title="Tahrirlash">
                              ✏️
                            </button>
                            <button onClick={() => handleDeleteVideo(lesson.id)} className="text-red-500 hover:text-red-700 text-lg transition-transform hover:scale-110" title="O'chirish">
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-sm font-bold text-slate-400">
                          Videolar ro'yxati bo'sh
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {subTab === 'videolar' && showVideoForm && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <IconButton onClick={() => setShowVideoForm(false)} className="text-slate-400"><ArrowBackIcon /></IconButton>
                <h3 className="text-xl font-black text-[#1A2332] dark:text-white">Yangi video qo'shish</h3>
              </div>

              <div className="bg-white dark:bg-navy-elevated rounded-2xl border border-slate-100 dark:border-navy-raised p-8 shadow-sm max-w-2xl">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-black text-[#1A2332] dark:text-white mb-2 block">
                      <span className="text-red-500">* </span>Darsni tanlang
                    </label>
                    <select
                      value={selectedLessonForVideo || ''}
                      onChange={e => setSelectedLessonForVideo(Number(e.target.value))}
                      className="w-full border border-slate-200 dark:border-navy-raised rounded-xl px-4 py-3 text-sm font-bold bg-white dark:bg-navy-elevated text-[#1A2332] dark:text-white focus:outline-none focus:border-[#10B981] transition-colors"
                    >
                      <option value="">Darslardan birini tanlang</option>
                      {lessons.map(l => (
                        <option key={l.id} value={l.id}>{l.topic}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="border-2 border-dashed border-slate-200 dark:border-navy-raised rounded-xl p-6 text-center hover:border-[#10B981] transition-colors cursor-pointer"
                      onClick={() => document.getElementById('video-file-input')?.click()}>
                      <input type="file" accept="video/*" id="video-file-input" className="hidden" onChange={e => setNewVideoFile(e.target.files ? e.target.files[0] : null)} />
                      <p className="text-sm font-bold text-slate-400">
                        {newVideoFile ? (
                          <span className="text-[#10B981]">🎥 {newVideoFile.name}</span>
                        ) : (
                          <>↓ Video yuklash</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pt-4">
                    <Button
                      variant="outlined"
                      onClick={() => { setShowVideoForm(false); setNewVideoFile(null); setSelectedLessonForVideo(null); }}
                      sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 800, px: 4, color: '#64748b', borderColor: '#e2e8f0' }}
                    >
                      Bekor qilish
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleUploadVideo();
                      }}
                      disabled={!selectedLessonForVideo || !newVideoFile || uploadingVideo}
                      sx={{ backgroundColor: '#10B981', '&:hover': { backgroundColor: '#059669' }, borderRadius: '12px', textTransform: 'none', fontWeight: 800, px: 4 }}
                    >
                      {uploadingVideo ? "Yuklanmoqda..." : "Saqlash"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {subTab === 'imtihonlar' && (
            <div className="space-y-6">
              {!showExamForm && role !== 'STUDENT' && (
                <div className="flex justify-end">
                  <Button
                    variant="contained"
                    onClick={openCreateExamForm}
                    sx={{ backgroundColor: '#10B981', '&:hover': { backgroundColor: '#059669' }, borderRadius: '8px', textTransform: 'none', fontWeight: 800, px: 3 }}
                  >
                    Imtihon qo'shish
                  </Button>
                </div>
              )}

              {showExamForm && role !== 'STUDENT' && (
                <div className="bg-white dark:bg-navy-elevated rounded-2xl border border-slate-100 dark:border-navy-raised p-8 shadow-sm max-w-3xl">
                  <div className="flex items-center gap-3 mb-6">
                    <IconButton onClick={resetExamForm} className="text-slate-400"><ArrowBackIcon /></IconButton>
                    <h3 className="text-xl font-black text-[#1A2332] dark:text-white">
                      {editingExamId ? "Imtihonni redakt qilish" : "Yangi imtihon yaratish"}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="text-sm font-black text-[#1A2332] dark:text-white mb-2 block">
                        <span className="text-red-500">* </span>Imtihon mavzusi
                      </label>
                      <TextField
                        fullWidth
                        value={examTopic}
                        onChange={e => setExamTopic(e.target.value)}
                        placeholder="Masalan: Yakuniy imtihon"
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-black text-[#1A2332] dark:text-white mb-2 block">Darsga bog'lash</label>
                      <select
                        value={examLessonId || ''}
                        onChange={e => setExamLessonId(e.target.value ? Number(e.target.value) : null)}
                        className="w-full border border-slate-200 dark:border-navy-raised rounded-xl px-4 py-2.5 text-sm font-bold bg-white dark:bg-navy-elevated text-[#1A2332] dark:text-white focus:outline-none focus:border-[#10B981] transition-colors"
                      >
                        <option value="">Dars tanlanmagan</option>
                        {lessons.map(l => (
                          <option key={l.id} value={l.id}>{l.topic}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-black text-[#1A2332] dark:text-white mb-2 block">Imtihon joyi</label>
                      <div className="w-full border border-slate-200 dark:border-navy-raised rounded-xl px-4 py-2.5 text-sm font-bold bg-slate-50 dark:bg-navy-raised/40 text-slate-600 dark:text-slate-300">
                        {group?.rooms?.name || "Xona biriktirilmagan"}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-black text-[#1A2332] dark:text-white mb-2 block">Tugash sanasi</label>
                      <TextField
                        fullWidth
                        type="date"
                        value={examDeadlineDate}
                        onChange={e => setExamDeadlineDate(e.target.value)}
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-black text-[#1A2332] dark:text-white mb-2 block">Tugash vaqti</label>
                      <TextField
                        fullWidth
                        type="time"
                        value={examDeadlineTime}
                        onChange={e => setExamDeadlineTime(e.target.value)}
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-black text-[#1A2332] dark:text-white mb-2 block">Izoh</label>
                      <textarea
                        value={examDescription}
                        onChange={e => setExamDescription(e.target.value)}
                        placeholder="Imtihon bo'yicha qo'shimcha ma'lumot..."
                        rows={4}
                        className="w-full border border-slate-200 dark:border-navy-raised rounded-xl px-4 py-3 text-sm font-bold bg-white dark:bg-navy-elevated text-[#1A2332] dark:text-white focus:outline-none focus:border-[#10B981] transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6">
                    <Button
                      variant="outlined"
                      onClick={resetExamForm}
                      sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 800, px: 4, color: '#64748b', borderColor: '#e2e8f0' }}
                    >
                      Bekor qilish
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSaveExam}
                      disabled={!examTopic || creatingExam}
                      sx={{ backgroundColor: '#10B981', '&:hover': { backgroundColor: '#059669' }, borderRadius: '12px', textTransform: 'none', fontWeight: 800, px: 4 }}
                    >
                      {creatingExam ? "Saqlanmoqda..." : editingExamId ? "Saqlash" : "E'lon qilish"}
                    </Button>
                  </div>
                </div>
              )}

              {!showExamForm && (
                <div className="bg-white dark:bg-navy-elevated rounded-2xl border border-slate-100 dark:border-navy-raised shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-navy-raised flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-[#1A2332] dark:text-white">Imtihonlar</h3>
                      <p className="text-xs font-bold text-slate-400 mt-1">{group?.name} guruhi uchun imtihonlar ro'yxati</p>
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{exams.length} ta</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#1A2332] dark:text-white">
                      <thead className="bg-slate-50 dark:bg-navy-raised/50 text-xs text-slate-500 font-bold border-b border-slate-100 dark:border-navy-raised">
                        <tr>
                          <th className="px-6 py-4 font-black">#</th>
                          <th className="px-6 py-4 font-black">Mavzu</th>
                          <th className="px-6 py-4 font-black">Dars</th>
                          <th className="px-6 py-4 font-black">Muddat</th>
                          <th className="px-6 py-4 font-black">Joy</th>
                          <th className="px-6 py-4 font-black">O'quvchilar</th>
                          <th className="px-6 py-4 font-black">Status</th>
                          <th className="px-6 py-4 font-black">E'lon qilingan</th>
                          {role !== 'STUDENT' && <th className="px-6 py-4 font-black text-right">Harakatlar</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {exams.length > 0 ? exams.map((exam) => {
                          const isActive = exam.status === 'faol';
                          const deadline = exam.deadline_date
                            ? `${new Date(exam.deadline_date).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' })}${exam.deadline_time ? ` ${exam.deadline_time}` : ''}`
                            : '-';
                          const announcedAt = exam.announced_at || exam.created_at;

                          return (
                            <tr key={exam.id} className="border-b border-slate-50 dark:border-navy-raised/50 hover:bg-slate-50/50 dark:hover:bg-navy-raised/20 transition-colors">
                              <td className="px-6 py-4 font-bold text-slate-500">{exam.order || exam.id}</td>
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-black text-[#1A2332] dark:text-white">{exam.topic}</p>
                                  {exam.description && <p className="text-xs font-bold text-slate-400 mt-1 max-w-xs truncate">{exam.description}</p>}
                                </div>
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-500">{exam.lesson_topic || exam.lessons?.topic || "Examination"}</td>
                              <td className="px-6 py-4 font-bold text-slate-500 whitespace-nowrap">{deadline}</td>
                              <td className="px-6 py-4 font-bold text-slate-500">{exam.room_name || group?.rooms?.name || '-'}</td>
                              <td className="px-6 py-4 font-bold text-slate-500">{exam.student_count || students.length}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md ${isActive ? 'bg-green-50 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-navy-raised dark:text-slate-400'}`}>
                                  {isActive ? 'Faol' : 'Tugagan'}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-500 whitespace-nowrap">
                                {announcedAt ? new Date(announcedAt).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                              </td>
                              {role !== 'STUDENT' && (
                                <td className="px-6 py-4 text-right relative">
                                  <button
                                    onClick={() => setExamMenuOpen(examMenuOpen === exam.id ? null : exam.id)}
                                    className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-navy-raised text-slate-400 hover:text-[#2185D0] font-black"
                                    title="Menyu"
                                  >
                                    ...
                                  </button>
                                  {examMenuOpen === exam.id && (
                                    <div className="absolute right-6 top-12 z-20 w-40 bg-white dark:bg-navy-elevated border border-slate-100 dark:border-navy-raised rounded-xl shadow-lg overflow-hidden text-left">
                                      <button
                                        onClick={() => openEditExamForm(exam)}
                                        className="w-full px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-raised text-left"
                                      >
                                        Redakt qilish
                                      </button>
                                      <button
                                        onClick={() => handleUpdateExamStatus(exam.id, isActive ? 'tugagan' : 'faol')}
                                        className="w-full px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-raised text-left"
                                      >
                                        {isActive ? "Tugatish" : "Faollashtirish"}
                                      </button>
                                      <button
                                        onClick={() => handleDeleteExam(exam.id)}
                                        className="w-full px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 text-left"
                                      >
                                        O'chirish
                                      </button>
                                    </div>
                                  )}
                                </td>
                              )}
                            </tr>
                          );
                        }) : (
                          <tr>
                            <td colSpan={role !== 'STUDENT' ? 9 : 8} className="px-6 py-12 text-center text-sm font-bold text-slate-400">
                              Imtihonlar ro'yxati bo'sh
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'malumotlar' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Guruh mentorlari */}
            <div className="bg-white dark:bg-navy-elevated rounded-xl border border-slate-200 dark:border-navy-raised overflow-hidden">
              <div className="bg-[#2185D0] text-white px-4 py-3 flex justify-between items-center">
                <span className="font-bold">Guruh mentorlari</span>
                <CloseIcon fontSize="small" className="cursor-pointer" />
              </div>
              <div className="p-6 border-b border-slate-100 dark:border-navy-raised">
                <div className="flex items-center justify-around gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border border-slate-200 flex items-center justify-center mb-2 overflow-hidden bg-slate-50">
                      <Avatar src={group?.teachers?.photo} sx={{ width: 64, height: 64 }} />
                    </div>
                    <span className="text-xs font-bold text-green-500 mb-1">Teacher</span>
                    <span className="text-sm font-black text-center leading-tight">{group?.teachers?.full_name?.split(' ')[1] || 'Sultonqulov'}<br/>{group?.teachers?.full_name?.split(' ')[0] || 'Abduxoshim'}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border-2 border-slate-200 flex items-center justify-center mb-2 bg-slate-50">
                      <div className="grid grid-cols-3 gap-1 p-2 w-full h-full">
                         <div className="bg-green-400 rounded-sm"></div>
                         <div className="bg-green-400 rounded-sm"></div>
                         <div className="bg-green-400 rounded-sm"></div>
                         <div className="bg-green-400 rounded-sm"></div>
                         <div className="bg-slate-200 rounded-sm"></div>
                         <div className="bg-green-400 rounded-sm"></div>
                         <div className="bg-green-400 rounded-sm"></div>
                         <div className="bg-green-400 rounded-sm"></div>
                         <div className="bg-green-400 rounded-sm"></div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-green-500 mb-1">Assistant</span>
                    <span className="text-sm font-black text-center leading-tight">Umarxon<br/>+++Xodjaev</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border-2 border-slate-200 flex items-center justify-center mb-2 bg-slate-50">
                      <div className="grid grid-cols-3 gap-1 p-2 w-full h-full">
                         <div className="bg-green-400 rounded-sm"></div>
                         <div className="bg-green-400 rounded-sm"></div>
                         <div className="bg-green-400 rounded-sm"></div>
                         <div className="bg-green-400 rounded-sm"></div>
                         <div className="bg-slate-200 rounded-sm"></div>
                         <div className="bg-green-400 rounded-sm"></div>
                         <div className="bg-green-400 rounded-sm"></div>
                         <div className="bg-green-400 rounded-sm"></div>
                         <div className="bg-green-400 rounded-sm"></div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-green-500 mb-1">Assistant</span>
                    <span className="text-sm font-black text-center leading-tight">Barchinoy<br/>+++Yusupova</span>
                  </div>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center hover:bg-slate-50 cursor-pointer">
                <span className="font-bold text-[#1A2332] dark:text-white">Akademiklar va ularning o'qitgan soatlari</span>
                <span className="text-xl">+</span>
              </div>
            </div>

            {/* Parametrlar */}
            <div className="bg-white dark:bg-navy-elevated rounded-xl border border-slate-200 dark:border-navy-raised overflow-hidden">
              <div className="bg-[#2185D0] text-white px-4 py-3 flex justify-between items-center">
                <span className="font-bold">Parametrlar</span>
                <CloseIcon fontSize="small" className="cursor-pointer" />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Filial:</span>
                  <span className="font-black text-[#2185D0]">Chilonzor</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Kurs:</span>
                  <span className="font-black text-right">{courseName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Turi:</span>
                  <span className="font-black text-right">{courseType}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Kategoriya:</span>
                  <span className="font-black text-right">Programming</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">To'lov turi:</span>
                  <span className="font-black text-right">{tolovTuri}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">O'rta yosh:</span>
                  <span className="font-black text-right">{averageAge}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">O'quvchilar sig'imi:</span>
                  <span className="font-black text-right">{maxStudent}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Mavjud o'quvchilar:</span>
                  <span className="font-black text-right">{currentStudents}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Shartnomalar:</span>
                  <span className="font-black text-right">{currentStudents}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">O'quv oyidagi darslar soni:</span>
                  <span className="font-black text-right">{lessonsPerMonth}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Kurs davomiyligi (oy):</span>
                  <span className="font-black text-right">{durationMonth.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Jami darslar soni:</span>
                  <span className="font-black text-right">{totalLessons}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dars jadvali */}
          <div>
            <h3 className="text-xl font-bold text-[#1A2332] dark:text-white mb-6">Dars jadvali</h3>
            <div className="bg-white dark:bg-navy-elevated rounded-xl border border-slate-200 dark:border-navy-raised overflow-hidden mb-6">
              <div className="p-4 border-b border-slate-100 flex items-center text-sm hover:bg-slate-50 cursor-pointer">
                <span className="w-1/4 font-black text-[#2185D0]">{group?.teachers?.full_name || 'Sultonqulov Abduxoshim'}</span>
                <span className="w-1/4 text-slate-600">{group?.week_day?.join('/') || 'Du/Se/Ch/Pa/Ju'}</span>
                <span className="w-1/4 text-slate-600">{group?.start_time || '09:30'} dan - 12:30 gacha</span>
                <span className="w-1/4 text-slate-600 text-center">15 Yan, 2026 - 27 Iyun, 2026</span>
                <span className="w-1/4 text-slate-600 text-right">{group?.rooms?.name || 'F2 Autodesk // 18'}</span>
              </div>
              <div className="p-4 border-b border-slate-100 flex items-center text-sm hover:bg-slate-50 cursor-pointer">
                <span className="w-1/4 font-black text-[#2185D0]">+++Yusupova Barchinoy</span>
                <span className="w-1/4 text-slate-600">{group?.week_day?.join('/') || 'Du/Se/Ch/Pa/Ju'}</span>
                <span className="w-1/4 text-slate-600">08:00 dan - 09:30 gacha</span>
                <span className="w-1/4 text-slate-600 text-center">15 Yan, 2026 - 27 Iyun, 2026</span>
                <span className="w-1/4 text-slate-600 text-right">{group?.rooms?.name || 'F2 Autodesk // 18'}</span>
              </div>
              <div className="p-4 flex justify-center">
                <Button variant="outlined" className="rounded-full text-slate-500 border-slate-300 normal-case px-6">Yana ko'rsatish (9)</Button>
              </div>
            </div>

            {/* Calendar Ribbon */}
            <div className="flex items-center gap-4 mb-6">
              <IconButton size="small" className="border border-slate-200 bg-white"><ArrowBackIcon fontSize="small" /></IconButton>
              <span className="text-sm font-bold text-slate-600">{getGroupMonth()}-o'quv oyi</span>
              <IconButton size="small" className="border border-slate-200 bg-white"><ArrowBackIcon fontSize="small" className="rotate-180" /></IconButton>
            </div>
            
            <div className={`flex gap-2 pb-4 scrollbar-hide mb-4 ${showAllDates ? 'flex-wrap' : 'overflow-x-auto'}`}>
              {(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                let dates: Date[] = [];
                
                if (showAllDates && group?.start_date) {
                  const start = new Date(group.start_date);
                  start.setHours(0, 0, 0, 0);
                  const end = new Date();
                  end.setDate(end.getDate() + 15);
                  end.setHours(0, 0, 0, 0);
                  
                  const current = new Date(start);
                  while (current <= end) {
                    dates.push(new Date(current));
                    current.setDate(current.getDate() + 1);
                  }
                } else {
                  dates = Array.from({length: 20}).map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - 5 + i);
                    return d;
                  });
                }

                return dates.map((date, i) => {
                  const ribbonDate = new Date(date);
                  ribbonDate.setHours(0, 0, 0, 0);
                  
                  const isPastOrToday = ribbonDate <= today;
                  const isSelected = selectedJournalDate.getDate() === date.getDate() &&
                                     selectedJournalDate.getMonth() === date.getMonth() &&
                                     selectedJournalDate.getFullYear() === date.getFullYear();

                  const dateHasLesson = lessons.some(l => {
                    const ld = new Date(l.created_at);
                    return ld.getDate() === date.getDate() &&
                           ld.getMonth() === date.getMonth() &&
                           ld.getFullYear() === date.getFullYear();
                  });
                  
                  const colorClass = isSelected ? 'bg-[#10B981] text-white shadow-md shadow-emerald-500/20 border-transparent font-black scale-105' : 
                                    (isPastOrToday && dateHasLesson) ? 'bg-[#2185D0] text-white border-[#2185D0]' :
                                    isPastOrToday ? 'bg-slate-200 dark:bg-navy-raised text-[#1A2332] dark:text-white border-transparent' : 
                                    'bg-white dark:bg-navy-elevated border border-slate-200 dark:border-navy-raised text-slate-400 cursor-not-allowed';

                  const handleDateClick = () => {
                    if (!isPastOrToday) {
                      alert("Buni qilishingiz mumkin emas");
                      return;
                    }
                    setSelectedJournalDate(date);
                  };

                  return (
                    <div 
                      key={i} 
                      onClick={handleDateClick}
                      className={`min-w-[44px] h-[58px] rounded flex flex-col items-center justify-center transition-all cursor-pointer border relative ${colorClass}`}
                    >
                      <span className="text-[10px] uppercase font-bold">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-sm font-black">{date.getDate()}</span>
                      {dateHasLesson && !isSelected && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#10B981] rounded-full border border-white"></div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
            
            <div className="flex justify-center mb-8">
              <Button 
                variant="outlined" 
                onClick={() => setShowAllDates(!showAllDates)}
                className="rounded-full bg-white text-slate-500 border-slate-300 normal-case px-6 shadow-sm"
              >
                {showAllDates ? "Yopish" : `Barchasini ko'rish`}
              </Button>
            </div>

            {/* Attendance & Lesson Topic taking block moved inside study month ribbon */}
            {selectedJournalDate && (
              <div className="bg-[#f8fafc] dark:bg-navy-raised rounded-2xl p-8 border border-slate-200 dark:border-navy-raised mb-8">
                {/* Teacher / Assistant Tabs */}
                <div className="flex gap-6 border-b border-slate-200 dark:border-navy-raised mb-6">
                  <button className="pb-3 text-sm font-black text-slate-400 hover:text-slate-600 transition-colors">Assistant</button>
                  <button className="pb-3 text-sm font-black text-[#10B981] border-b-2 border-[#10B981]">Teacher</button>
                </div>

                {/* Teacher Info Card */}
                <div className="bg-white dark:bg-navy-elevated rounded-2xl p-6 mb-8 border border-slate-100 dark:border-navy-raised">
                  <p className="text-xs font-black text-[#1A2332] dark:text-white mb-4">Ma'lumot</p>
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar src={group?.teachers?.photo} sx={{ width: 48, height: 48 }} className="border-2 border-white shadow-sm" />
                    <div>
                      <p className="text-sm font-black text-[#1A2332] dark:text-white">{group?.teachers?.full_name}</p>
                      <p className="text-xs font-bold text-slate-400">Teacher</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 mb-1">Dars kuni</p>
                      <p className="text-xs font-black text-[#1A2332] dark:text-white">{selectedJournalDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 mb-1">Dars vaqti</p>
                      <p className="text-xs font-black text-[#1A2332] dark:text-white">{group?.start_time}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 mb-1">Filial</p>
                      <p className="text-xs font-black text-[#1A2332] dark:text-white">Chilonzor</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 mb-1">Xona</p>
                      <p className="text-xs font-black text-[#1A2332] dark:text-white">{group?.rooms?.name}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-[#1A2332] dark:text-white">
                    {group?.name} {selectedJournalDate.toLocaleDateString('ru-RU')}
                  </h3>
                  {hasExistingLesson && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-[#10B981] text-xs font-black px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Saqlangan
                    </span>
                  )}
                </div>

                <h4 className="text-base font-black text-[#1A2332] dark:text-white mb-4">Yo'qlama va mavzu kiritish</h4>

                <div className="bg-white dark:bg-navy-elevated rounded-2xl p-6 mb-6 shadow-sm border border-slate-100 dark:border-navy-raised">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <input type="radio" id="plan_malumotlar" name="type_malumotlar" className="accent-primary" disabled />
                      <label htmlFor="plan_malumotlar" className="text-sm font-bold text-slate-400">O'quv reja bo'yicha</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="radio" id="other_malumotlar" name="type_malumotlar" className="accent-primary" defaultChecked />
                      <label htmlFor="other_malumotlar" className="text-sm font-bold text-primary">Boshqa</label>
                    </div>
                  </div>
                  
                  <TextField
                    fullWidth
                    label="* Mavzu"
                    value={lessonTopic}
                    onChange={e => setLessonTopic(e.target.value)}
                    placeholder="Mavzuni kiriting"
                    variant="outlined"
                    size="small"
                    disabled={hasExistingLesson}
                    className="bg-slate-50 dark:bg-navy-elevated rounded-lg"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                </div>

                <div className="bg-white dark:bg-navy-elevated rounded-2xl shadow-sm overflow-hidden mb-6 border border-slate-150">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 dark:bg-navy-elevated">
                      <tr>
                        <th className="px-6 py-4 text-xs font-black text-slate-400">#</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400">O'quvchi ismi</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400">Vaqti</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400">Keldi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-navy-elevated">
                      {students.map((student, i) => (
                        <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-elevated/50 transition-colors">
                          <td className="px-6 py-4 text-xs font-bold text-slate-500">{i + 1}</td>
                          <td className="px-6 py-4 text-sm font-black text-[#1A2332] dark:text-white">{student.full_name}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-500">{group?.start_time}</td>
                          <td className="px-6 py-4">
                            {hasExistingLesson ? (
                              <span className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-lg ${
                                attendance[student.id] 
                                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-[#10B981]' 
                                  : 'bg-red-50 dark:bg-red-950/30 text-red-500'
                              }`}>
                                {attendance[student.id] ? '✓ Keldi' : '✗ Kelmadi'}
                              </span>
                            ) : (
                              <Switch
                                checked={attendance[student.id] || false}
                                onChange={(e) => setAttendance({ ...attendance, [student.id]: e.target.checked })}
                                color="success"
                                size="small"
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {!hasExistingLesson && (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSaveLesson}
                    disabled={!lessonTopic}
                    className="bg-[#10B981] hover:bg-[#059669] text-white py-3.5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                  >
                    Saqlash
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* O'quvchilar */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#1A2332] dark:text-white">O'quvchilar</h3>
              <Button variant="outlined" className="text-slate-500 border-slate-300 normal-case px-4 py-1 rounded bg-white">
                <span className="mr-2">≡</span> Menu
              </Button>
            </div>
            
            <div className="flex gap-6 border-b border-slate-200 mb-6">
              <button className="pb-3 text-sm font-black text-[#10B981] border-b-2 border-[#10B981]">Faollar ({students.length})</button>
              <button className="pb-3 text-sm font-bold text-slate-400 hover:text-slate-600">To'xtatganlar (13)</button>
            </div>
            
            <div className="space-y-4">
              {students.map((student, index) => (
                <div key={student.id} className="bg-white dark:bg-navy-elevated rounded-xl border border-slate-200 dark:border-navy-raised overflow-hidden shadow-sm">
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center text-white">
                        <PersonOutlinedIcon />
                      </div>
                      <span className="font-bold text-[#1A2332]">{student.full_name}</span>
                    </div>
                    <span className="text-2xl text-slate-400 leading-none">+</span>
                  </div>
                  
                  {index === 0 || index === 1 ? (
                    <div className="p-6 border-t border-slate-100">
                      <div className="flex items-center gap-4 mb-6">
                        <IconButton size="small" className="border border-slate-200 bg-white"><ArrowBackIcon fontSize="small" /></IconButton>
                        <span className="text-sm font-bold text-slate-600">{getGroupMonth()}-o'quv oyi</span>
                        <IconButton size="small" className="border border-slate-200 bg-white"><ArrowBackIcon fontSize="small" className="rotate-180" /></IconButton>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
                        {Array.from({length: 20}).map((_, i) => {
                          const date = new Date();
                          date.setDate(date.getDate() - 5 + i);
                          
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const ribbonDate = new Date(date);
                          ribbonDate.setHours(0, 0, 0, 0);
                          
                          const isPastOrToday = ribbonDate <= today;
                          
                          let colorClass = isPastOrToday ? "bg-slate-200 dark:bg-navy-raised text-[#1A2332] dark:text-white border-transparent" : "bg-white dark:bg-navy-elevated text-slate-400 border border-slate-200 dark:border-navy-raised";
                          if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5 || i === 6 || i === 7) colorClass = "bg-[#FFB020] text-white border-[#FFB020]";
                          if (i === 10) colorClass = "bg-[#2185D0] text-white border-[#2185D0]";
                          
                          return (
                            <div key={i} className={`min-w-[44px] h-[52px] rounded flex flex-col items-center justify-center border ${colorClass}`}>
                              <span className="text-[10px] uppercase font-bold">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                              <span className="text-sm font-black">{date.getDate()}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-center">
                        <Button variant="outlined" className="rounded-full text-slate-500 border-slate-300 normal-case px-6 shadow-sm bg-white">Barchasini ko'rish</Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
};

export default GroupDetails;
