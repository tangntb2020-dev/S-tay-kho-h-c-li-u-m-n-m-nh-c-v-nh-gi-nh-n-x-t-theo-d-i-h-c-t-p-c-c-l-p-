import React, { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import { TEACHER_CLASSES } from './data/mockData';
import { Student, AssessmentRecord, AssessmentLevel, MusicMaterial, GoogleSheetsConfig } from './types';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { AssessmentTable } from './components/AssessmentTable';
import { AttendanceTracker } from './components/AttendanceTracker';
import { RandomPicker } from './components/RandomPicker';
import { GroupGenerator } from './components/GroupGenerator';
import { ParentComments } from './components/ParentComments';
import { MaterialsLibrary } from './components/MaterialsLibrary';
import { SyncPanel } from './components/SyncPanel';
import { HelpModal } from './components/HelpModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('assessment');
  const [selectedClassId, setSelectedClassId] = useState<string>('1-4');
  const [semester, setSemester] = useState<'HK1' | 'HK2'>('HK1');
  const [isLargeText, setIsLargeText] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // App data state
  const [students, setStudents] = useState<Student[]>([]);
  const [assessments, setAssessments] = useState<Record<string, AssessmentRecord>>({});
  const [materials, setMaterials] = useState<MusicMaterial[]>([]);
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig>({
    scriptUrl: '',
    isConnected: false,
  });

  // Initialize data on mount
  useEffect(() => {
    const data = storageService.initializeData();
    setStudents(data.students);
    setAssessments(data.assessments);
    setMaterials(data.materials);
    setSheetsConfig(data.config);
  }, []);

  // Filter students for currently selected class
  const classStudents = students.filter(s => s.classId === selectedClassId);
  const currentClassObj = TEACHER_CLASSES.find(c => c.id === selectedClassId) || TEACHER_CLASSES[0];
  const classNameStr = currentClassObj.name;

  // Handlers for assessments
  const handleUpdateAssessment = (studentId: string, updates: Partial<AssessmentRecord>) => {
    setAssessments((prev) => {
      const existing = prev[studentId] || {
        studentId,
        classId: selectedClassId,
        dgtx1: '',
        dgtx2: '',
        dgtx3: '',
        giuaKy1: '',
        cuoiKy1: '',
        giuaKy2: '',
        cuoiKy2: '',
        comment: '',
        stars: 0,
      };

      const updated = {
        ...prev,
        [studentId]: {
          ...existing,
          ...updates,
        },
      };

      storageService.saveAssessments(updated);
      return updated;
    });
  };

  // Batch set level for all students in the selected class
  const handleBatchSetLevel = (field: keyof AssessmentRecord, level: AssessmentLevel) => {
    setAssessments((prev) => {
      const updated = { ...prev };
      classStudents.forEach((s) => {
        const existing = updated[s.id] || {
          studentId: s.id,
          classId: selectedClassId,
          dgtx1: '',
          dgtx2: '',
          dgtx3: '',
          giuaKy1: '',
          cuoiKy1: '',
          giuaKy2: '',
          cuoiKy2: '',
          comment: '',
          stars: 0,
        };
        updated[s.id] = {
          ...existing,
          [field]: level,
        };
      });
      storageService.saveAssessments(updated);
      return updated;
    });
  };

  // Materials handlers
  const handleAddMaterial = (newMat: Omit<MusicMaterial, 'id'>) => {
    const mat: MusicMaterial = {
      ...newMat,
      id: `mat-${Date.now()}`,
    };
    const updated = [mat, ...materials];
    setMaterials(updated);
    storageService.saveMaterials(updated);
  };

  const handleDeleteMaterial = (id: string) => {
    const updated = materials.filter(m => m.id !== id);
    setMaterials(updated);
    storageService.saveMaterials(updated);
  };

  // Sheets config handler
  const handleSaveSheetsConfig = (cfg: GoogleSheetsConfig) => {
    setSheetsConfig(cfg);
    storageService.saveSheetsConfig(cfg);
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans ${isLargeText ? 'text-base' : 'text-sm'}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeClass={currentClassObj.name}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          selectedClassId={selectedClassId}
          onSelectClass={setSelectedClassId}
          semester={semester}
          onSemesterChange={setSemester}
          sheetsConfig={sheetsConfig}
          onOpenSync={() => setCurrentTab('sync')}
          isLargeText={isLargeText}
          onToggleLargeText={() => setIsLargeText(!isLargeText)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'assessment' && (
            <AssessmentTable
              classId={selectedClassId}
              classNameStr={classNameStr}
              semester={semester}
              students={classStudents}
              assessments={assessments}
              onUpdateAssessment={handleUpdateAssessment}
              onBatchSetLevel={handleBatchSetLevel}
              isLargeText={isLargeText}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceTracker
              classNameStr={classNameStr}
              classId={selectedClassId}
              students={classStudents}
              isLargeText={isLargeText}
            />
          )}

          {currentTab === 'random' && (
            <RandomPicker
              classNameStr={classNameStr}
              students={classStudents}
              isLargeText={isLargeText}
            />
          )}

          {currentTab === 'groups' && (
            <GroupGenerator
              classNameStr={classNameStr}
              students={classStudents}
              isLargeText={isLargeText}
            />
          )}

          {currentTab === 'comments' && (
            <ParentComments
              classNameStr={classNameStr}
              semester={semester}
              students={classStudents}
              assessments={assessments}
              onUpdateAssessment={handleUpdateAssessment}
              isLargeText={isLargeText}
            />
          )}

          {currentTab === 'materials' && (
            <MaterialsLibrary
              materials={materials}
              onAddMaterial={handleAddMaterial}
              onDeleteMaterial={handleDeleteMaterial}
              isLargeText={isLargeText}
            />
          )}

          {currentTab === 'sync' && (
            <SyncPanel
              config={sheetsConfig}
              onSaveConfig={handleSaveSheetsConfig}
              students={classStudents}
              assessments={assessments}
              classNameStr={classNameStr}
              isLargeText={isLargeText}
            />
          )}
        </main>
      </div>

      {/* TT27 Guide Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
