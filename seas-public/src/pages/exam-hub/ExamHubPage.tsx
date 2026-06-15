import TopNav from '../../components/layout/TopNav';
import Sidebar from '../../components/layout/Sidebar';
import PortalFooter from '../../components/layout/PortalFooter';
import ExamHubHeader from '../../components/exam-hub/ExamHubHeader';
import AssignmentDetails from '../../components/exam-hub/AssignmentDetails';
import ExamCenterMap from '../../components/exam-hub/ExamCenterMap';
import ExamDayInstructions from '../../components/exam-hub/ExamDayInstructions';
import StrictlyProhibited from '../../components/exam-hub/StrictlyProhibited';

export default function ExamHubPage() {
  return (
    <div className="min-h-screen bg-surface">
      <TopNav />
      <Sidebar />

      <main className="ml-64 pt-24 pb-12 px-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <ExamHubHeader />

          {/* Assignment Details + Map row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <AssignmentDetails />
            <ExamCenterMap />
          </div>

          {/* Instructions + Prohibited row */}
          <div className="flex flex-col md:flex-row gap-6">
            <ExamDayInstructions />
            <StrictlyProhibited />
          </div>
        </div>
      </main>

      <div className="ml-64">
        <PortalFooter />
      </div>
    </div>
  );
}
