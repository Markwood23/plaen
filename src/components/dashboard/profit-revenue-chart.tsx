'use client';
import React, { useState } from 'react';
import { LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';

export default function ProfitRevenueChart() {
  const [timeframe, setTimeframe] = useState('weekly');

  const data = [
    { month: 'Sep', revenue: 25000, profit: 42000 },
    { month: 'Oct', revenue: 32000, profit: 35000 },
    { month: 'Nov', revenue: 52000, profit: 30000 },
    { month: 'Dec', revenue: 58000, profit: 55000 },
    { month: 'Jan', revenue: 65000, profit: 62000 },
    { month: 'Feb', revenue: 58000, profit: 48000 },
    { month: 'Mar', revenue: 42000, profit: 40000 }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-2xl shadow-2xl p-5 border border-gray-100 transform -translate-y-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">This Month</p>
          <p className="text-3xl font-bold tracking-tight">220,342,123</p>
          <p className="text-xs text-gray-400 mt-2">{payload[0].payload.month}</p>
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value: number) => {
    return `${(value / 1000).toFixed(0)},000`;
  };

  return (
    <div className="w-full">
      <div className="relative">
          <ResponsiveContainer width="100%" height={420}>
            <LineChart
              data={data}
              margin={{ top: 30, right: 40, left: 80, bottom: 60 }}
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#000000" stopOpacity={0.5}/>
                  <stop offset="50%" stopColor="#000000" stopOpacity={0.15}/>
                  <stop offset="100%" stopColor="#000000" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9ca3af" stopOpacity={0.4}/>
                  <stop offset="50%" stopColor="#9ca3af" stopOpacity={0.12}/>
                  <stop offset="100%" stopColor="#9ca3af" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="0" 
                stroke="#f3f4f6" 
                vertical={false}
                strokeWidth={1.5}
              />
              
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 14, fontWeight: 500 }}
                dy={12}
                padding={{ left: 20, right: 20 }}
                label={{ 
                  value: 'Months', 
                  position: 'insideBottom', 
                  offset: -35,
                  style: { fill: '#6b7280', fontSize: 13, fontWeight: 600 }
                }}
              />
              
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 500 }}
                tickFormatter={formatYAxis}
                domain={[0, 80000]}
                ticks={[20000, 40000, 60000, 80000]}
                dx={-5}
                label={{ 
                  value: 'Amount (USD)', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: -50,
                  style: { fill: '#6b7280', fontSize: 13, fontWeight: 600, textAnchor: 'middle' }
                }}
              />
              
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ 
                  stroke: '#e5e7eb', 
                  strokeWidth: 2, 
                  strokeDasharray: '6 6',
                  strokeLinecap: 'round'
                }}
                animationDuration={200}
              />
              
              {/* Profit area gradient (gray) - behind */}
              <Area
                type="monotone"
                dataKey="profit"
                stroke="none"
                fill="url(#profitGradient)"
              />
              
              {/* Revenue area gradient (black) - in front */}
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="none"
                fill="url(#revenueGradient)"
              />
              
              {/* Profit line (gray) - behind */}
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#9ca3af" 
                strokeWidth={3.5}
                dot={false}
                activeDot={{ 
                  r: 7, 
                  fill: '#9ca3af', 
                  strokeWidth: 4,
                  stroke: '#ffffff',
                  style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }
                }}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Revenue line (black) - in front */}
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#000000" 
                strokeWidth={3.5}
                dot={false}
                activeDot={{ 
                  r: 8, 
                  fill: '#000000', 
                  strokeWidth: 5,
                  stroke: '#ffffff',
                  style: { filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))' }
                }}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Enhanced Legend */}
          <div className="flex justify-center gap-10 mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-black group-hover:scale-110 transition-transform duration-200"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-black opacity-20 blur-sm"></div>
              </div>
              <span className="text-sm font-semibold text-gray-900 group-hover:text-black transition-colors">Revenue</span>
            </div>
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400 group-hover:scale-110 transition-transform duration-200"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-gray-400 opacity-20 blur-sm"></div>
              </div>
              <span className="text-sm font-semibold text-gray-900 group-hover:text-black transition-colors">Profit</span>
          </div>
        </div>
      </div>
    </div>
  );
}