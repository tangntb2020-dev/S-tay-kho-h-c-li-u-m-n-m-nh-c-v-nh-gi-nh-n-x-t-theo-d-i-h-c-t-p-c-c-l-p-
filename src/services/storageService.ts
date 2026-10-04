import { Student, AssessmentRecord, AttendanceRecord, MusicMaterial, GoogleSheetsConfig } from '../types';
import { TEACHER_CLASSES, generateInitialStudentsForClass, generateInitialAssessments, INITIAL_MATERIALS } from '../data/mockData';

const STORAGE_KEYS = {
  STUDENTS: 'khai_minh_students',
  ASSESSMENTS: 'khai_minh_assessments',
  ATTENDANCE: 'khai_minh_attendance',
  MATERIALS: 'khai_minh_materials',
  SHEETS_CONFIG: 'khai_minh_sheets_config',
  SELECTED_CLASS: 'khai_minh_selected_class',
};

// Default Google Apps Script code for the teacher to copy-paste
export const APPS_SCRIPT_TEMPLATE = `/**
 * GOOGLE APPS SCRIPT CHO SỔ TAY ÂM NHẠC TRƯỜNG TIỂU HỌC KHAI MINH
 * Triển khai dưới dạng Web App (Deploy as Web App)
 * Execute as: Me (tài khoản của bạn)
 * Who has access: Anyone (Mọi người)
 */

function doGet(e) {
  const action = e.parameter.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === "getAllData") {
    const studentsSheet = getOrCreateSheet(ss, "DanhSachHocSinh", ["Mã học sinh", "Họ và tên", "Giới tính", "Lớp"]);
    const assessSheet = getOrCreateSheet(ss, "DiemSo_ThongTu27", ["Mã HS", "Lớp", "Họ tên", "ĐGTX 1", "ĐGTX 2", "ĐGTX 3", "Giữa HK1", "Cuối HK1", "Giữa HK2", "Cuối HK2", "Nhận xét", "Sao thi đua"]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Dữ liệu được tải thành công từ Google Sheets",
      data: {
        studentsCount: studentsSheet.getLastRow() - 1,
        assessCount: assessSheet.getLastRow() - 1
      }
    })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: "ok", app: "Sổ Tay Âm Nhạc Khai Minh" })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    if (action === "syncAssessments") {
      const sheet = getOrCreateSheet(ss, "DiemSo_ThongTu27", ["Mã HS", "Lớp", "Họ tên", "ĐGTX 1", "ĐGTX 2", "ĐGTX 3", "Giữa HK1", "Cuối HK1", "Giữa HK2", "Cuối HK2", "Nhận xét", "Sao thi đua"]);
      // Ghi hoặc cập nhật danh sách đánh giá
      const records = payload.records || [];
      records.forEach(rec => {
        sheet.appendRow([
          rec.studentCode,
          rec.className,
          rec.studentName,
          rec.dgtx1,
          rec.dgtx2,
          rec.dgtx3,
          rec.giuaKy1,
          rec.cuoiKy1,
          rec.giuaKy2,
          rec.cuoiKy2,
          rec.comment,
          rec.stars
        ]);
      });
      return ContentService.createTextOutput(JSON.stringify({ status: "success", count: records.length })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "syncAttendance") {
      const sheet = getOrCreateSheet(ss, "DiemDanh_NenNep", ["Ngày", "Lớp", "Mã HS", "Tên HS", "Trạng thái"]);
      const att = payload.attendance || [];
      att.forEach(item => {
        sheet.appendRow([payload.date, payload.className, item.code, item.name, item.status]);
      });
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "unknown_action" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e0f2fe");
  }
  return sheet;
}
`;

export const storageService = {
  // Init data if not present
  initializeData(): {
    students: Student[];
    assessments: Record<string, AssessmentRecord>;
    materials: MusicMaterial[];
    config: GoogleSheetsConfig;
  } {
    let students: Student[] = [];
    const storedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (storedStudents) {
      try {
        students = JSON.parse(storedStudents);
      } catch {
        students = [];
      }
    }

    if (!students || students.length === 0) {
      // Auto-generate for all classes of Cô
      TEACHER_CLASSES.forEach((c) => {
        const clsStudents = generateInitialStudentsForClass(c.id, c.studentCount);
        students.push(...clsStudents);
      });
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } else {
      // Check if any class in TEACHER_CLASSES is missing (e.g. newly added class like 3-9)
      let hasNewClass = false;
      TEACHER_CLASSES.forEach((c) => {
        const hasStudents = students.some(s => s.classId === c.id);
        if (!hasStudents) {
          const newClsStudents = generateInitialStudentsForClass(c.id, c.studentCount);
          students.push(...newClsStudents);
          hasNewClass = true;
        }
      });
      if (hasNewClass) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      }
    }

    let assessments: Record<string, AssessmentRecord> = {};
    const storedAssess = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
    if (storedAssess) {
      try {
        assessments = JSON.parse(storedAssess);
      } catch {
        assessments = {};
      }
    }

    if (Object.keys(assessments).length === 0) {
      TEACHER_CLASSES.forEach((c) => {
        const clsStudents = students.filter(s => s.classId === c.id);
        const clsAssess = generateInitialAssessments(clsStudents, c.id);
        assessments = { ...assessments, ...clsAssess };
      });
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));
    } else {
      // Ensure missing assessments for new classes are generated
      let hasNewAssess = false;
      TEACHER_CLASSES.forEach((c) => {
        const clsStudents = students.filter(s => s.classId === c.id);
        const missingForClass = clsStudents.some(s => !assessments[s.id]);
        if (missingForClass) {
          const clsAssess = generateInitialAssessments(clsStudents, c.id);
          assessments = { ...assessments, ...clsAssess };
          hasNewAssess = true;
        }
      });
      if (hasNewAssess) {
        localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));
      }
    }

    let materials = INITIAL_MATERIALS;
    const storedMat = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    if (storedMat) {
      try {
        materials = JSON.parse(storedMat);
      } catch {
        materials = INITIAL_MATERIALS;
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
    }

    let config: GoogleSheetsConfig = {
      scriptUrl: '',
      spreadsheetId: '',
      isConnected: false,
    };
    const storedConfig = localStorage.getItem(STORAGE_KEYS.SHEETS_CONFIG);
    if (storedConfig) {
      try {
        config = JSON.parse(storedConfig);
      } catch {
        // default
      }
    }

    return { students, assessments, materials, config };
  },

  getStudents(): Student[] {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return raw ? JSON.parse(raw) : [];
  },

  saveStudents(students: Student[]) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  getAssessments(): Record<string, AssessmentRecord> {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
    return raw ? JSON.parse(raw) : {};
  },

  saveAssessments(records: Record<string, AssessmentRecord>) {
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(records));
  },

  getAttendance(): AttendanceRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return raw ? JSON.parse(raw) : [];
  },

  saveAttendance(records: AttendanceRecord[]) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  },

  getMaterials(): MusicMaterial[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    return raw ? JSON.parse(raw) : INITIAL_MATERIALS;
  },

  saveMaterials(materials: MusicMaterial[]) {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
  },

  getSheetsConfig(): GoogleSheetsConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.SHEETS_CONFIG);
    return raw ? JSON.parse(raw) : { scriptUrl: '', isConnected: false };
  },

  saveSheetsConfig(config: GoogleSheetsConfig) {
    localStorage.setItem(STORAGE_KEYS.SHEETS_CONFIG, JSON.stringify(config));
  },
};
