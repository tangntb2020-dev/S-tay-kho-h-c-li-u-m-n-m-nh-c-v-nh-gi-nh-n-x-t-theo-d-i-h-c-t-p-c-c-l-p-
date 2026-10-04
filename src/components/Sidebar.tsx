import React from 'react';
import { 
  Music, 
  GraduationCap, 
  CalendarCheck, 
  Dices, 
  Users, 
  MessageSquareText, 
  FolderArchive, 
  FileSpreadsheet,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeClass: string;
  onOpenHelp: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeClass,
  onOpenHelp,
}) => {
  const menuItems = [
    {
      id: 'assessment',
      label: 'Sổ Điểm & Đánh Giá T-H-C',
      sublabel: 'Chuẩn Thông tư 27',
      icon: GraduationCap,
      badge: 'Cốt lõi',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'attendance',
      label: 'Điểm Danh & Nề Nếp',
      sublabel: 'Sao thi đua tiết học',
      icon: CalendarCheck,
    },
    {
      id: 'random',
      label: 'Bốc Thăm & Trả Bài Cũ',
      sublabel: 'Random gọi tên hát mẫu',
      icon: Dices,
      badge: 'Sôi nổi',
      badgeColor: 'bg-amber-100 text-amber-700',
    },
    {
      id: 'groups',
      label: 'Chia Nhóm Ngẫu Nhiên',
      sublabel: 'Thanh phách & Phụ họa',
      icon: Users,
    },
    {
      id: 'comments',
      label: 'Nhận Xét & Phụ Huynh',
      sublabel: 'Sao chép Zalo / Smas',
      icon: MessageSquareText,
    },
    {
      id: 'materials',
      label: 'Kho Tài Liệu & Beat Nhạc',
      sublabel: 'Melodion, Beat, Giáo án',
      icon: FolderArchive,
    },
    {
      id: 'sync',
      label: 'Google Sheets & Đồng Bộ',
      sublabel: 'Apps Script API trung tâm',
      icon: FileSpreadsheet,
      badge: 'Sheets',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-screen">
      {/* Brand header */}
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
            <Music className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight leading-tight">
              SỔ TAY ÂM NHẠC
            </h1>
            <p className="text-xs text-blue-100 font-medium">TH Khai Minh • TT 27</p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
          <span className="text-blue-100">Đang chọn lớp:</span>
          <span className="font-bold text-amber-300 bg-black/20 px-2.5 py-0.5 rounded-full border border-white/10">
            Lớp {activeClass.replace('-', '/')}
          </span>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
        <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Chức năng giảng dạy
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all font-medium text-sm ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-blue-600'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs truncate ${
                    isActive ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {item.sublabel}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer / Teacher profile */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/80">
        <button
          onClick={onOpenHelp}
          className="w-full mb-2 flex items-center justify-center gap-2 py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-sm"
        >
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span>Hướng dẫn sử dụng & TT 27</span>
        </button>

        <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-xs">
          <div className="font-semibold text-blue-900">Cô Giáo Âm Nhạc</div>
          <div className="text-slate-500 text-[11px]">
            20 lớp phụ trách (K1, K2, K3, K4)
          </div>
        </div>
      </div>
    </aside>
  );
};
