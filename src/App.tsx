import React, { useState } from 'react';
import { PdpProvider, usePdp } from './context/PdpContext';
import { GansTopBar } from './components/GansTopBar';
import { PdpEmployeeInfoSection } from './components/PdpEmployeeInfoSection';
import { PdpCompetencyEvaluationTable } from './components/PdpCompetencyEvaluationTable';
import { PdpDevelopmentRoadmapSection } from './components/PdpDevelopmentRoadmapSection';
import { PdpEmployeeAcknowledgmentModal } from './components/PdpEmployeeAcknowledgmentModal';
import { HrExecutivePdpView } from './components/dashboards/HrExecutivePdpView';
import { PdpSideNav } from './components/PdpSideNav';
import { ToastContainer } from './components/ToastContainer';

const MainAppContent: React.FC = () => {
  const { status } = usePdp();
  const [isAckModalOpen, setIsAckModalOpen] = useState(false);
  const [sideNavTab, setSideNavTab] = useState<'my_pdp' | 'pdp'>('my_pdp');

  const isHrView = status === 'HR_VIEW';

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-slate-800 flex flex-col font-sans">
      {/* Clean Top Navigation Bar */}
      <GansTopBar />

      {/* Main Content Area with Side Navigation (Matching LNA Navigation from reference) */}
      <div className="flex-1 flex w-full">
        {/* Side Navigation: PDP and My PDP */}
        <PdpSideNav
          activeTab={isHrView ? 'pdp' : sideNavTab}
          onSelectTab={(tab) => {
            setSideNavTab(tab);
          }}
        />

        {/* Main Document Body */}
        <main className="flex-1 p-4 sm:p-6 lg:px-8 lg:py-6 w-full min-w-0">
          {isHrView || sideNavTab === 'pdp' ? (
            <HrExecutivePdpView onInspectEmployeePdp={() => setSideNavTab('my_pdp')} />
          ) : (
            <div className="space-y-6 w-full">
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
      </div>

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
