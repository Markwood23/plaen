'use client';
import React, { useMemo } from 'react';
import { LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  month: string
  revenue: number
  invoiced: number
}

interface ProfitRevenueChartProps {
  data: ChartDataPoint[]
  currency?: string
}

export default function ProfitRevenueChart({ data, currency = 'GHS' }: ProfitRevenueChartProps) {
  // Format currency for display
  const currencySymbol = currency === 'GHS' ? '₵' : currency === 'USD' ? '$' : currency

  // Calculate max value for Y axis domain
  const maxValue = useMemo(() => {
    if (!data || data.length === 0) return 10000
    const max = Math.max(
      ...data.map(d => Math.max(d.revenue || 0, d.invoiced || 0))
    )
    // Round up to a nice number
    const magnitude = Math.pow(10, Math.floor(Math.log10(max || 1)))
    return Math.ceil((max || 10000) / magnitude) * magnitude || 10000
  }, [data])

  // Generate Y axis ticks
  const yAxisTicks = useMemo(() => {
    const step = maxValue / 4
    return [step, step * 2, step * 3, maxValue]
  }, [maxValue])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload
      return (
        <div className="bg-white rounded-2xl shadow-2xl p-5 border border-gray-100 transform -translate-y-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{point.month}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#14462a]"></div>
              <p className="text-sm font-semibold">{currencySymbol}{(point.revenue / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              <span className="text-xs text-gray-400">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#65a37a]"></div>
              <p className="text-sm font-semibold">{currencySymbol}{(point.invoiced / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              <span className="text-xs text-gray-400">Invoiced</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value: number) => {
    // Values are in minor units (cents), convert to major units
    const majorValue = value / 100
    if (majorValue >= 1000000) return `${currencySymbol}${(majorValue / 1000000).toFixed(1)}M`
    if (majorValue >= 1000) return `${currencySymbol}${(majorValue / 1000).toFixed(0)}k`
    return `${currencySymbol}${majorValue.toFixed(0)}`
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
                  <stop offset="0%" stopColor="#14462a" stopOpacity={0.5}/>
                  <stop offset="50%" stopColor="#14462a" stopOpacity={0.15}/>
                  <stop offset="100%" stopColor="#14462a" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="invoicedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14462a" stopOpacity={0.2}/>
                  <stop offset="50%" stopColor="#14462a" stopOpacity={0.06}/>
                  <stop offset="100%" stopColor="#14462a" stopOpacity={0}/>
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
                domain={[0, maxValue]}
                ticks={yAxisTicks}
                dx={-5}
                label={{ 
                  value: `Amount (${currency})`, 
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
              
              {/* Invoiced area gradient (lighter) - behind */}
              <Area
                type="monotone"
                dataKey="invoiced"
                stroke="none"
                fill="url(#invoicedGradient)"
              />
              
              {/* Revenue area gradient (darker) - in front */}
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="none"
                fill="url(#revenueGradient)"
              />
              
              {/* Invoiced line (lighter green) - behind */}
              <Line 
                type="monotone" 
                dataKey="invoiced" 
                stroke="#65a37a" 
                strokeWidth={3.5}
                dot={false}
                activeDot={{ 
                  r: 7, 
                  fill: '#65a37a', 
                  strokeWidth: 4,
                  stroke: '#ffffff',
                  style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }
                }}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Revenue line (brand green) - in front */}
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#14462a" 
                strokeWidth={3.5}
                dot={false}
                activeDot={{ 
                  r: 8, 
                  fill: '#14462a', 
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
                <div className="w-2.5 h-2.5 rounded-full bg-[#14462a] group-hover:scale-110 transition-transform duration-200"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#14462a] opacity-20 blur-sm"></div>
              </div>
              <span className="text-sm font-semibold text-gray-900 group-hover:text-[#14462a] transition-colors">Revenue (Paid)</span>
            </div>
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-[#65a37a] group-hover:scale-110 transition-transform duration-200"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#65a37a] opacity-20 blur-sm"></div>
              </div>
              <span className="text-sm font-semibold text-gray-900 group-hover:text-[#14462a] transition-colors">Invoiced</span>
          </div>
        </div>
      </div>
    </div>
  );
}