import React, { useState } from 'react';
import { GoogleSheetsConfig, Student, AssessmentRecord } from '../types';
import { APPS_SCRIPT_TEMPLATE } from '../services/storageService';
import { 
  FileSpreadsheet, 
  Cloud, 
  CloudOff, 
  Copy, 
  Check, 
  ArrowUpRight, 
  RefreshCw, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface SyncPanelProps {
  config: GoogleSheetsConfig;
  onSaveConfig: (cfg: GoogleSheetsConfig) => void;
  students: Student[];
  assessments: Record<string, AssessmentRecord>;
  classNameStr: string;
  isLargeText: boolean;
}

export const SyncPanel: React.FC<SyncPanelProps> = ({
  config,
  onSaveConfig,
  students,
  assessments,
  classNameStr,
  isLargeText,
}) => {
  const [scriptUrl, setScriptUrl] = useState(config.scriptUrl || '');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    type: 'success' | 'error' | 'idle';
    msg: string;
  }>({ type: 'idle', msg: '' });

  const handleCopyScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSaveUrl = () => {
    const isConn = Boolean(scriptUrl.trim().startsWith('https://script.google.com'));
    onSaveConfig({
      ...config,
      scriptUrl: scriptUrl.trim(),
      isConnected: isConn,
      lastSyncedAt: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN'),
    });
    setSyncStatus({
      type: isConn ? 'success' : 'error',
      msg: isConn
        ? 'Đã lưu URL Web App Google Apps Script thành công!'
        : 'Vui lòng nhập đúng định dạng URL: https://script.google.com/...',
    });
  };

  const handleTestAndSync = async () => {
    if (!scriptUrl.trim()) {
      setSyncStatus({
        type: 'error',
        msg: 'Vui lòng dán Web App URL của Google Apps Script trước khi đồng bộ.',
      });
      return;
    }

    setIsSyncing(true);
    setSyncStatus({ type: 'idle', msg: '' });

    try {
      // Prepare payload to send to Google Sheets
      const classAssessments = students.map((s) => {
        const rec = assessments[s.id] || {} as AssessmentRecord;
        return {
          studentCode: s.code,
          className: classNameStr,
          studentName: s.name,
          dgtx1: rec.dgtx1 || '',
          dgtx2: rec.dgtx2 || '',
          dgtx3: rec.dgtx3 || '',
          giuaKy1: rec.giuaKy1 || '',
          cuoiKy1: rec.cuoiKy1 || '',
          giuaKy2: rec.giuaKy2 || '',
          cuoiKy2: rec.cuoiKy2 || '',
          comment: rec.comment || '',
          stars: rec.stars || 0,
        };
      });

      // Call Google Apps Script Web App
      // Using fetch with no-cors or JSONP pattern standard for GAS
      await fetch(scriptUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'syncAssessments',
          className: classNameStr,
          records: classAssessments,
          timestamp: new Date().toISOString(),
        }),
      });

      const nowStr = new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN');
      onSaveConfig({
        ...config,
        scriptUrl: scriptUrl.trim(),
        isConnected: true,
        lastSyncedAt: nowStr,
      });

      setSyncStatus({
        type: 'success',
        msg: `Đồng bộ thành công ${classAssessments.length} học sinh Lớp ${classNameStr} lên Google Sheets lúc ${nowStr}!`,
      });
    } catch (err) {
      setSyncStatus({
        type: 'error',
        msg: 'Lỗi đồng bộ. Hãy kiểm tra URL Apps Script và đảm bảo đã cấp quyền "Anyone" (Mọi người) khi Deploy Web App.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Export full JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      app: 'SoTayAmNhac_KhaiMinh',
      exportDate: new Date().toISOString(),
      students,
      assessments,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Backup_SoTayAmNhac_KhaiMinh_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${isLargeText ? 'text-base' : 'text-sm'}`}>
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-700 text-white font-black text-xs rounded-lg flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>GOOGLE SHEETS DATABASE</span>
            </span>
            <span className="text-slate-500 font-medium text-xs">
              Backend trung tâm • Google Apps Script API
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Đồng Bộ Bảng Điểm Lên Google Sheets
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Dữ liệu được lưu vĩnh viễn trên tài khoản Google cá nhân của cô giáo, không lo mất mát, dễ dàng chia sẻ báo cáo cho nhà trường.
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-2">
          {config.isConnected ? (
            <div className="px-3 py-1.5 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã kết nối Google Sheets</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-amber-100 border border-amber-300 rounded-xl text-amber-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Chưa liên kết Google Sheets</span>
            </div>
          )}
        </div>
      </div>

      {syncStatus.msg && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
            syncStatus.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          {syncStatus.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{syncStatus.msg}</span>
        </div>
      )}

      {/* Grid: Setup API Web App URL & Apps Script Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Configuration Form */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Cloud className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-slate-800 text-base">
              Cấu Hình Đường Dẫn Web App (Google Apps Script)
            </h3>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Dán Web App URL của cô vào đây:
            </label>
            <input
              type="url"
              value={scriptUrl}
              onChange={(e) => setScriptUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Được sinh ra sau khi bấm "Triển khai (Deploy) &gt; Tùy chọn triển khai mới &gt; Ứng dụng web" trên Google Sheet.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSaveUrl}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Lưu cấu hình
            </button>

            <button
              onClick={handleTestAndSync}
              disabled={isSyncing}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-xs active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ lớp hiện tại lên Sheets'}</span>
            </button>
          </div>

          {config.lastSyncedAt && (
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
              Lần đồng bộ gần nhất: <strong>{config.lastSyncedAt}</strong>
            </div>
          )}

          {/* Backup offline options */}
          <div className="pt-4 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700 mb-2">
              Sao lưu & Phục hồi dữ liệu ngoại tuyến (Offline Backup):
            </div>
            <button
              onClick={handleExportBackup}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Tải file dự phòng toàn bộ sổ điểm (.JSON)</span>
            </button>
          </div>
        </div>

        {/* Right: Step-by-step Setup Guide */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-slate-800 text-base">
                Hướng Dẫn 4 Bước Cực Dễ Tạo Database Google Sheets
              </h3>
            </div>
            <button
              onClick={handleCopyScript}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold rounded-lg text-xs transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Đã sao chép mã' : 'Sao chép mã Apps Script'}</span>
            </button>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
              <strong className="text-blue-900 block mb-1">
                Bước 1: Tạo Google Sheet mới
              </strong>
              Vào trang <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold">sheets.new</a> trên trình duyệt và đặt tên file: <em>"Sổ Điểm Âm Nhạc TH Khai Minh"</em>.
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-800 block mb-1">
                Bước 2: Mở Tiện ích mở rộng &gt; Apps Script
              </strong>
              Trên thanh menu của Google Sheets, chọn <strong>Tiện ích mở rộng (Extensions)</strong> &gt; <strong>Apps Script</strong>.
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-800 block mb-1">
                Bước 3: Dán đoạn mã đã sao chép
              </strong>
              Xóa code mặc định trong file <code>Code.gs</code>, dán toàn bộ mã nguồn vừa bấm sao chép ở nút trên, sau đó bấm biểu tượng <strong>Lưu (Save)</strong>.
            </div>

            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
              <strong className="text-emerald-900 block mb-1">
                Bước 4: Triển khai thành Web App & Lấy link
              </strong>
              Bấm nút <strong>Triển khai (Deploy)</strong> ở góc trên bên phải &gt; Chọn <strong>Tùy chọn triển khai mới (New deployment)</strong> &gt; Chọn loại <strong>Ứng dụng web (Web app)</strong>.
              <br />
              - Ai có quyền truy cập (Who has access): Chọn <strong>Bất kỳ ai (Anyone)</strong>.
              <br />
              - Bấm Triển khai và copy đường link kết thúc bằng <code>/exec</code> dán vào ô bên trái!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
