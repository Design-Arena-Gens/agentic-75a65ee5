"use client";
import { useState } from 'react';
import Matrix from '@components/Matrix';
import AIOrganizer from '@components/AIOrganizer';

export default function Page() {
  const [tab, setTab] = useState<'Matrix' | 'AI'>('Matrix');

  return (
    <div className="container">
      <div className="tabs" role="tablist">
        <button className={`tab-btn ${tab === 'Matrix' ? 'active' : ''}`} onClick={() => setTab('Matrix')} role="tab" aria-selected={tab==='Matrix'}>Eisenhower Matrix</button>
        <button className={`tab-btn ${tab === 'AI' ? 'active' : ''}`} onClick={() => setTab('AI')} role="tab" aria-selected={tab==='AI'}>AI Blueprint Organizer</button>
      </div>
      {tab === 'Matrix' ? (
        <Matrix />
      ) : (
        <div className="app-grid">
          <div className="matrix-outer">
            <div className="panel"><h2>Blueprint Workspace</h2><div>Use the panel to the right to manage IR and KCS.</div></div>
          </div>
          <AIOrganizer />
        </div>
      )}
    </div>
  );
}
