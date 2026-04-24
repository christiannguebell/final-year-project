import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { PaymentQueue } from './components/PaymentQueue';
import { ApplicationDetail } from './components/ApplicationDetail';
import { Candidate } from './constants';

export default function App() {
  const [view, setView] = useState<'payments' | 'admissions'>('payments');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setView('admissions');
  };

  const handleBack = () => {
    setSelectedCandidate(null);
    setView('payments');
  };

  return (
    <div className="min-h-screen">
      <TopBar activeView={view} setView={setView} />
      <Sidebar activeView={view} onNavigate={setView} />
      
      <main className="ml-64 pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          {selectedCandidate ? (
            <ApplicationDetail 
              candidate={selectedCandidate} 
              onBack={handleBack} 
            />
          ) : (
            <PaymentQueue onSelectCandidate={handleSelectCandidate} />
          )}
        </div>
      </main>
    </div>
  );
}
