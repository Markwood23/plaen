'use client';
import React, { useState } from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';

export default function ProfitRevenueChart() {
  const [timeframe, setTimeframe] = useState('weekly');

  const data = [
    { month: 'Sep', revenue: 28000, profit: 38000 },
    { month: 'Oct', revenue: 35000, profit: 42000 },
    { month: 'Nov', revenue: 48000, profit: 36000 },
    { month: 'Dec', revenue: 55000, profit: 50000 },
    { month: 'Jan', revenue: 62000, profit: 58000 },
    { month: 'Feb', revenue: 54000, profit: 45000 },
    { month: 'Mar', revenue: 45000, profit: 38000 }
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
            <ComposedChart
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
                  <stop offset="0%" stopColor="#F9F9F9" stopOpacity={1}/>
                  <stop offset="50%" stopColor="#F9F9F9" stopOpacity={0.85}/>
                  <stop offset="100%" stopColor="#F9F9F9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F9F9F9" stopOpacity={1}/>
                  <stop offset="50%" stopColor="#F9F9F9" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#F9F9F9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="0" 
                stroke="#EBECE7" 
                vertical={false}
                strokeWidth={1.5}
              />
              
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#949494', fontSize: 14, fontWeight: 500 }}
                dy={12}
                padding={{ left: 20, right: 20 }}
                label={{ 
                  value: 'Months', 
                  position: 'insideBottom', 
                  offset: -35,
                  style: { fill: '#949494', fontSize: 13, fontWeight: 600 }
                }}
              />
              
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#949494', fontSize: 13, fontWeight: 500 }}
                tickFormatter={formatYAxis}
                domain={[0, 80000]}
                ticks={[20000, 40000, 60000, 80000]}
                dx={-5}
                label={{ 
                  value: 'Amount (USD)', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: -50,
                  style: { fill: '#949494', fontSize: 13, fontWeight: 600, textAnchor: 'middle' }
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
                type="natural"
                dataKey="profit"
                stroke="none"
                fill="url(#profitGradient)"
              />
              
              {/* Revenue area gradient (black) - in front */}
              <Area
                type="natural"
                dataKey="revenue"
                stroke="none"
                fill="url(#revenueGradient)"
              />
              
              {/* Profit line (gray) - behind */}
              <Line 
                type="natural" 
                dataKey="profit" 
                stroke="#949494" 
                strokeWidth={3.5}
                dot={false}
                activeDot={{ 
                  r: 7, 
                  fill: '#949494', 
                  strokeWidth: 4,
                  stroke: '#ffffff',
                  style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }
                }}
                strokeLinecap="round"
                strokeLinejoin="round"
                tension={0.4}
              />
              
              {/* Revenue line (black) - in front */}
              <Line 
                type="natural" 
                dataKey="revenue" 
                stroke="#212121" 
                strokeWidth={3.5}
                dot={false}
                activeDot={{ 
                  r: 8, 
                  fill: '#212121', 
                  strokeWidth: 5,
                  stroke: '#ffffff',
                  style: { filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))' }
                }}
                strokeLinecap="round"
                strokeLinejoin="round"
                tension={0.5}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Enhanced Legend */}
          <div className="flex justify-center gap-10 mt-8 pt-6 border-t border-[#EBECE7]">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-[#212121] group-hover:scale-110 transition-transform duration-200"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#212121] opacity-20 blur-sm"></div>
              </div>
              <span className="text-sm font-medium text-[#212121] group-hover:text-[#212121]/80 transition-colors">Revenue</span>
            </div>
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-[#949494] group-hover:scale-110 transition-transform duration-200"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#949494] opacity-20 blur-sm"></div>
              </div>
              <span className="text-sm font-medium text-[#212121] group-hover:text-[#212121]/80 transition-colors">Profit</span>
          </div>
        </div>
      </div>
    </div>
  );
}