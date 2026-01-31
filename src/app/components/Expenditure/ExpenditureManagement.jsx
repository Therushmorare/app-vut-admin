"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "../../utils/helpers";
import { Wallet, TrendingDown, Coins } from "lucide-react";

const API_BASE =
  "https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators";

const CHART_COLORS = [
  "#6366f1", // indigo
  "#22c55e", // green
  "#f59e0b", // amber
  "#ec4899", // pink
  "#0ea5e9", // sky
  "#8b5cf6", // violet
  "#14b8a6", // teal
  "#ef4444"  // red (only when needed)
];

export default function ExpenditureManagement() {
  const [fundingWindows, setFundingWindows] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [stipends, setStipends] = useState({});
  const [agreementId, setAgreementId] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/getFundingWindows/`)
      .then(r => r.json())
      .then(setFundingWindows);

    fetch(`${API_BASE}/getProgrammes/`)
      .then(r => r.json())
      .then(setProgrammes);

    fetch(`${API_BASE}/learner-allocations`)
      .then(r => r.json())
      .then(d => setAllocations(d.allocations || []));
  }, []);

  useEffect(() => {
    programmes.forEach(p => {
      fetch(`${API_BASE}/stipend-budget/${p.programme_id}`)
        .then(r => r.json())
        .then(data =>
          setStipends(prev => ({
            ...prev,
            [p.programme_id]: data,
          }))
        );
    });
  }, [programmes]);

  const scopedProgrammes = useMemo(
    () =>
      agreementId
        ? programmes.filter(p => p.agreement_id === agreementId)
        : programmes,
    [programmes, agreementId]
  );

  const scopedAllocations = useMemo(
    () =>
      agreementId
        ? allocations.filter(a => a.agreement_id === agreementId)
        : allocations,
    [allocations, agreementId]
  );

  const totalBudget = scopedProgrammes.reduce(
    (sum, p) => sum + p.budget,
    0
  );

  const allocatedBudget = scopedProgrammes.reduce((sum, p) => {
    const learners = scopedAllocations.filter(
      a => a.programme_id === p.programme_id
    ).length;

    const stipend = stipends[p.programme_id];
    return stipend
      ? sum + learners * stipend.yearly_stipend_per_student
      : sum;
  }, 0);

  const remainingBudget = totalBudget - allocatedBudget;

  const getStatus = (used, total) => {
    const pct = (used / total) * 100;
    if (pct >= 100) return "EXHAUSTED";
    if (pct >= 80) return "WARNING";
    return "OK";
  };

  const pieData = [
    { name: "Allocated", value: allocatedBudget },
    { name: "Remaining", value: remainingBudget },
  ];

  const barData = scopedProgrammes.map(p => {
    const learners = scopedAllocations.filter(
      a => a.programme_id === p.programme_id
    ).length;

    const stipend = stipends[p.programme_id];
    const used = stipend
      ? learners * stipend.yearly_stipend_per_student
      : 0;

    return {
      name: p.programme_name,
      Used: used,
      Remaining: p.budget - used,
    };
  });

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: COLORS.bgLight }}>
        <div className="max-w-7xl mx-auto">

            <div className="p-6 space-y-6">

            <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>Budget Management</h2>

            {/* Agreement Selector */}
            <select
                value={agreementId}
                onChange={e => setAgreementId(e.target.value)}
                className="border p-2 rounded"
            >
                <option value="">All Agreements</option>
                {fundingWindows.map(fw => (
                <option key={fw.agreement_id} value={fw.agreement_id}>
                    {fw.name}
                </option>
                ))}
            </select>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                title="Total Budget"
                value={`R ${totalBudget.toLocaleString()}`}
                icon={Wallet}
                color="#10b981" // green
              />

              <StatCard
                title="Allocated"
                value={`R ${allocatedBudget.toLocaleString()}`}
                icon={TrendingDown}
                color="#ef4444" // red
              />

              <StatCard
                title="Remaining"
                value={`R ${remainingBudget.toLocaleString()}`}
                icon={Coins}
                color="#f59e0b" // amber
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                  title="Overall Budget Distribution"
                  subtitle="Allocated vs Remaining"
                >
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={75}
                        outerRadius={100}
                        paddingAngle={4}
                      >
                        {pieData.map((_, index) => (
                          <Cell
                            key={index}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={(value) => `R ${value.toLocaleString()}`}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Programme Budget Burn-down"
                  subtitle="Used vs Remaining per programme"
                >
                  <ResponsiveContainer width="100%" height={340}>
                    <BarChart
                      data={barData}
                      barSize={26}
                      margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tickFormatter={(value) => `R${value / 1_000_000}M`}
                      />
                      <Tooltip
                        formatter={(value) => `R ${value.toLocaleString()}`}
                      />
                      <Legend />

                      <Bar
                        dataKey="Used"
                        radius={[6, 6, 0, 0]}
                        fill="#6366f1"
                      />
                      <Bar
                        dataKey="Remaining"
                        radius={[6, 6, 0, 0]}
                        fill="#22c55e"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

            </div>

            {/* Programme Table */}
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr className="border-b">
                      <th className="px-5 py-4 text-left font-semibold text-gray-700">
                        Programme
                      </th>
                      <th className="px-5 py-4 text-right font-semibold text-gray-700">
                        Budget
                      </th>
                      <th className="px-5 py-4 text-right font-semibold text-gray-700">
                        Used
                      </th>
                      <th className="px-5 py-4 text-right font-semibold text-gray-700">
                        Remaining
                      </th>
                      <th className="px-5 py-4 text-center font-semibold text-gray-700">
                        Runway
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {scopedProgrammes.map(p => {
                      const learners = scopedAllocations.filter(
                        a => a.programme_id === p.programme_id
                      ).length;

                      const stipend = stipends[p.programme_id];
                      const used = stipend
                        ? learners * stipend.yearly_stipend_per_student
                        : 0;

                      const remaining = p.budget - used;

                      const monthlyBurn = stipend
                        ? stipend.monthly_stipend_per_student * learners
                        : 0;

                      const runway =
                        monthlyBurn > 0
                          ? Math.floor(remaining / monthlyBurn)
                          : null;

                      const status = getStatus(used, p.budget);
                      const percentUsed = Math.min((used / p.budget) * 100, 100);

                      return (
                        <tr
                          key={p.programme_id}
                          className="hover:bg-gray-50 transition"
                        >
                          {/* Programme */}
                          <td className="px-5 py-4">
                            <div className="font-medium text-gray-900">
                              {p.programme_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {learners} learners
                            </div>
                          </td>

                          {/* Budget */}
                          <td className="px-5 py-4 text-right font-medium">
                            R {p.budget.toLocaleString()}
                          </td>

                          {/* Used */}
                          <td className="px-5 py-4 text-right text-gray-700">
                            R {used.toLocaleString()}
                          </td>

                          {/* Remaining + Status */}
                          <td className="px-5 py-4 text-right">
                            <div className="font-semibold text-gray-900">
                              R {remaining.toLocaleString()}
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  status === "EXHAUSTED"
                                    ? "bg-red-500"
                                    : status === "WARNING"
                                    ? "bg-yellow-400"
                                    : "bg-green-500"
                                }`}
                                style={{ width: `${percentUsed}%` }}
                              />
                            </div>

                            {/* Status Pill */}
                            {status !== "OK" && (
                              <span
                                className={`inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-full ${
                                  status === "EXHAUSTED"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {status}
                              </span>
                            )}
                          </td>

                          {/* Runway */}
                          <td className="px-5 py-4 text-center font-medium">
                            {runway !== null ? (
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  runway <= 3
                                    ? "bg-red-100 text-red-700"
                                    : runway <= 6
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {runway} months
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            </div>

        </div>
    </div>
    
  );
}

/* ================= SMALL COMPONENTS ================= */

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

const ChartCard = ({ title, children, icon, className }) => (
  <div className={`bg-white rounded-2xl shadow-md border border-gray-200 p-5 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>

    <div className="relative">
      {children}
      {/* Optional: subtle background overlay for charts */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-b from-white/60 to-white/0" />
    </div>
  </div>
);
