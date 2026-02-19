import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Activities } from './pages/Activities';
import { Beneficiaries } from './pages/Beneficiaries';
import { Budget } from './pages/Budget';
import { Reports } from './pages/Reports';
import { Analytics } from './pages/Analytics';
import { Compliance } from './pages/Compliance';

const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch(activePage) {
      case 'dashboard': return <Dashboard />;
      case 'activities': return <Activities />;
      case 'beneficiaries': return <Beneficiaries />;
      case 'budget': return <Budget />;
      case 'reports': return <Reports />;
      case 'analytics': return <Analytics />;
      case 'compliance': return <Compliance />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default App;