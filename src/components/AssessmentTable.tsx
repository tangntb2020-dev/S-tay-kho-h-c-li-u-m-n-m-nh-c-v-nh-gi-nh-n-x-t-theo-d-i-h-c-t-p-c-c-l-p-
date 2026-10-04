import React, { useState } from 'react';
import { Student, AssessmentRecord, AssessmentLevel } from '../types';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  HelpCircle,
  MessageSquare,
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface AssessmentTableProps {
  classId: string;
  classNameStr: string;
  semester: 'HK1' | 'HK2';
  students: Student[];
  assessments: Record<string, AssessmentRecord>;
  onUpdateAssessment: (studentId: string, updates: Partial<AssessmentRecord>) => void;
  onBatchSetLevel: (field: keyof AssessmentRecord, level: AssessmentLevel) => void;
  isLargeText: boolean;
}

const QUICK_COMMENTS = [
  'Hát đúng giai điệu, biểu diễn tự tin, năng khiếu tốt.',
  'Thuộc lời ca, gõ phách chuẩn xác, tích cực phát biểu.',
  'Hát rõ lời, biết phối hợp vận động phụ họa nhịp nhàng.',
  'Hát còn nhỏ, cần tập trung hơn khi gõ đệm thanh phách.',
  'Cần rèn luyện thêm về cao độ và nhớ giai điệu bài hát.',
];

export const AssessmentTable: React.FC<AssessmentTableProps> = ({
  classNameStr,
  semester,
  students,
  assessments,
  onUpdateAssessment,
  onBatchSetLevel,
  isLargeText,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'T' | 'H' | 'C'>('ALL');
  const [editingCommentStudentId, setEditingCommentStudentId] = useState<string | null>(null);
  const [activeColumn, setActiveColumn] = useState<
    'dgtx1' | 'dgtx2' | 'dgtx3' | 'giuaKy' | 'cuoiKy'
  >('dgtx1');

  const currentMidTermField = semester === 'HK1' ? 'giuaKy1' : 'giuaKy2';
  const currentFinalTermField = semester === 'HK1' ? 'cuoiKy1' : 'cuoiKy2';

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.code.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filterLevel === 'ALL') return true;
    const rec = assessments[s.id];
    if (!rec) return false;
    
    // Check if student has the filter level in any key column
    const colField = activeColumn === 'giuaKy' ? currentMidTermField :
                     activeColumn === 'cuoiKy' ? currentFinalTermField : activeColumn;
    return rec[colField] === filterLevel;
  });

  // Calculate statistics
  const totalStudents = students.length;
  let countT = 0;
  let countH = 0;
  let countC = 0;
  let countEmpty = 0;

  students.forEach((s) => {
    const rec = assessments[s.id];
    const val = rec ? (activeColumn === 'giuaKy' ? rec[currentMidTermField] :
                       activeColumn === 'cuoiKy' ? rec[currentFinalTermField] : rec[activeColumn]) : '';
    if (val === 'T') countT++;
    else if (val === 'H') countH++;
    else if (val === 'C') countC++;
    else countEmpty++;
  });

  const percentT = totalStudents ? Math.round((countT / totalStudents) * 100) : 0;
  const percentH = totalStudents ? Math.round((countH / totalStudents) * 100) : 0;
  const percentC = totalStudents ? Math.round((countC / totalStudents) * 100) : 0;

  // Handle single cell level update
  const handleSetLevel = (studentId: string, field: keyof AssessmentRecord, level: AssessmentLevel) => {
    const currentVal = assessments[studentId]?.[field];
    // Toggle off if same, or set new
    const newVal = currentVal === level ? '' : level;
    onUpdateAssessment(studentId, { [field]: newVal });
  };

  // Add stars/music notes
  const handleAddStar = (studentId: string, delta: number) => {
    const currentStars = assessments[studentId]?.stars || 0;
    const newStars = Math.max(0, currentStars + delta);
    onUpdateAssessment(studentId, { stars: newStars });
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'STT', 'Mã Học Sinh', 'Họ Và Tên', 'Giới Tính', 'Lớp',
      'ĐGTX 1 (Hát)', 'ĐGTX 2 (Gõ Đệm)', 'ĐGTX 3 (Đọc Nhạc)',
      semester === 'HK1' ? 'Giữa HK1' : 'Giữa HK2',
      semester === 'HK1' ? 'Cuối HK1' : 'Cuối HK2',
      'Nhận Xét GV', 'Sao Thi Đua'
    ];

    const rows = students.map((s, idx) => {
      const rec = assessments[s.id] || {} as AssessmentRecord;
      return [
        idx + 1,
        `"${s.code}"`,
        `"${s.name}"`,
        s.gender,
        classNameStr,
        rec.dgtx1 || '',
        rec.dgtx2 || '',
        rec.dgtx3 || '',
        semester === 'HK1' ? (rec.giuaKy1 || '') : (rec.giuaKy2 || ''),
        semester === 'HK1' ? (rec.cuoiKy1 || '') : (rec.cuoiKy2 || ''),
        `"${(rec.comment || '').replace(/"/g, '""')}"`,
        rec.stars || 0
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BangDiem_AmNhac_Lop_${classNameStr.replace('/', '_')}_${semester}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`space-y-5 ${isLargeText ? 'text-base' : 'text-sm'}`}>
      {/* Top Banner / Classroom Info & TT27 Rules */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-600 text-white font-black text-sm rounded-lg">
              LỚP {classNameStr}
            </span>
            <span className="text-slate-500 font-medium text-xs">
              • Môn: Âm nhạc Tiểu học • Chuẩn Thông tư 27/2020/TT-BGDĐT
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Bảng Đánh Giá Thường Xuyên & Định Kỳ ({semester})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Mức đánh giá: <strong className="text-emerald-700">T (Tốt)</strong>, <strong className="text-blue-700">H (Hoàn thành)</strong>, <strong className="text-rose-600">C (Chưa hoàn thành)</strong>. Nhấn trực tiếp để chấm nhanh.
          </p>
        </div>

        {/* Action quick buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick set all H button */}
          <button
            onClick={() => {
              const targetCol = activeColumn === 'giuaKy' ? currentMidTermField :
                                activeColumn === 'cuoiKy' ? currentFinalTermField : activeColumn;
              if (window.confirm(`Bạn có chắc chắn muốn điền nhanh mức [H] (Hoàn thành) cho cả lớp ở cột đang chọn không?`)) {
                onBatchSetLevel(targetCol, 'H');
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-xs transition-all text-xs active:scale-95"
            title="Điền mức H cho toàn bộ học sinh trong cột đang chọn"
          >
            <Zap className="w-4 h-4 fill-amber-200" />
            <span>Điền nhanh cả lớp = H</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-xs"
            title="Xuất file CSV mở bằng Excel"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-xs"
            title="In bảng đánh giá"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>In bảng điểm</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-50/70 border-2 border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Hoàn thành tốt (T)
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-800 mt-0.5">
              {countT} <span className="text-xs font-normal text-emerald-600">({percentT}%)</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-black text-lg flex items-center justify-center shadow-xs">
            T
          </div>
        </div>

        <div className="bg-blue-50/70 border-2 border-blue-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Hoàn thành (H)
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-800 mt-0.5">
              {countH} <span className="text-xs font-normal text-blue-600">({percentH}%)</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-xs">
            H
          </div>
        </div>

        <div className="bg-rose-50/80 border-2 border-rose-300 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1">
              <span>Chưa hoàn thành (C)</span>
              {countC > 0 && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-800 mt-0.5">
              {countC} <span className="text-xs font-normal text-rose-600">({percentC}%)</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500 text-white font-black text-lg flex items-center justify-center shadow-xs">
            C
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tổng số học sinh
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-800 mt-0.5">
              {totalStudents} <span className="text-xs font-normal text-slate-500">HS</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
            {countEmpty === 0 ? '100%' : `Thiếu ${countEmpty}`}
          </div>
        </div>
      </div>

      {/* Control bar: search, column selector, filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên học sinh hoặc mã số..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Active Column to focus on */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto">
          <span className="text-slate-500 px-2 text-[11px] uppercase">Cột chọn:</span>
          <button
            onClick={() => setActiveColumn('dgtx1')}
            className={`px-2.5 py-1.5 rounded-lg transition-all ${
              activeColumn === 'dgtx1' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            ĐGTX 1 (Hát)
          </button>
          <button
            onClick={() => setActiveColumn('dgtx2')}
            className={`px-2.5 py-1.5 rounded-lg transition-all ${
              activeColumn === 'dgtx2' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            ĐGTX 2 (Gõ Đệm)
          </button>
          <button
            onClick={() => setActiveColumn('dgtx3')}
            className={`px-2.5 py-1.5 rounded-lg transition-all ${
              activeColumn === 'dgtx3' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            ĐGTX 3 (Đọc Nhạc)
          </button>
          <button
            onClick={() => setActiveColumn('giuaKy')}
            className={`px-2.5 py-1.5 rounded-lg transition-all ${
              activeColumn === 'giuaKy' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Giữa {semester}
          </button>
          <button
            onClick={() => setActiveColumn('cuoiKy')}
            className={`px-2.5 py-1.5 rounded-lg transition-all ${
              activeColumn === 'cuoiKy' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Cuối {semester}
          </button>
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500 font-semibold">Lọc mức:</span>
          {(['ALL', 'T', 'H', 'C'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                filterLevel === lvl
                  ? lvl === 'T' ? 'bg-emerald-600 text-white'
                  : lvl === 'H' ? 'bg-blue-600 text-white'
                  : lvl === 'C' ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl === 'ALL' ? 'Tất cả' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-xs font-black text-slate-700 tracking-wider uppercase">
                <th className="py-3.5 px-3 text-center w-12">STT</th>
                <th className="py-3.5 px-4 min-w-[200px]">Học Sinh</th>
                <th className="py-3.5 px-3 text-center w-28 bg-blue-50/50">
                  <div>ĐGTX 1</div>
                  <div className="text-[10px] font-normal text-slate-500 normal-case">Hát đúng giai điệu</div>
                </th>
                <th className="py-3.5 px-3 text-center w-28">
                  <div>ĐGTX 2</div>
                  <div className="text-[10px] font-normal text-slate-500 normal-case">Gõ đệm / Nhạc cụ</div>
                </th>
                <th className="py-3.5 px-3 text-center w-28 bg-blue-50/50">
                  <div>ĐGTX 3</div>
                  <div className="text-[10px] font-normal text-slate-500 normal-case">Đọc nhạc / Phụ họa</div>
                </th>
                <th className="py-3.5 px-3 text-center w-28 bg-amber-50/40">
                  <div>Giữa {semester}</div>
                  <div className="text-[10px] font-normal text-slate-500 normal-case">Định kỳ giữa kỳ</div>
                </th>
                <th className="py-3.5 px-3 text-center w-28 bg-indigo-50/40">
                  <div>Cuối {semester}</div>
                  <div className="text-[10px] font-normal text-slate-500 normal-case">Định kỳ cuối kỳ</div>
                </th>
                <th className="py-3.5 px-3 text-center w-28">Sao / Nốt Nhạc</th>
                <th className="py-3.5 px-4 min-w-[220px]">Nhận Xét Đánh Giá (TT 27)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Không tìm thấy học sinh nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => {
                  const rec = assessments[s.id] || {
                    studentId: s.id,
                    classId: s.classId,
                    dgtx1: '',
                    dgtx2: '',
                    dgtx3: '',
                    giuaKy1: '',
                    cuoiKy1: '',
                    giuaKy2: '',
                    cuoiKy2: '',
                    comment: '',
                    stars: 0,
                  };

                  const midTermVal = semester === 'HK1' ? rec.giuaKy1 : rec.giuaKy2;
                  const finalTermVal = semester === 'HK1' ? rec.cuoiKy1 : rec.cuoiKy2;

                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        rec.dgtx1 === 'C' || midTermVal === 'C' || finalTermVal === 'C'
                          ? 'bg-rose-50/20'
                          : ''
                      }`}
                    >
                      {/* STT */}
                      <td className="py-3 px-3 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>

                      {/* Name & Code */}
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900 flex items-center gap-2">
                          <span>{s.name}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            s.gender === 'Nữ' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {s.gender}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          {s.code}
                        </div>
                      </td>

                      {/* ĐGTX 1 (Hát đúng giai điệu) */}
                      <td className="py-3 px-2 text-center bg-blue-50/30">
                        <LevelButtonGroup
                          current={rec.dgtx1}
                          onSelect={(lvl) => handleSetLevel(s.id, 'dgtx1', lvl)}
                        />
                      </td>

                      {/* ĐGTX 2 (Gõ đệm) */}
                      <td className="py-3 px-2 text-center">
                        <LevelButtonGroup
                          current={rec.dgtx2}
                          onSelect={(lvl) => handleSetLevel(s.id, 'dgtx2', lvl)}
                        />
                      </td>

                      {/* ĐGTX 3 (Đọc nhạc) */}
                      <td className="py-3 px-2 text-center bg-blue-50/30">
                        <LevelButtonGroup
                          current={rec.dgtx3}
                          onSelect={(lvl) => handleSetLevel(s.id, 'dgtx3', lvl)}
                        />
                      </td>

                      {/* Giữa kỳ */}
                      <td className="py-3 px-2 text-center bg-amber-50/20">
                        <LevelButtonGroup
                          current={midTermVal}
                          onSelect={(lvl) => handleSetLevel(s.id, currentMidTermField, lvl)}
                        />
                      </td>

                      {/* Cuối kỳ */}
                      <td className="py-3 px-2 text-center bg-indigo-50/20">
                        <LevelButtonGroup
                          current={finalTermVal}
                          onSelect={(lvl) => handleSetLevel(s.id, currentFinalTermField, lvl)}
                        />
                      </td>

                      {/* Stars / Thi đua */}
                      <td className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleAddStar(s.id, -1)}
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-xs"
                          >
                            -
                          </button>
                          <span className="font-extrabold text-amber-600 flex items-center gap-0.5 min-w-[32px] justify-center">
                            ⭐ {rec.stars || 0}
                          </span>
                          <button
                            onClick={() => handleAddStar(s.id, 1)}
                            className="w-6 h-6 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold flex items-center justify-center text-xs"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Comment */}
                      <td className="py-3 px-4">
                        <div className="relative">
                          <input
                            type="text"
                            value={rec.comment || ''}
                            onChange={(e) =>
                              onUpdateAssessment(s.id, { comment: e.target.value })
                            }
                            placeholder="Nhập nhận xét (hoặc bấm chọn)..."
                            className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-8"
                          />
                          <button
                            onClick={() =>
                              setEditingCommentStudentId(
                                editingCommentStudentId === s.id ? null : s.id
                              )
                            }
                            title="Chọn câu nhận xét có sẵn"
                            className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-600"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick comment picker popover */}
                          {editingCommentStudentId === s.id && (
                            <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-slate-200 shadow-xl rounded-xl p-2 z-20 space-y-1">
                              <div className="text-[11px] font-bold text-slate-500 uppercase px-2 py-0.5">
                                Gợi ý nhận xét TT 27:
                              </div>
                              {QUICK_COMMENTS.map((c, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    onUpdateAssessment(s.id, { comment: c });
                                    setEditingCommentStudentId(null);
                                  }}
                                  className="w-full text-left text-xs p-1.5 rounded-lg hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors"
                                >
                                  • {c}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Sub-component: Big 1-touch Button Group for T, H, C
interface LevelButtonGroupProps {
  current: AssessmentLevel;
  onSelect: (level: AssessmentLevel) => void;
}

const LevelButtonGroup: React.FC<LevelButtonGroupProps> = ({ current, onSelect }) => {
  return (
    <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
      <button
        type="button"
        onClick={() => onSelect('T')}
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-black text-xs sm:text-sm flex items-center justify-center transition-all ${
          current === 'T'
            ? 'bg-emerald-600 text-white shadow-md scale-105'
            : 'text-emerald-700 hover:bg-emerald-100/80 bg-white'
        }`}
        title="Hoàn thành tốt"
      >
        T
      </button>

      <button
        type="button"
        onClick={() => onSelect('H')}
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-black text-xs sm:text-sm flex items-center justify-center transition-all ${
          current === 'H'
            ? 'bg-blue-600 text-white shadow-md scale-105'
            : 'text-blue-700 hover:bg-blue-100/80 bg-white'
        }`}
        title="Hoàn thành"
      >
        H
      </button>

      <button
        type="button"
        onClick={() => onSelect('C')}
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-black text-xs sm:text-sm flex items-center justify-center transition-all ${
          current === 'C'
            ? 'bg-rose-600 text-white shadow-md scale-105'
            : 'text-rose-700 hover:bg-rose-100/80 bg-white'
        }`}
        title="Chưa hoàn thành"
      >
        C
      </button>
    </div>
  );
};
