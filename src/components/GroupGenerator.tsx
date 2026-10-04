import React, { useState } from 'react';
import { Student } from '../types';
import { 
  Users, 
  Shuffle, 
  Copy, 
  Check, 
  Printer, 
  Music, 
  Volume2, 
  Sparkles 
} from 'lucide-react';

interface GroupGeneratorProps {
  classNameStr: string;
  students: Student[];
  isLargeText: boolean;
}

const MUSIC_ROLES = [
  {
    role: 'Hát Lĩnh Xướng & Hòa Giọng',
    icon: '🎤',
    color: 'from-blue-600 to-indigo-700',
    desc: 'Hát chuẩn cao độ, phát âm tròn vành rõ chữ',
  },
  {
    role: 'Gõ Đệm Thanh Phách & Song Loan',
    icon: '🪵',
    color: 'from-amber-600 to-orange-700',
    desc: 'Gõ đúng tiết tấu bài hát theo phách mạnh / phách nhẹ',
  },
  {
    role: 'Vận Động Cơ Thể & Múa Phụ Họa',
    icon: '💃',
    color: 'from-pink-600 to-rose-700',
    desc: 'Vỗ tay, dậm chân, vỗ đùi (body percussion) nhịp nhàng',
  },
  {
    role: 'Kèn Phím Melodion & Sáo Recorder',
    icon: '🎹',
    color: 'from-emerald-600 to-teal-700',
    desc: 'Bấm đúng nốt Đồ - Rê - Mi - Pha - Son hòa tấu',
  },
  {
    role: 'Trống Nhỏ & Chuông Tam Giác (Triangle)',
    icon: '🥁',
    color: 'from-purple-600 to-violet-700',
    desc: 'Gõ báo hiệu chuyển đoạn và giữ nhịp dồn',
  },
  {
    role: 'Ban Giám Khảo Nhí & Cổ Vũ',
    icon: '⭐',
    color: 'from-cyan-600 to-blue-700',
    desc: 'Lắng nghe, nhận xét và giơ cờ hoa chấm điểm bạn',
  },
];

export const GroupGenerator: React.FC<GroupGeneratorProps> = ({
  classNameStr,
  students,
  isLargeText,
}) => {
  const [groupCount, setGroupCount] = useState<number>(4);
  const [groups, setGroups] = useState<Student[][]>([]);
  const [copied, setCopied] = useState(false);

  // Generate groups randomly
  const handleGenerateGroups = () => {
    if (students.length === 0) return;
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    const newGroups: Student[][] = Array.from({ length: groupCount }, () => []);

    shuffled.forEach((student, index) => {
      const targetGroupIndex = index % groupCount;
      newGroups[targetGroupIndex].push(student);
    });

    setGroups(newGroups);
  };

  const handleCopyGroups = () => {
    if (groups.length === 0) return;
    let text = `DANH SÁCH NHÓM HỌC TẬP ÂM NHẠC - LỚP ${classNameStr}\n\n`;
    groups.forEach((grp, idx) => {
      const role = MUSIC_ROLES[idx % MUSIC_ROLES.length];
      text += `--- NHÓM ${idx + 1}: ${role.role} (${grp.length} em) ---\n`;
      grp.forEach((s, sIdx) => {
        text += `${sIdx + 1}. ${s.name} (${s.code})\n`;
      });
      text += '\n';
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`space-y-6 ${isLargeText ? 'text-base' : 'text-sm'}`}>
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-600 text-white font-black text-xs rounded-lg">
              HOẠT ĐỘNG NHÓM
            </span>
            <span className="text-slate-500 font-medium text-xs">
              Lớp {classNameStr} • {students.length} học sinh
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Tạo Nhóm Luyện Tập & Phân Vai Nhạc Cụ
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Tự động chia nhóm ngẫu nhiên công bằng, phân bổ vai trò gõ đệm, hát bè, vận động cơ thể.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-600 pl-2">Số lượng nhóm:</span>
            {[2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => setGroupCount(num)}
                className={`w-8 h-8 rounded-lg font-black text-xs transition-all ${
                  groupCount === num
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerateGroups}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all active:scale-95"
          >
            <Shuffle className="w-4 h-4" />
            <span>Chia Nhóm Ngay</span>
          </button>

          {groups.length > 0 && (
            <button
              onClick={handleCopyGroups}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Groups View */}
      {groups.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Chưa tạo nhóm cho lớp {classNameStr}</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
              Chọn số lượng nhóm ở trên và bấm "Chia Nhóm Ngay" để hệ thống tự động bốc thăm xếp chỗ cho các em.
            </p>
          </div>
          <button
            onClick={handleGenerateGroups}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
          >
            Bắt đầu chia {groupCount} nhóm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((groupStudents, idx) => {
            const role = MUSIC_ROLES[idx % MUSIC_ROLES.length];
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col"
              >
                {/* Header with role */}
                <div className={`p-4 bg-gradient-to-r ${role.color} text-white`}>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-1.5">
                      <span>{role.icon}</span>
                      <span>NHÓM {idx + 1}</span>
                    </span>
                    <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                      {groupStudents.length} học sinh
                    </span>
                  </div>
                  <h4 className="font-extrabold text-base mt-1">{role.role}</h4>
                  <p className="text-[11px] text-white/80 mt-0.5 line-clamp-1">
                    {role.desc}
                  </p>
                </div>

                {/* Member roster */}
                <div className="p-3 divide-y divide-slate-100 flex-1 max-h-[320px] overflow-y-auto">
                  {groupStudents.map((s, sIdx) => (
                    <div
                      key={s.id}
                      className="py-2 px-1 flex items-center justify-between text-xs hover:bg-slate-50 rounded-lg px-2 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 text-center font-bold text-slate-400">
                          {sIdx + 1}
                        </span>
                        <span className="font-extrabold text-slate-800">{s.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {s.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
