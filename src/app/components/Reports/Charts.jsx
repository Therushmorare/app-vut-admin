"use client"
import React, { useMemo } from 'react';
import { COLORS } from '../../utils/helpers';

const Charts =({
  companies = [],
  placements = [],
  allocatedLearners = [],
  agreements = [],
  fundingWindows = []
}) => {

  const chartData = useMemo(() => {
    //monthly
    const monthlyPlacements = placements.reduce((acc, p) => {
      const month = new Date(p.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    // status distribution
    const statusData = {
      Active: placements.filter(p => p.status === 'Active').length,
      Completed: placements.filter(p => p.status === 'Completed').length,
      'On Hold': placements.filter(p => p.status === 'On Hold').length,
      Terminated: placements.filter(p => p.status === 'Terminated').length
    };

    const companyPlacements = placements.reduce((acc, p) => {
      acc[p.companyId] = (acc[p.companyId] || 0) + 1;
      return acc;
    }, {});
    
    const topCompanies = Object.entries(companyPlacements)
      .map(([id, count]) => ({
        name: companies.find(c => c.id === id)?.companyName || 'Unknown',
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const facultyData = allocatedLearners.reduce((acc, l) => {
      const faculty = l.faculty || 'Unknown';
      acc[faculty] = (acc[faculty] || 0) + 1;
      return acc;
    }, {});

    const setaData = allocatedLearners.reduce((acc, l) => {
      const agreement = agreements.find(a => a.id === l.agreementId);
      const seta = agreement?.setaName || 'Unknown';
      acc[seta] = (acc[seta] || 0) + 1;
      return acc;
    }, {});

    return {
      monthlyPlacements,
      statusData,
      topCompanies,
      facultyData,
      setaData
    };
  }, [companies, placements, allocatedLearners, agreements]);

  const BarChart = ({ data, title, color }) => {
    const maxValue = Math.max(...Object.values(data));
    
    return (
      <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
        <h3 className="text-lg font-bold mb-6" style={{ color: COLORS.primary }}>{title}</h3>
        <div className="space-y-4">
          {Object.entries(data).map(([label, value]) => {
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
            return (
              <div key={label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: COLORS.text }}>
                    {label}
                  </span>
                  <span className="text-sm font-bold" style={{ color }}>
                    {value}
                  </span>
                </div>
                <div className="relative h-8 rounded-lg overflow-hidden" style={{ backgroundColor: COLORS.bgLight }}>
                  <div
                    className="absolute top-0 left-0 h-full flex items-center px-3 rounded-lg transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: color,
                      minWidth: value > 0 ? '40px' : '0'
                    }}
                  >
                    <span className="text-xs font-semibold text-white">{value}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const PieChart = ({ data, title }) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    
    let cumulativePercentage = 0;
    
    return (
      <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
        <h3 className="text-lg font-bold mb-6" style={{ color: COLORS.primary }}>{title}</h3>
        <div className="flex flex-col items-center">
          {/* Pie Chart */}
          <svg viewBox="0 0 200 200" className="w-48 h-48 mb-6">
            {Object.entries(data).map(([label, value], index) => {
              const percentage = (value / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = (cumulativePercentage / 100) * 360;

              const startX = 100 + 80 * Math.cos((Math.PI * (startAngle - 90)) / 180);
              const startY = 100 + 80 * Math.sin((Math.PI * (startAngle - 90)) / 180);
              const endX = 100 + 80 * Math.cos((Math.PI * (startAngle + angle - 90)) / 180);
              const endY = 100 + 80 * Math.sin((Math.PI * (startAngle + angle - 90)) / 180);
              const largeArc = angle > 180 ? 1 : 0;
              
              const path = `M 100 100 L ${startX} ${startY} A 80 80 0 ${largeArc} 1 ${endX} ${endY} Z`;
              
              cumulativePercentage += percentage;
              
              return (
                <path
                  key={label}
                  d={path}
                  fill={colors[index % colors.length]}
                  stroke="#fff"
                  strokeWidth="2"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              );
            })}
            <circle cx="100" cy="100" r="50" fill="white" />
            <text x="100" y="100" textAnchor="middle" dy=".3em" fontSize="24" fontWeight="bold" fill={COLORS.primary}>
              {total}
            </text>
          </svg>

          {/* Legend */}
          <div className="w-full space-y-2">
            {Object.entries(data).map(([label, value], index) => {
              const percentage = ((value / total) * 100).toFixed(1);
              return (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-sm" style={{ color: COLORS.text }}>{label}</span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: COLORS.primary }}>
                    {value} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const LineChart = ({ data, title }) => {
    const entries = Object.entries(data);
    const maxValue = Math.max(...Object.values(data), 1);
    const chartHeight = 280;
    const chartWidth = 700;
    const padding = 60;

    if (entries.length === 0) {
      return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg border border-blue-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
          <div className="text-gray-500 text-center py-8">No data available</div>
        </div>
      );
    }

    const points = entries.map(([label, value], index) => {
      const x = padding + ((chartWidth - 2 * padding) / (entries.length - 1 || 1)) * index;
      const y = chartHeight - padding - ((value / maxValue) * (chartHeight - 2 * padding));
      return { x, y, label, value };
    });

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    
    const areaPath = `${pathData} L ${points[points.length - 1].x} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`;

    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
        <h3 className="text-lg font-semibold mb-6 text-gray-800">{title}</h3>
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
            const y = chartHeight - padding - (ratio * (chartHeight - 2 * padding));
            return (
              <g key={ratio}>
                <line
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.5"
                />
                <text x={padding - 10} y={y + 5} textAnchor="end" fontSize="13" fill="#64748b" fontWeight="500">
                  {Math.round(maxValue * ratio)}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path
            d={areaPath}
            fill="url(#areaGradient)"
            opacity="0.6"
          >
            <animate
              attributeName="opacity"
              from="0"
              to="0.6"
              dur="1s"
              fill="freeze"
            />
          </path>

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            strokeDasharray={points.length > 1 ? "1000" : "0"}
            strokeDashoffset={points.length > 1 ? "1000" : "0"}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="1000"
              to="0"
              dur="2s"
              fill="freeze"
            />
          </path>

          {/* Points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                fill="white"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                filter="url(#glow)"
              >
                <animate
                  attributeName="r"
                  from="0"
                  to="8"
                  dur="0.5s"
                  begin={`${1.5 + index * 0.1}s`}
                  fill="freeze"
                />
              </circle>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#8b5cf6"
                opacity="0"
              >
                <animate
                  attributeName="opacity"
                  from="0"
                  to="1"
                  dur="0.3s"
                  begin={`${1.7 + index * 0.1}s`}
                  fill="freeze"
                />
              </circle>
              
              {/* Value label above point */}
              <text
                x={point.x}
                y={point.y - 15}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#1e293b"
                opacity="0"
              >
                {point.value}
                <animate
                  attributeName="opacity"
                  from="0"
                  to="1"
                  dur="0.3s"
                  begin={`${1.8 + index * 0.1}s`}
                  fill="freeze"
                />
              </text>

              {/* Month label */}
              <text
                x={point.x}
                y={chartHeight - padding + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#64748b"
                fontWeight="500"
                transform={`rotate(-45 ${point.x} ${chartHeight - padding + 20})`}
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Monthly Trend */}
      <LineChart 
        data={chartData.monthlyPlacements}
        title="Monthly Placements Trend"
      />

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart 
          data={chartData.statusData}
          title="Placement Status Distribution"
        />
        <PieChart 
          data={chartData.facultyData}
          title="Learners by Faculty"
        />
      </div>

      {/* Top Companies */}
      <BarChart
        data={chartData.topCompanies.reduce((acc, c) => {
          acc[c.name] = c.count;
          return acc;
        }, {})}
        title="Top 10 Host Companies by Placements"
        color={COLORS.secondary}
      />

      {/* SETA Distribution */}
      <BarChart
        data={chartData.setaData}
        title="Learners by SETA"
        color={COLORS.info}
      />
    </div>
  );
}

export default Charts;
