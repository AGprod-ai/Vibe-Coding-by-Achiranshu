import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { SentimentPoint } from '../types';

interface Props {
  data: SentimentPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
        <p className="text-slate-600 text-sm font-medium">{label}</p>
        <p className="text-indigo-600 text-sm">
          Sentiment: <span className="font-bold">{Number(payload[0].value).toFixed(2)}</span>
        </p>
        <p className="text-slate-400 text-xs">Volume: {payload[0].payload.volume}</p>
      </div>
    );
  }
  return null;
};

export const SentimentChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-[300px] w-full bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Sentiment Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#64748b' }} 
            axisLine={false}
            tickLine={false}
            dy={10}
            tickFormatter={(value) => {
                const d = new Date(value);
                return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
          />
          <YAxis 
            domain={[-1, 1]} 
            tick={{ fontSize: 12, fill: '#64748b' }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="sentiment"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};