import { ClassInfo, Student, AssessmentRecord, MusicMaterial } from '../types';

export const TEACHER_CLASSES: ClassInfo[] = [
  // Khối 1
  { id: '1-4', grade: 1, name: '1/4', studentCount: 32 },
  { id: '1-6', grade: 1, name: '1/6', studentCount: 30 },
  // Khối 2: 2/1 đến 2/9 trừ 2/5
  { id: '2-1', grade: 2, name: '2/1', studentCount: 34 },
  { id: '2-2', grade: 2, name: '2/2', studentCount: 33 },
  { id: '2-3', grade: 2, name: '2/3', studentCount: 32 },
  { id: '2-4', grade: 2, name: '2/4', studentCount: 31 },
  { id: '2-6', grade: 2, name: '2/6', studentCount: 34 },
  { id: '2-7', grade: 2, name: '2/7', studentCount: 32 },
  { id: '2-8', grade: 2, name: '2/8', studentCount: 30 },
  { id: '2-9', grade: 2, name: '2/9', studentCount: 33 },
  // Khối 3: 3/1, 3/2, 3/3, 3/9
  { id: '3-1', grade: 3, name: '3/1', studentCount: 35 },
  { id: '3-2', grade: 3, name: '3/2', studentCount: 34 },
  { id: '3-3', grade: 3, name: '3/3', studentCount: 33 },
  { id: '3-9', grade: 3, name: '3/9', studentCount: 34 },
  // Khối 4: 4/1 đến 4/8 trừ 4/2, 4/5 (4/1, 4/3, 4/4, 4/6, 4/7, 4/8)
  { id: '4-1', grade: 4, name: '4/1', studentCount: 35 },
  { id: '4-3', grade: 4, name: '4/3', studentCount: 34 },
  { id: '4-4', grade: 4, name: '4/4', studentCount: 33 },
  { id: '4-6', grade: 4, name: '4/6', studentCount: 35 },
  { id: '4-7', grade: 4, name: '4/7', studentCount: 34 },
  { id: '4-8', grade: 4, name: '4/8', studentCount: 32 },
];

const sampleFirstNames = [
  'Nguyễn Văn', 'Trần Thị', 'Lê Hoàng', 'Phạm Minh', 'Hoàng Gia', 
  'Võ Ngọc', 'Đặng Thảo', 'Bùi Đức', 'Đỗ Quỳnh', 'Hồ Bảo', 
  'Ngô Anh', 'Dương Gia', 'Lý Quốc', 'Vũ Khánh', 'Trịnh Nhật'
];

const sampleLastNamesMale = [
  'An', 'Bảo', 'Cường', 'Dũng', 'Đức', 'Hải', 'Hiếu', 'Huy', 'Khoa', 
  'Kiên', 'Long', 'Minh', 'Nam', 'Nghĩa', 'Phúc', 'Quân', 'Thành', 'Tuấn'
];

const sampleLastNamesFemale = [
  'Anh', 'Châu', 'Chi', 'Dung', 'Hà', 'Hân', 'Hương', 'Linh', 'Mai', 
  'My', 'Ngân', 'Ngọc', 'Nhi', 'Phương', 'Quỳnh', 'Thảo', 'Trang', 'Vy'
];

export function generateInitialStudentsForClass(classId: string, count: number): Student[] {
  const students: Student[] = [];
  for (let i = 1; i <= count; i++) {
    const isFemale = i % 2 === 0;
    const first = sampleFirstNames[(i * 3 + classId.charCodeAt(0)) % sampleFirstNames.length];
    const last = isFemale 
      ? sampleLastNamesFemale[(i * 2 + classId.length) % sampleLastNamesFemale.length]
      : sampleLastNamesMale[(i * 5 + classId.length) % sampleLastNamesMale.length];
    const code = `KM-${classId.replace('-', '')}-${i < 10 ? '0' + i : i}`;
    
    students.push({
      id: `${classId}-${i}`,
      code,
      name: `${first} ${last}`,
      gender: isFemale ? 'Nữ' : 'Nam',
      classId,
    });
  }
  return students;
}

export function generateInitialAssessments(students: Student[], classId: string): Record<string, AssessmentRecord> {
  const records: Record<string, AssessmentRecord> = {};
  students.forEach((s, idx) => {
    // Generate realistic TT27 distribution: mainly T and H, occasional C
    const rand = (idx * 17) % 100;
    let tLevel: 'T' | 'H' | 'C' = 'H';
    if (rand < 40) tLevel = 'T';
    else if (rand > 92) tLevel = 'C';

    const comments = {
      T: 'Hát đúng cao độ, giai điệu trong trẻo, biểu diễn tự tin trước lớp.',
      H: 'Thuộc lời ca, hát đúng nhịp phách, tích cực tham gia gõ đệm.',
      C: 'Hát còn nhỏ, cần rèn luyện thêm về nhịp điệu và phối hợp gõ phách.',
    };

    records[s.id] = {
      studentId: s.id,
      classId,
      dgtx1: tLevel,
      dgtx2: rand < 30 ? 'T' : (rand > 90 ? 'C' : 'H'),
      dgtx3: rand < 45 ? 'T' : 'H',
      giuaKy1: tLevel,
      cuoiKy1: tLevel === 'C' ? 'H' : tLevel,
      giuaKy2: '',
      cuoiKy2: '',
      comment: comments[tLevel],
      stars: Math.floor((rand % 5) + 1),
    };
  });
  return records;
}

export const INITIAL_MATERIALS: MusicMaterial[] = [
  {
    id: 'mat-1',
    title: 'Beat chuẩn: Quốc ca Việt Nam (Tiến quân ca)',
    grade: 1,
    category: 'beat',
    description: 'Bản phối chuẩn chào cờ, nhịp 2/4 hùng tráng cho học sinh khối 1-4',
    url: 'https://example.com/audio/quoc-ca.mp3',
    tags: ['Nghi thức', 'Chào cờ', 'Khối 1-4'],
  },
  {
    id: 'mat-2',
    title: 'Bài hát: Em yêu trường em (Nhạc & Lời: Hoàng Vân)',
    grade: 2,
    category: 'sheet',
    description: 'Kèm ký âm nốt nhạc, lời ca và gợi ý gõ đệm thanh phách cho lớp 2',
    url: 'https://example.com/sheet/em-yeu-truong-em.pdf',
    tags: ['Khối 2', 'Bài hát', 'Gõ đệm'],
  },
  {
    id: 'mat-3',
    title: 'Video hướng dẫn: Vận động phụ họa "Múa đàn"',
    grade: 3,
    category: 'video',
    description: 'Video múa mẫu các động tác tay và nghiêng mình theo phách',
    url: 'https://example.com/video/mua-dan.mp4',
    tags: ['Khối 3', 'Phụ họa', 'Thực hành'],
  },
  {
    id: 'mat-4',
    title: 'Tài liệu hướng dẫn thổi Kèn phím Melodion / Sáo Recorder',
    grade: 4,
    category: 'instrument',
    description: 'Kỹ thuật bấm các nốt Đồ - Rê - Mi - Pha - Son cơ bản theo SGK Chân trời sáng tạo',
    url: 'https://example.com/doc/ken-phim-lop-4.pdf',
    tags: ['Khối 4', 'Nhạc cụ', 'Melodion'],
  },
  {
    id: 'mat-5',
    title: 'Kế hoạch bài dạy (Giáo án) môn Âm nhạc Học kỳ 1 & 2',
    grade: 1,
    category: 'lesson_plan',
    description: 'Soạn theo Công văn 2345/BGDĐT, chuẩn Thông tư 27 đánh giá thường xuyên',
    url: 'https://example.com/giao-an/am-nhac-tieu-hoc.docx',
    tags: ['Giáo án', 'CV 2345', 'Khai Minh'],
  },
];
