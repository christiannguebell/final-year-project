import { useState } from 'react';
import ResultTopNav from '../../components/result-portal/ResultTopNav';
import ResultSidebar from '../../components/result-portal/ResultSidebar';
import ResultPortalHeader from '../../components/result-portal/ResultPortalHeader';
import AdmissionDecisionCard from '../../components/result-portal/AdmissionDecisionCard';
import ScoreBreakdown from '../../components/result-portal/ScoreBreakdown';
import NextSteps from '../../components/result-portal/NextSteps';
import PortalFooter from '../../components/layout/PortalFooter';

export default function ResultPortalPage() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const showHeader = activeTab === 'Dashboard';
  const showDecision =
    activeTab === 'Dashboard' || activeTab === 'Admissions' || activeTab === 'Ranking';
  const showScores = activeTab === 'Dashboard' || activeTab === 'Score Breakdown';
  const showNextSteps = activeTab === 'Dashboard' || activeTab === 'Admissions';

  return (
    <div className="min-h-screen bg-surface">
      <ResultTopNav activeTab={activeTab} onTabChange={setActiveTab} />
      <ResultSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="ml-64 pt-24 pb-12 px-10">
        <div className="mx-auto max-w-6xl space-y-8">
          {showHeader && <ResultPortalHeader />}
          {showDecision && <AdmissionDecisionCard />}
          {showScores && <ScoreBreakdown />}
          {showNextSteps && <NextSteps />}
        </div>
      </main>

      <div className="ml-64">
        <PortalFooter />
      </div>
    </div>
  );
}
