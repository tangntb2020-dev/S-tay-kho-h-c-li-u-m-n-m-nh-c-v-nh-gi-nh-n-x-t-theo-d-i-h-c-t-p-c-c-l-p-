import React, { useState } from 'react';
import { Student, AttendanceRecord } from '../types';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  Award, 
  AlertCircle,
  Users,
  Save,
  Music
} from 'lucide-react';

interface AttendanceTrackerProps {
  classNameStr: string;
  classId: string;
  students: Student[];
  onSaveAttendanceToHistory?: (rec: AttendanceRecord) => void;
  isLargeText: boolean;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  classNameStr,
  classId,
  students,
  onSaveAttendanceToHistory,
  isLargeText,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [statuses, setStatuses] = useState<Record<string, 'present' | 'excused' | 'unexcused'>>(() => {
    // Default all present
    const init: Record<string, 'present' | 'excused' | 'unexcused'> = {};
    students.forEach((s) => {
      init[s.id] = 'present';
    });
    return init;
  });

  const [notes, setNotes] = useState<Record<string, string>>({});
  const [conductStars, setConductStars] = useState<Record<string, number>>({});
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Quick action: All Present
  const handleMarkAllPresent = () => {
    const updated: Record<string, 'present' | 'excused' | 'unexcused'> = {};
    students.forEach((s) => {
      updated[s.id] = 'present';
    });
    setStatuses(updated);
  };

  const handleToggleStatus = (studentId: string, status: 'present' | 'excused' | 'unexcused') => {
    setStatuses((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleAddConductStar = (studentId: string, delta: number) => {
    setConductStars((prev) => ({
      ...prev,
      [studentId]: Math.max(0, (prev[studentId] || 0) + delta),
    }));
  };

  const handleSave = () => {
    if (onSaveAttendanceToHistory) {
      onSaveAttendanceToHistory({
        id: `${classId}-${selectedDate}`,
        date: selectedDate,
        classId,
        statuses,
      });
    }
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  // Stats
  const total = students.length;
  let presentCount = 0;
  let excusedCount = 0;
  let unexcusedCount = 0;

  students.forEach((s) => {
    const st = statuses[s.id] || 'present';
    if (st === 'present') presentCount++;
    else if (st === 'excused') excusedCount++;
    else if (st === 'unexcused') unexcusedCount++;
  });

  const totalLessonStars = Object.values(conductStars).reduce((a, b) => a + b, 0);

  return (
    <div className={`space-y-5 ${isLargeText ? 'text-base' : 'text-sm'}`}>
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-600 text-white font-black text-xs rounded-lg">
              ĐIỂM DANH & NỀ NẾP
            </span>
            <span className="text-slate-500 font-medium text-xs">
              Lớp {classNameStr} • Tiết Âm Nhạc
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Quản Lý Nề Nếp & Chuyên Cần Lớp Học
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Điểm danh nhanh 1 chạm, khen thưởng nốt nhạc chăm ngoan và ghi nhận kỷ luật giờ học hát.
          </p>
        </div>

        {/* Date picker & quick all present */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <Calendar className="w-4 h-4 text-slate-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent font-bold text-xs outline-none text-slate-800"
            />
          </div>

          <button
            onClick={handleMarkAllPresent}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Tất cả Có Mặt</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Buổi Học</span>
          </button>
        </div>
      </div>

      {isSavedToast && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Đã lưu thành công dữ liệu điểm danh và nề nếp buổi học!</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <div className="text-xs font-bold text-emerald-700 uppercase">Có Mặt</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800 mt-1">
            {presentCount} <span className="text-xs font-normal text-emerald-600">/ {total}</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="text-xs font-bold text-amber-700 uppercase">Vắng Có Phép</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-800 mt-1">
            {excusedCount}
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
          <div className="text-xs font-bold text-rose-700 uppercase">Vắng Không Phép</div>
          <div className="text-2xl sm:text-3xl font-black text-rose-800 mt-1">
            {unexcusedCount}
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
          <div className="text-xs font-bold text-indigo-700 uppercase flex items-center gap-1">
            <Music className="w-3.5 h-3.5" />
            <span>Nốt Nhạc Thưởng</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-800 mt-1">
            {totalLessonStars} 🎵
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
          <span>DANH SÁCH HỌC SINH ({students.length} em)</span>
          <span className="text-slate-400 font-normal">
            Bấm chọn để chuyển đổi trạng thái điểm danh
          </span>
        </div>

        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
          {students.map((s, idx) => {
            const status = statuses[s.id] || 'present';
            const stars = conductStars[s.id] || 0;

            return (
              <div
                key={s.id}
                className="p-3 hover:bg-slate-50 transition-colors flex flex-wrap items-center justify-between gap-3"
              >
                {/* Info */}
                <div className="flex items-center gap-3 min-w-[200px]">
                  <span className="w-6 text-center text-xs font-bold text-slate-400">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-extrabold text-slate-900 flex items-center gap-2">
                      <span>{s.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">({s.code})</span>
                    </div>
                    <div className="text-xs text-slate-400">{s.gender}</div>
                  </div>
                </div>

                {/* Attendance buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleStatus(s.id, 'present')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                      status === 'present'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Có mặt</span>
                  </button>

                  <button
                    onClick={() => handleToggleStatus(s.id, 'excused')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                      status === 'excused'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Có phép</span>
                  </button>

                  <button
                    onClick={() => handleToggleStatus(s.id, 'unexcused')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                      status === 'unexcused'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Không phép</span>
                  </button>
                </div>

                {/* Thi đua / Sao nốt nhạc */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 hidden sm:inline">Nề nếp:</span>
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded-xl">
                    <button
                      onClick={() => handleAddConductStar(s.id, -1)}
                      className="w-5 h-5 rounded bg-white text-slate-600 hover:bg-slate-100 font-bold text-xs flex items-center justify-center shadow-xs"
                    >
                      -
                    </button>
                    <span className="font-extrabold text-amber-700 text-xs px-1 min-w-[24px] text-center">
                      🎵 {stars}
                    </span>
                    <button
                      onClick={() => handleAddConductStar(s.id, 1)}
                      className="w-5 h-5 rounded bg-amber-400 text-amber-950 hover:bg-amber-300 font-bold text-xs flex items-center justify-center shadow-xs"
                      title="Tặng nốt nhạc khen thưởng"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
