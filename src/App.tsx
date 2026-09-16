import React, { useState } from 'react';
import { PdpProvider, usePdp } from './context/PdpContext';
import { GansTopBar } from './components/GansTopBar';
import { PdpEmployeeInfoSection } from './components/PdpEmployeeInfoSection';
import { PdpCompetencyEvaluationTable } from './components/PdpCompetencyEvaluationTable';
import { PdpManagerSelectionSection } from './components/PdpManagerSelectionSection';
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
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        {isHrView ? (
          <HrExecutivePdpView />
        ) : (
          <div className="space-y-6">
            {/* Section 1: Employee Information Table */}
            <PdpEmployeeInfoSection />

            {/* Section 2: All 14 Competencies Proficiency Evaluation (Part A: 7 Functional + Part B: 7 Behavioural) */}
            <PdpCompetencyEvaluationTable />

            {/* Section 3: Manager 5 Priority Competencies & Objectives Selection (and HR Initiation) */}
            <PdpManagerSelectionSection />

            {/* Section 4: Development Roadmap (5 Competencies, Objectives, Activities, Training Plan, Phase, Remarks) */}
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
