export type AssessmentLevel = 'T' | 'H' | 'C' | '';

export interface Student {
  id: string;
  code: string;
  name: string;
  gender: 'Nam' | 'Nữ';
  dob?: string;
  classId: string;
  avatarSeed?: string;
}

export interface AssessmentRecord {
  studentId: string;
  classId: string;
  // Đánh giá thường xuyên
  dgtx1: AssessmentLevel; // Hát đúng giai điệu, lời ca
  dgtx2: AssessmentLevel; // Gõ đệm / Nhạc cụ gõ
  dgtx3: AssessmentLevel; // Đọc nhạc / Vận động cơ thể
  // Đánh giá định kỳ
  giuaKy1: AssessmentLevel;
  cuoiKy1: AssessmentLevel;
  giuaKy2: AssessmentLevel;
  cuoiKy2: AssessmentLevel;
  // Nhận xét giáo viên
  comment: string;
  // Nốt nhạc sao thi đua (thưởng)
  stars: number;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  classId: string;
  statuses: Record<string, 'present' | 'excused' | 'unexcused'>; // studentId -> status
}

export interface MusicMaterial {
  id: string;
  title: string;
  grade: number; // 1, 2, 3, 4
  category: 'beat' | 'sheet' | 'video' | 'lesson_plan' | 'instrument';
  description: string;
  url: string;
  tags: string[];
}

export interface ClassInfo {
  id: string;
  grade: number;
  name: string;
  studentCount: number;
}

export interface GoogleSheetsConfig {
  scriptUrl: string;
  spreadsheetId?: string;
  lastSyncedAt?: string;
  isConnected: boolean;
}
