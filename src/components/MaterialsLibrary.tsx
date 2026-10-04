import React, { useState } from 'react';
import { MusicMaterial } from '../types';
import { 
  FolderArchive, 
  Music, 
  FileText, 
  Video, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Filter, 
  Search,
  Sparkles
} from 'lucide-react';

interface MaterialsLibraryProps {
  materials: MusicMaterial[];
  onAddMaterial: (mat: Omit<MusicMaterial, 'id'>) => void;
  onDeleteMaterial: (id: string) => void;
  isLargeText: boolean;
}

export const MaterialsLibrary: React.FC<MaterialsLibraryProps> = ({
  materials,
  onAddMaterial,
  onDeleteMaterial,
  isLargeText,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New form state
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState(1);
  const [category, setCategory] = useState<'beat' | 'sheet' | 'video' | 'lesson_plan' | 'instrument'>('beat');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [tagInput, setTagInput] = useState('');

  const filtered = materials.filter((m) => {
    if (selectedGrade !== 'ALL' && m.grade !== selectedGrade) return false;
    if (selectedCategory !== 'ALL' && m.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddMaterial({
      title: title.trim(),
      grade: Number(grade),
      category,
      description: description.trim(),
      url: url.trim() || 'https://example.com',
      tags: tagInput.split(',').map(t => t.trim()).filter(Boolean),
    });

    setTitle('');
    setDescription('');
    setUrl('');
    setTagInput('');
    setIsModalOpen(false);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'beat':
        return <Music className="w-5 h-5 text-amber-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-rose-500" />;
      case 'lesson_plan':
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <FolderArchive className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className={`space-y-6 ${isLargeText ? 'text-base' : 'text-sm'}`}>
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-700 text-white font-black text-xs rounded-lg">
              KHO HỌC LIỆU ÂM NHẠC
            </span>
            <span className="text-slate-500 font-medium text-xs">
              Trường TH Khai Minh • Khối 1, 2, 3, 4
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Kho Bản Nhạc, Beat Chuẩn & Giáo Án Bộ Môn
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Lưu trữ beat karaoke bài hát, video múa mẫu, hướng dẫn kèn phím Melodion, sáo Recorder và giáo án CV 2345.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Học Liệu Mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên bài hát, nốt nhạc, giáo án..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Grade filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <span className="text-slate-500 px-2 text-[11px]">Khối:</span>
          {(['ALL', 1, 2, 3, 4] as const).map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedGrade === g
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g === 'ALL' ? 'Tất cả' : `Khối ${g}`}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {(['ALL', 'beat', 'sheet', 'video', 'instrument', 'lesson_plan'] as const).map((c) => {
            const labels: Record<string, string> = {
              ALL: 'Tất cả',
              beat: 'Beat nhạc',
              sheet: 'Bản nốt',
              video: 'Video múa',
              instrument: 'Nhạc cụ',
              lesson_plan: 'Giáo án',
            };
            return (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedCategory === c
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {labels[c]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((mat) => (
          <div
            key={mat.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    {getCategoryIcon(mat.category)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      Khối {mat.grade}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm mt-1 line-clamp-2">
                      {mat.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteMaterial(mat.id)}
                  className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                  title="Xóa tài liệu"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500 mt-3 line-clamp-3">
                {mat.description}
              </p>

              {mat.tags && mat.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {mat.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 capitalize">
                {mat.category}
              </span>
              <a
                href={mat.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs transition-colors"
              >
                <span>Mở tài liệu</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-lg">
                Thêm Học Liệu Giảng Dạy Mới
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tên tài liệu / Bài hát: *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Beat bài hát Em yêu trường em"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Khối lớp:
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  >
                    <option value={1}>Khối 1</option>
                    <option value={2}>Khối 2</option>
                    <option value={3}>Khối 3</option>
                    <option value={4}>Khối 4</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Phân loại:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                  >
                    <option value="beat">Beat nhạc / MP3</option>
                    <option value="sheet">Bản nốt nhạc / PDF</option>
                    <option value="video">Video múa mẫu</option>
                    <option value="instrument">Hướng dẫn nhạc cụ</option>
                    <option value="lesson_plan">Kế hoạch bài dạy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Đường dẫn (Link file / Google Drive / Youtube):
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mô tả / Hướng dẫn học sinh:
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ghi chú hướng dẫn..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Từ khóa (phân cách bằng dấu phẩy):
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Ví dụ: Bài hát, Thanh phách, HK1"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all"
                >
                  Lưu Tài Liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
