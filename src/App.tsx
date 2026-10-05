import React, { useState } from 'react';
import { PdpProvider, usePdp } from './context/PdpContext';
import { GansTopBar } from './components/GansTopBar';
import { PdpEmployeeInfoSection } from './components/PdpEmployeeInfoSection';
import { PdpCompetencyEvaluationTable } from './components/PdpCompetencyEvaluationTable';
import { PdpDevelopmentRoadmapSection } from './components/PdpDevelopmentRoadmapSection';
import { PdpEmployeeAcknowledgmentModal } from './components/PdpEmployeeAcknowledgmentModal';
import { HrExecutivePdpView } from './components/dashboards/HrExecutivePdpView';
import { ToastContainer } from './components/ToastContainer';

const MainAppContent: React.FC = () => {
  const { status } = usePdp();
  const [isAckModalOpen, setIsAckModalOpen] = useState(false);

  const isHrView = status === 'HR_VIEW';

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-slate-800 flex flex-col font-sans">
      {/* Clean Top Navigation Bar */}
      <GansTopBar />

      {/* Main Document Body */}
      <main className={`flex-1 p-4 sm:p-6 lg:p-8 ${isHrView ? 'max-w-7xl' : 'max-w-6xl'} mx-auto w-full`}>
        {isHrView ? (
          <HrExecutivePdpView />
        ) : (
          <div className="space-y-6">
            {/* Section 1: Employee Information Table */}
            <PdpEmployeeInfoSection />

            {/* Section 2: All 14 Competencies Proficiency Evaluation (Part A: 7 Behavioural + Part B: 7 Functional with integrated 5 Priority Selection) */}
            <PdpCompetencyEvaluationTable />

            {/* Section 3: Development Roadmap (5 Competencies with 4 rows each for Activities, Training Path, Phase, and Remarks) */}
            <PdpDevelopmentRoadmapSection
              onOpenAcknowledgementModal={() => setIsAckModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Employee Acknowledgement Modal */}
      <PdpEmployeeAcknowledgmentModal
        isOpen={isAckModalOpen}
        onClose={() => setIsAckModalOpen(false)}
      />

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <PdpProvider>
      <MainAppContent />
    </PdpProvider>
  );
}
