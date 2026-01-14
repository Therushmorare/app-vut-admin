import React from 'react';
import { COLORS } from '../../utils/helpers';

export default function TabNavigation({ activeTab, setActiveTab, counts }) {
  const tabs = [
    { id: 'agreements', label: 'SETA Agreements', count: counts.agreements },
    { id: 'profiles', label: 'SETA Profiles', count: counts.profiles },
    { id: 'funding', label: 'Funding Windows', count: counts.funding }
  ];

  return (
    <div className="mb-6 border-b" style={{ borderColor: COLORS.border }}>
      <div className="flex space-x-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === tab.id 
                ? 'border-b-2' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={activeTab === tab.id ? { 
              borderColor: COLORS.text, 
              color: COLORS.text 
            } : {}}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
    </div>
  );
}