import React from 'react';
import { BookOpen, X, CheckCircle2, Award, Zap, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Quy Chuẩn Đánh Giá Môn Âm Nhạc (Thông Tư 27)
              </h3>
              <p className="text-xs text-slate-500">
                Trường Tiểu học Khai Minh • Năm học 2026 - 2027
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* TT27 Table Guide */}
        <div className="space-y-4 text-xs">
          <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">
            1. Các Mức Đánh Giá Học Sinh
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-emerald-50 border-2 border-emerald-200 rounded-2xl">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  T
                </span>
                <span className="font-extrabold text-emerald-900">Hoàn thành tốt</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Hát đúng giai điệu, lời ca trong sáng, biểu diễn tự tin. Gõ phách và đọc nhạc chuẩn xác, tích cực phát biểu.
              </p>
            </div>

            <div className="p-3.5 bg-blue-50 border-2 border-blue-200 rounded-2xl">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                  H
                </span>
                <span className="font-extrabold text-blue-900">Hoàn thành</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Thuộc lời bài hát, cơ bản hát đúng cao độ và tiết tấu. Biết tham gia hoạt động nhóm và sử dụng nhạc cụ gõ cơ bản.
              </p>
            </div>

            <div className="p-3.5 bg-rose-50 border-2 border-rose-200 rounded-2xl">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-6 rounded-lg bg-rose-600 text-white font-black text-xs flex items-center justify-center">
                  C
                </span>
                <span className="font-extrabold text-rose-900">Chưa hoàn thành</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Hát còn nhỏ, chệch nhịp, chưa nhớ lời ca hoặc chưa tập trung. Cần giáo viên hỗ trợ kèm cặp thêm sau giờ học.
              </p>
            </div>
          </div>
        </div>

        {/* 20 Classes Teacher Teaches */}
        <div className="space-y-2 text-xs">
          <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">
            2. Danh Sách 20 Lớp Phụ Trách Giảng Dạy
          </h4>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-slate-700">
            <div><strong>• Khối 1:</strong> Lớp 1/4, 1/6 (2 lớp)</div>
            <div><strong>• Khối 2:</strong> Lớp 2/1, 2/2, 2/3, 2/4, 2/6, 2/7, 2/8, 2/9 (8 lớp - không dạy 2/5)</div>
            <div><strong>• Khối 3:</strong> Lớp 3/1, 3/2, 3/3, 3/9 (4 lớp)</div>
            <div><strong>• Khối 4:</strong> Lớp 4/1, 4/3, 4/4, 4/6, 4/7, 4/8 (6 lớp - không dạy 4/2, 4/5)</div>
          </div>
        </div>

        {/* Tips for Elderly Teachers */}
        <div className="space-y-2 text-xs">
          <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>3. Mẹo Dành Riêng Cho Cô Giáo Tiết Kiệm Thời Gian</span>
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>
              <strong>Nút "Điền nhanh cả lớp = H":</strong> Hầu hết học sinh đạt mức Hoàn thành. Hãy bấm nút này trước, sau đó chỉ cần lướt chỉnh những em xuất sắc thành <strong>T</strong> hoặc các em yếu thành <strong>C</strong>.
            </li>
            <li>
              <strong>Chế độ Chữ to:</strong> Bấm nút <strong>"Chữ to"</strong> ở góc trên bên phải thanh tiêu đề nếu cần cỡ chữ to rõ ràng, không gây mỏi mắt.
            </li>
            <li>
              <strong>Lưu trữ offline an toàn:</strong> Dữ liệu tự động lưu trong máy tính/điện thoại của cô ngay cả khi mất mạng. Khi có mạng chỉ cần vào mục Google Sheets bấm "Đồng bộ".
            </li>
          </ul>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
          >
            Đã hiểu, quay lại sổ điểm
          </button>
        </div>
      </div>
    </div>
  );
};
