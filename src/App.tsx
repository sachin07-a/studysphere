import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StudyProvider, useStudy } from './context/StudyContext';

// Layout & Global Overlays
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { QuickCaptureModal } from './components/layout/QuickCaptureModal';
import { AIChatbotDrawer } from './components/layout/AIChatbotDrawer';
import { FocusModeModal } from './components/timer/FocusModeModal';
import { AuthView } from './components/auth/AuthView';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { FloatingMusicDock } from './components/music/FloatingMusicDock';
import { YouTubePlayerModal } from './components/music/YouTubePlayerModal';
import { ReportCardModal } from './components/reports/ReportCardModal';

// Feature Views
import { DashboardView } from './components/dashboard/DashboardView';
import { TimerView } from './components/timer/TimerView';
import { HabitsView } from './components/habits/HabitsView';
import { TasksView } from './components/tasks/TasksView';
import { SubjectsView } from './components/subjects/SubjectsView';
import { GoalsView } from './components/goals/GoalsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { CalendarView } from './components/calendar/CalendarView';
import { NotesView } from './components/notes/NotesView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { SettingsView } from './components/settings/SettingsView';
import { FlashcardsView } from './components/flashcards/FlashcardsView';
import { ExamsView } from './components/exams/ExamsView';
import { PDFReaderView } from './components/pdf/PDFReaderView';
import { GPACalculatorView } from './components/gpa/GPACalculatorView';
import { StudyRoomView } from './components/community/StudyRoomView';

const MainLayout: React.FC = () => {
  const { isAuthenticated, isOnboarded, isLoading } = useAuth();
  const { 
    activeView, 
    isYouTubeModalOpen, 
    setIsYouTubeModalOpen,
    isReportCardOpen,
    setIsReportCardOpen
  } = useStudy();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070a13] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 animate-spin flex items-center justify-center p-0.5 shadow-glow-cyan">
            <div className="w-full h-full bg-[#070a13] rounded-[14px]" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            Igniting StudySphere 3D...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthView />;
  }

  if (!isOnboarded) {
    return <OnboardingWizard />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'timer':
        return <TimerView />;
      case 'flashcards':
        return <FlashcardsView />;
      case 'exams':
        return <ExamsView />;
      case 'pdf-reader':
        return <PDFReaderView />;
      case 'gpa-calc':
        return <GPACalculatorView />;
      case 'study-room':
        return <StudyRoomView />;
      case 'habits':
        return <HabitsView />;
      case 'tasks':
        return <TasksView />;
      case 'subjects':
        return <SubjectsView />;
      case 'goals':
        return <GoalsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'calendar':
        return <CalendarView />;
      case 'notes':
        return <NotesView />;
      case 'achievements':
        return <AchievementsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col relative bg-radial-mesh">
      {/* Top Header */}
      <Header />

      {/* Main Body */}
      <div className="flex-1 flex w-full relative">
        {/* Collapsible Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic Main Workspace Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {renderActiveView()}
        </main>
      </div>

      {/* Floating Bottom Mobile Nav */}
      <MobileNav />

      {/* Persistent Floating Audio / YouTube Player Dock */}
      <FloatingMusicDock />

      {/* Global Modals & Drawers */}
      <YouTubePlayerModal 
        isOpen={isYouTubeModalOpen} 
        onClose={() => setIsYouTubeModalOpen(false)} 
      />
      <ReportCardModal
        isOpen={isReportCardOpen}
        onClose={() => setIsReportCardOpen(false)}
      />
      <FocusModeModal />
      <QuickCaptureModal />
      <AIChatbotDrawer />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StudyProvider>
          <MainLayout />
        </StudyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
