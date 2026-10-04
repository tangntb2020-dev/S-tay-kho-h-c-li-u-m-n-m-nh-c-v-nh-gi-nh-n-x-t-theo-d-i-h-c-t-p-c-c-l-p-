import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { 
  Dices, 
  Sparkles, 
  RotateCw, 
  Users, 
  Award, 
  Mic2, 
  Volume2, 
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface RandomPickerProps {
  classNameStr: string;
  students: Student[];
  isLargeText: boolean;
}

export const RandomPicker: React.FC<RandomPickerProps> = ({
  classNameStr,
  students,
  isLargeText,
}) => {
  const [pickMode, setPickMode] = useState<1 | 2 | 4>(1);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [calledHistory, setCalledHistory] = useState<Student[]>([]);
  const [currentDisplayName, setCurrentDisplayName] = useState<string>('Bấm để bắt đầu!');
  const [drumEffect, setDrumEffect] = useState(false);

  // Simple web audio tone generator for excitement
  const playChime = (pitch: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  const playFanfare = () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      setTimeout(() => playChime(freq), idx * 120);
    });
  };

  const handleStartPick = () => {
    if (students.length === 0 || isRolling) return;
    setIsRolling(true);
    setDrumEffect(true);

    // Eligible candidates (prioritize not yet called in this session)
    const calledIds = new Set(calledHistory.map(c => c.id));
    let pool = students.filter(s => !calledIds.has(s.id));
    if (pool.length < pickMode) {
      // Reset history if pool is exhausted
      pool = [...students];
      setCalledHistory([]);
    }

    let iterations = 0;
    const maxIterations = 25;
    const interval = setInterval(() => {
      iterations++;
      const randomCandidate = students[Math.floor(Math.random() * students.length)];
      setCurrentDisplayName(randomCandidate.name);
      playChime(300 + (iterations * 15));

      if (iterations >= maxIterations) {
        clearInterval(interval);
        // Final select
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        const finalPicks = shuffled.slice(0, pickMode);
        setSelectedStudents(finalPicks);
        setCalledHistory(prev => [...finalPicks, ...prev]);
        setIsRolling(false);
        setDrumEffect(false);
        playFanfare();
      }
    }, 80);
  };

  const handleResetHistory = () => {
    setCalledHistory([]);
    setSelectedStudents([]);
    setCurrentDisplayName('Bấm để bắt đầu!');
  };

  return (
    <div className={`space-y-6 ${isLargeText ? 'text-base' : 'text-sm'}`}>
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-500 text-white font-black text-xs rounded-lg">
              BỐC THĂM VUI VẺ
            </span>
            <span className="text-slate-500 font-medium text-xs">
              Lớp {classNameStr} • {students.length} học sinh
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Vòng Quay Gọi Tên Trả Bài & Biểu Diễn Âm Nhạc
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Giúp giờ học thêm sôi nổi, bốc thăm ngẫu nhiên công bằng, không lặp lại học sinh đã gọi.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setPickMode(1)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              pickMode === 1 ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Mic2 className="w-3.5 h-3.5" />
            <span>1 Em (Đơn Ca / Bài Cũ)</span>
          </button>
          <button
            onClick={() => setPickMode(2)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              pickMode === 2 ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2 Em (Song Ca)</span>
          </button>
          <button
            onClick={() => setPickMode(4)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              pickMode === 4 ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>4 Em (Tổ Gõ Đệm)</span>
          </button>
        </div>
      </div>

      {/* Main Wheel / Stage Display */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-950 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
        {/* Decorative notes */}
        <div className="absolute top-4 left-6 text-3xl opacity-20 select-none animate-bounce">
          🎵
        </div>
        <div className="absolute top-12 right-10 text-4xl opacity-20 select-none animate-pulse">
          🎶
        </div>
        <div className="absolute bottom-6 left-12 text-4xl opacity-20 select-none animate-pulse">
          🎼
        </div>

        <div className="max-w-xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>
              {isRolling ? 'ĐANG QUAY SỐ HỒI HỘP...' : 'SÂN KHẤU ÂM NHẠC KHAI MINH'}
            </span>
          </div>

          {/* Center Box with animated glowing name */}
          <div
            className={`min-h-[140px] flex items-center justify-center p-6 rounded-2xl bg-white/10 backdrop-blur-xl border-2 transition-all duration-150 ${
              drumEffect
                ? 'border-amber-400 scale-105 shadow-2xl shadow-amber-500/40 bg-white/20'
                : 'border-white/20 shadow-inner'
            }`}
          >
            {isRolling ? (
              <div className="text-3xl sm:text-5xl font-black text-amber-300 tracking-tight animate-pulse">
                {currentDisplayName}
              </div>
            ) : selectedStudents.length > 0 ? (
              <div className="space-y-3">
                <div className="text-xs text-blue-200 uppercase font-bold tracking-widest">
                  Chúc mừng các em lên bảng biểu diễn!
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {selectedStudents.map((s) => (
                    <div
                      key={s.id}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xl sm:text-2xl rounded-2xl shadow-lg shadow-amber-500/30 flex items-center gap-2"
                    >
                      <span>🎤 {s.name}</span>
                      <span className="text-xs bg-slate-950 text-white px-2 py-0.5 rounded-md font-mono">
                        {s.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-100">
                Sẵn sàng bốc thăm học sinh!
              </div>
            )}
          </div>

          {/* Big action button */}
          <div>
            <button
              onClick={handleStartPick}
              disabled={isRolling}
              className={`px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-black text-lg sm:text-xl uppercase tracking-wider shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 mx-auto ${
                isRolling
                  ? 'bg-slate-600 text-slate-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 hover:brightness-110 shadow-amber-500/30 cursor-pointer scale-100 hover:scale-105'
              }`}
            >
              <Dices className={`w-7 h-7 ${isRolling ? 'animate-spin' : ''}`} />
              <span>{isRolling ? 'Đang Chọn...' : 'QUAY TÊN NGAY!'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* History of Called Students */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-800 text-base">
              Học Sinh Đã Được Gọi Trong Tiết Này ({calledHistory.length} em)
            </h3>
          </div>
          {calledHistory.length > 0 && (
            <button
              onClick={handleResetHistory}
              className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Xóa lịch sử gọi</span>
            </button>
          )}
        </div>

        {calledHistory.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            Chưa có học sinh nào được gọi trong tiết học này.
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {calledHistory.map((s, idx) => (
              <span
                key={s.id + idx}
                className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5"
              >
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {calledHistory.length - idx}
                </span>
                <span>{s.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">({s.code})</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
