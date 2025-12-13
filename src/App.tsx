import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { InfractionList } from './components/InfractionList';
import { Calculator } from './components/Calculator';
import { Report } from './components/Report';

type View = 'search' | 'calc' | 'report';

const Main = () => {
  const [view, setView] = useState<View>('search');
  const [imgError, setImgError] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-green-200">
      {/* Header SEMA Style */}
      <header className="sema-gradient text-white shadow-lg sticky top-0 z-50 border-b-4 border-yellow-500">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Circle Wrapper */}
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-yellow-500 overflow-hidden relative">
               {!imgError ? (
                 <img 
                   src="/logo.png" 
                   alt="Brasão SEMA-AP" 
                   className="w-full h-full object-contain p-0.5"
                   onError={() => setImgError(true)}
                 />
               ) : (
                 <i className="fas fa-shield-alt text-green-800 text-2xl"></i>
               )}
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight leading-none text-white drop-shadow-md">
                SEMA-AP
              </h1>
              <p className="text-xs font-medium text-yellow-300 uppercase tracking-wider">
                Fiscalização Ambiental
              </p>
            </div>
          </div>
          {/* View Indicator */}
          <div className="hidden sm:flex text-xs font-semibold bg-green-800/50 px-3 py-1 rounded-full border border-green-600">
            {view === 'search' && 'PESQUISA'}
            {view === 'calc' && 'CÁLCULO'}
            {view === 'report' && 'RELATÓRIO'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto pb-6">
        {view === 'search' && (
          <InfractionList onSelect={() => setView('calc')} />
        )}
        {view === 'calc' && (
          <Calculator 
            onBack={() => setView('search')} 
            onNext={() => setView('report')} 
          />
        )}
        {view === 'report' && (
          <Report onBack={() => setView('calc')} />
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
}