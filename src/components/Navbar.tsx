import React from 'react';
import { TEACHER_CLASSES } from '../data/mockData';
import { 
  Cloud, 
  CloudOff, 
  Sparkles, 
  RotateCw, 
  BookOpen, 
  School
} from 'lucide-react';
import { GoogleSheetsConfig } from '../types';

interface NavbarProps {
  selectedClassId: string;
  onSelectClass: (classId: string) => void;
  semester: 'HK1' | 'HK2';
  onSemesterChange: (sem: 'HK1' | 'HK2') => void;
  sheetsConfig: GoogleSheetsConfig;
  onOpenSync: () => void;
  isLargeText: boolean;
  onToggleLargeText: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedClassId,
  onSelectClass,
  semester,
  onSemesterChange,
  sheetsConfig,
  onOpenSync,
  isLargeText,
  onToggleLargeText,
}) => {
  // Group classes by grade
  const grade1 = TEACHER_CLASSES.filter(c => c.grade === 1);
  const grade2 = TEACHER_CLASSES.filter(c => c.grade === 2);
  const grade3 = TEACHER_CLASSES.filter(c => c.grade === 3);
  const grade4 = TEACHER_CLASSES.filter(c => c.grade === 4);

  const currentClassObj = TEACHER_CLASSES.find(c => c.id === selectedClassId);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        {/* Left: School & Class selector */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-slate-200">
            <School className="w-5 h-5 text-blue-700" />
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase block tracking-wider">
                TH Khai Minh
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Bộ môn Âm nhạc</span>
            </div>
          </div>

          {/* Large, high-visibility Class dropdown */}
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-500 block uppercase mb-0.5">
              Chọn Lớp Dạy ({TEACHER_CLASSES.length} lớp)
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => onSelectClass(e.target.value)}
              className="bg-blue-50 border-2 border-blue-500 text-blue-900 font-extrabold text-base sm:text-lg rounded-xl px-3.5 py-1.5 focus:ring-4 focus:ring-blue-100 outline-none cursor-pointer transition-all hover:bg-blue-100/70"
            >
              <optgroup label="⭐ KHỐI 1 (Lớp 1/4, 1/6)">
                {grade1.map((c) => (
                  <option key={c.id} value={c.id}>
                    Lớp {c.name} ({c.studentCount} HS)
                  </option>
                ))}
              </optgroup>
              <optgroup label="⭐ KHỐI 2 (2/1 - 2/9 trừ 2/5)">
                {grade2.map((c) => (
                  <option key={c.id} value={c.id}>
                    Lớp {c.name} ({c.studentCount} HS)
                  </option>
                ))}
              </optgroup>
              <optgroup label="⭐ KHỐI 3 (Lớp 3/1, 3/2, 3/3, 3/9)">
                {grade3.map((c) => (
                  <option key={c.id} value={c.id}>
                    Lớp {c.name} ({c.studentCount} HS)
                  </option>
                ))}
              </optgroup>
              <optgroup label="⭐ KHỐI 4 (4/1 - 4/8 trừ 4/2, 4/5)">
                {grade4.map((c) => (
                  <option key={c.id} value={c.id}>
                    Lớp {c.name} ({c.studentCount} HS)
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Sĩ số: {currentClassObj?.studentCount || 35} học sinh</span>
          </div>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Semester toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => onSemesterChange('HK1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                semester === 'HK1'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Học Kỳ 1
            </button>
            <button
              onClick={() => onSemesterChange('HK2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                semester === 'HK2'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Học Kỳ 2
            </button>
          </div>

          {/* Large text toggle for seniors */}
          <button
            onClick={onToggleLargeText}
            title="Chuyển chế độ chữ to dễ đọc cho giáo viên"
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              isLargeText 
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chữ to</span>
            <span className="sm:hidden">A+</span>
          </button>

          {/* Google Sheets Sync status */}
          <button
            onClick={onOpenSync}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              sheetsConfig.isConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            }`}
          >
            {sheetsConfig.isConnected ? (
              <>
                <Cloud className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="hidden sm:inline">Google Sheets: Đã kết nối</span>
                <span className="sm:hidden">Sheets: OK</span>
              </>
            ) : (
              <>
                <CloudOff className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="hidden sm:inline">Google Sheets (Offline)</span>
                <span className="sm:hidden">Sheets</span>
              </>
            )}
            <RotateCw className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};
