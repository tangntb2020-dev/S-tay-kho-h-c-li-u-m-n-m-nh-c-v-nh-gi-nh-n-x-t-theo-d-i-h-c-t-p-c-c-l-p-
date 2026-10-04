import React, { useState } from 'react';
import { Student, AssessmentRecord } from '../types';
import { 
  MessageSquareText, 
  Copy, 
  Check, 
  Send, 
  Filter, 
  Download, 
  AlertTriangle,
  Award,
  BookOpen
} from 'lucide-react';

interface ParentCommentsProps {
  classNameStr: string;
  semester: 'HK1' | 'HK2';
  students: Student[];
  assessments: Record<string, AssessmentRecord>;
  onUpdateAssessment: (studentId: string, updates: Partial<AssessmentRecord>) => void;
  isLargeText: boolean;
}

export const ParentComments: React.FC<ParentCommentsProps> = ({
  classNameStr,
  semester,
  students,
  assessments,
  onUpdateAssessment,
  isLargeText,
}) => {
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'T' | 'H' | 'C'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentMidTermField = semester === 'HK1' ? 'giuaKy1' : 'giuaKy2';
  const currentFinalTermField = semester === 'HK1' ? 'cuoiKy1' : 'cuoiKy2';

  // Helper to generate full parent message for Zalo
  const generateZaloMessage = (student: Student, rec?: AssessmentRecord) => {
    const finalGrade = rec?.[currentFinalTermField] || rec?.[currentMidTermField] || rec?.dgtx1 || 'H';
    const stars = rec?.stars || 0;
    const comment = rec?.comment || 'Tích cực tham gia giờ học, hòa đồng cùng các bạn.';

    let levelTitle = 'Hoàn thành';
    let suggestion = 'Gia đình tiếp tục khuyến khích con ca hát vui tươi mỗi ngày.';

    if (finalGrade === 'T') {
      levelTitle = 'Hoàn thành TỐT (Xuất sắc)';
      suggestion = 'Con có năng khiếu âm nhạc, hát đúng cao độ và biểu diễn tự tin. Gia đình có thể tạo điều kiện cho con tham gia đội văn nghệ hoặc học thêm nhạc cụ.';
    } else if (finalGrade === 'C') {
      levelTitle = 'Chưa hoàn thành (Cần hỗ trợ)';
      suggestion = 'Con còn nhút nhát và chưa nắm vững nhịp phách/cao độ. Cô kính nhờ ba mẹ nhắc nhở con nghe lại bài hát và vỗ tay theo nhịp ở nhà 10 phút mỗi ngày.';
    }

    return `Kính gửi Quý Phụ huynh em ${student.name} (Lớp ${classNameStr} - Trường TH Khai Minh),
Cô giáo bộ môn Âm nhạc xin gửi nhận xét ${semester} của con:
- Kết quả đánh giá môn Âm nhạc: Mức [${finalGrade}] - ${levelTitle}.
- Điểm thưởng nề nếp tiết học: ${stars} ⭐
- Lời nhận xét của cô giáo: "${comment}"
- Lời dặn dò: ${suggestion}

Trân trọng cảm ơn sự phối hợp của Quý Phụ huynh!
--- Cô Giáo Âm Nhạc TH Khai Minh ---`;
  };

  const handleCopy = (student: Student, rec?: AssessmentRecord) => {
    const msg = generateZaloMessage(student, rec);
    navigator.clipboard.writeText(msg);
    setCopiedId(student.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter students
  const filtered = students.filter((s) => {
    if (filterLevel === 'ALL') return true;
    const rec = assessments[s.id];
    const grade = rec?.[currentFinalTermField] || rec?.[currentMidTermField] || rec?.dgtx1 || '';
    return grade === filterLevel;
  });

  return (
    <div className={`space-y-6 ${isLargeText ? 'text-base' : 'text-sm'}`}>
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-700 text-white font-black text-xs rounded-lg">
              TƯƠNG TÁC PHỤ HUYNH
            </span>
            <span className="text-slate-500 font-medium text-xs">
              Lớp {classNameStr} • {semester}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Gửi Nhận Xét Chuẩn Thông Tư 27 Qua Zalo / Smas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Tự động tạo mẫu tin nhắn gửi phụ huynh chuyên nghiệp, hỗ trợ lọc riêng học sinh chưa hoàn thành (C) để phối hợp rèn luyện.
          </p>
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Lọc theo mức:</span>
          {(['ALL', 'T', 'H', 'C'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                filterLevel === lvl
                  ? lvl === 'T'
                    ? 'bg-emerald-600 text-white'
                    : lvl === 'H'
                    ? 'bg-blue-600 text-white'
                    : lvl === 'C'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl === 'ALL' ? 'Tất cả' : `Mức ${lvl}`}
            </button>
          ))}
        </div>
      </div>

      {/* Cards of Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((s) => {
          const rec = assessments[s.id];
          const grade = rec?.[currentFinalTermField] || rec?.[currentMidTermField] || rec?.dgtx1 || 'H';
          const isCopied = copiedId === s.id;

          return (
            <div
              key={s.id}
              className={`bg-white rounded-2xl border p-4.5 shadow-xs transition-all flex flex-col justify-between ${
                grade === 'C'
                  ? 'border-rose-300 bg-rose-50/20'
                  : grade === 'T'
                  ? 'border-emerald-200'
                  : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <div className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <span>{s.name}</span>
                      <span className="text-xs font-normal text-slate-400 font-mono">
                        ({s.code})
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">{s.gender} • Lớp {classNameStr}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center text-white shadow-xs ${
                        grade === 'T'
                          ? 'bg-emerald-600'
                          : grade === 'H'
                          ? 'bg-blue-600'
                          : 'bg-rose-600'
                      }`}
                    >
                      {grade}
                    </span>
                  </div>
                </div>

                {/* Comment Editor */}
                <div className="mt-3 space-y-2">
                  <div className="text-xs font-semibold text-slate-500">
                    Lời nhận xét học bạ / tin nhắn:
                  </div>
                  <textarea
                    rows={2}
                    value={rec?.comment || ''}
                    onChange={(e) =>
                      onUpdateAssessment(s.id, { comment: e.target.value })
                    }
                    placeholder="Nhập nhận xét chi tiết cho học sinh..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-amber-700 font-bold flex items-center gap-1">
                  <span>Thi đua:</span>
                  <span>⭐ {rec?.stars || 0}</span>
                </div>

                <button
                  onClick={() => handleCopy(s, rec)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Đã Sao Chép Zalo' : 'Sao Chép Mẫu Zalo'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
