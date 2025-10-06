// src/components/ui/ViewToggle.tsx
'use client';

import React from 'react';
import { List, Grid } from 'lucide-react';

interface ViewToggleProps {
  currentView: 'cards' | 'list';
  onViewChange: (view: 'cards' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex items-center gap-1 bg-neutral-800 rounded-lg p-1">
      <button
        onClick={() => onViewChange('cards')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          currentView === 'cards'
            ? 'bg-indigo-600 text-white'
            : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
        }`}
      >
        <Grid size={16} />
        Cards
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          currentView === 'list'
            ? 'bg-indigo-600 text-white'
            : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
        }`}
      >
        <List size={16} />
        List
      </button>
    </div>
  );
};

export default ViewToggle;