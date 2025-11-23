import React from 'react';
import { ActionableArea } from '../types';
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface Props {
  overview: string;
  actions: ActionableArea[];
}

export const ExecutiveSummary: React.FC<Props> = ({ overview, actions }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-indigo-600" />
        <h3 className="text-xl font-bold text-slate-800">Executive Summary</h3>
      </div>
      
      <p className="text-slate-600 mb-8 leading-relaxed text-lg">
        {overview}
      </p>

      <h4 className="text-sm uppercase tracking-wide text-slate-500 font-bold mb-4">Top 3 Actionable Areas</h4>
      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action, idx) => (
          <div key={idx} className="relative p-5 rounded-lg bg-slate-50 border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className={`
                px-2 py-1 text-xs font-bold rounded uppercase tracking-wider
                ${action.impact === 'High' ? 'bg-red-100 text-red-700' : 
                  action.impact === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                  'bg-blue-100 text-blue-700'}
              `}>
                {action.impact} Impact
              </div>
              {action.impact === 'High' ? 
                <AlertTriangle className="w-5 h-5 text-red-500" /> : 
                <CheckCircle className="w-5 h-5 text-blue-500" />
              }
            </div>
            <h5 className="font-bold text-slate-900 mb-2">{action.title}</h5>
            <p className="text-sm text-slate-600 leading-snug">{action.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};