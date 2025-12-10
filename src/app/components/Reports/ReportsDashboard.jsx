"use client"
import React, { useMemo } from 'react';
import { Users, Building2, FileText, TrendingUp, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { COLORS } from '../../utils/helpers';

export default function ReportsDashboard({
  companies = [],
  placements = [],
  allocatedLearners = [],
  agreements = [],
  fundingWindows = []
}) {
  
  const stats = useMemo(() => {
    const totalLearners = allocatedLearners.length;
    const totalCompanies = companies.length;
    const totalPlacements = placements.length;
    const activeSETAs = agreements.filter(a => a.status === 'Active').length;
    
    // Placement Status
    const activePlacements = placements.filter(p => p.status === 'Active').length;
    const completedPlacements = placements.filter(p => p.status === 'Completed').length;
    const onHoldPlacements = placements.filter(p => p.status === 'On Hold').length;
    const terminatedPlacements = placements.filter(p => p.status === 'Terminated').length;
    
    // Learner Status
    const placedLearnerIds = placements.map(p => p.learnerId);
    const placedLearners = allocatedLearners.filter(l => placedLearnerIds.includes(l.id)).length;
    const unplacedLearners = totalLearners - placedLearners;
    
    // Faculty Distribution
    const facultyDistribution = allocatedLearners.reduce((acc, learner) => {
      const faculty = learner.faculty || 'Unknown';
      acc[faculty] = (acc[faculty] || 0) + 1;
      return acc;
    }, {});
    
    // SETA Distribution
    const setaDistribution = allocatedLearners.reduce((acc, learner) => {
      const agreement = agreements.find(a => a.id === learner.agreementId);
      const setaName = agreement?.setaName || 'Unknown';
      acc[setaName] = (acc[setaName] || 0) + 1;
      return acc;
    }, {});
    
    // Company Capacity Utilization
    const totalCapacity = companies.reduce((sum, c) => sum + parseInt(c.learnerCapacity || 0), 0);
    const utilizationRate = totalCapacity > 0 ? ((activePlacements / totalCapacity) * 100).toFixed(1) : 0;
    
    // Funding Window Stats
    const activeFundingWindows = fundingWindows.filter(w => {
      const now = new Date();
      const start = new Date(w.startDate);
      const end = new Date(w.endDate);
      return now >= start && now <= end;
    }).length;
    
    return {
      totalLearners,
      totalCompanies,
      totalPlacements,
      activeSETAs,
      activePlacements,
      completedPlacements,
      onHoldPlacements,
      terminatedPlacements,
      placedLearners,
      unplacedLearners,
      facultyDistribution,
      setaDistribution,
      totalCapacity,
      utilizationRate,
      activeFundingWindows
    };
  }, [companies, placements, allocatedLearners, agreements, fundingWindows]);

  const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-bold mb-1" style={{ color }}>{value}</p>
      {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div>
        <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>Key Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Learners"
            value={stats.totalLearners}
            icon={Users}
            color={COLORS.primary}
            subtext={`${stats.placedLearners} placed, ${stats.unplacedLearners} unplaced`}
          />
          <StatCard
            title="Host Companies"
            value={stats.totalCompanies}
            icon={Building2}
            color={COLORS.secondary}
            subtext={`Capacity: ${stats.totalCapacity} learners`}
          />
          <StatCard
            title="Active Placements"
            value={stats.activePlacements}
            icon={CheckCircle}
            color={COLORS.success}
            subtext={`${stats.utilizationRate}% utilization`}
          />
          <StatCard
            title="Active SETAs"
            value={stats.activeSETAs}
            icon={FileText}
            color={COLORS.info}
            subtext={`${stats.activeFundingWindows} active windows`}
          />
        </div>
      </div>

      {/* Placement Status */}
      <div>
        <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>Placement Status Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active"
            value={stats.activePlacements}
            icon={TrendingUp}
            color="#10b981"
          />
          <StatCard
            title="Completed"
            value={stats.completedPlacements}
            icon={CheckCircle}
            color="#3b82f6"
          />
          <StatCard
            title="On Hold"
            value={stats.onHoldPlacements}
            icon={Clock}
            color="#f59e0b"
          />
          <StatCard
            title="Terminated"
            value={stats.terminatedPlacements}
            icon={XCircle}
            color="#ef4444"
          />
        </div>
      </div>

      {/* Distribution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty Distribution */}
        <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.primary }}>
            Learners by Faculty
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.facultyDistribution)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([faculty, count]) => {
                const percentage = ((count / stats.totalLearners) * 100).toFixed(1);
                return (
                  <div key={faculty}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium" style={{ color: COLORS.primary }}>
                        {faculty}
                      </span>
                      <span className="text-sm text-gray-600">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.bgLight }}>
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: COLORS.primary
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* SETA Distribution */}
        <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.primary }}>
            Learners by SETA
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.setaDistribution)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([seta, count]) => {
                const percentage = ((count / stats.totalLearners) * 100).toFixed(1);
                return (
                  <div key={seta}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium" style={{ color: COLORS.primary }}>
                        {seta}
                      </span>
                      <span className="text-sm text-gray-600">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.bgLight }}>
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: COLORS.secondary
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="rounded-lg p-6 shadow-sm border" style={{ backgroundColor: COLORS.bgWhite, borderColor: COLORS.border }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.primary }}>
          Quick Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
            <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>
              {stats.totalPlacements}
            </p>
            <p className="text-xs text-gray-600 mt-1">Total Placements</p>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
            <p className="text-2xl font-bold" style={{ color: COLORS.success }}>
              {stats.placedLearners}
            </p>
            <p className="text-xs text-gray-600 mt-1">Placed Learners</p>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
            <p className="text-2xl font-bold" style={{ color: COLORS.warning }}>
              {stats.unplacedLearners}
            </p>
            <p className="text-xs text-gray-600 mt-1">Unplaced Learners</p>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
            <p className="text-2xl font-bold" style={{ color: COLORS.info }}>
              {stats.totalCapacity}
            </p>
            <p className="text-xs text-gray-600 mt-1">Total Capacity</p>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
            <p className="text-2xl font-bold" style={{ color: COLORS.secondary }}>
              {stats.utilizationRate}%
            </p>
            <p className="text-xs text-gray-600 mt-1">Utilization</p>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
            <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>
              {stats.activeFundingWindows}
            </p>
            <p className="text-xs text-gray-600 mt-1">Active Windows</p>
          </div>
        </div>
      </div>
    </div>
  );
}