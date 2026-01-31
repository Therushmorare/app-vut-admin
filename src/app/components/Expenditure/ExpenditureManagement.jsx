"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "../../utils/helpers";

const API_BASE =
  "https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators";

export default function ExpenditureManagement() {
  const [fundingWindows, setFundingWindows] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [stipends, setStipends] = useState({});
  const [agreementId, setAgreementId] = useState("");

  /* ================= FETCH ================= */

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

  /* ================= FILTERING ================= */

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

  /* ================= CALCULATIONS ================= */

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

  /* ================= CHART DATA ================= */

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

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Budget Management</h1>

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
        <Card title="Total Budget" value={`R ${totalBudget.toLocaleString()}`} />
        <Card
          title="Allocated"
          value={`R ${allocatedBudget.toLocaleString()}`}
        />
        <Card
          title="Remaining"
          value={`R ${remainingBudget.toLocaleString()}`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Overall Budget Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={60}>
                <Cell fill="#E94E68" />
                <Cell fill="#4CAF50" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Programme Burn-down">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Used" fill="#E94E68" />
              <Bar dataKey="Remaining" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Programme Table */}
      <div className="bg-white border rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Programme</th>
              <th className="p-3 text-center">Budget</th>
              <th className="p-3 text-center">Used</th>
              <th className="p-3 text-center">Remaining</th>
              <th className="p-3 text-center">Runway</th>
            </tr>
          </thead>
          <tbody>
            {scopedProgrammes.map(p => {
              const learners = scopedAllocations.filter(
                a => a.programme_id === p.programme_id
              ).length;

              const stipend = stipends[p.programme_id];
              const used = stipend
                ? learners * stipend.yearly_stipend_per_student
                : 0;

              const monthlyBurn = stipend
                ? stipend.monthly_stipend_per_student * learners
                : 0;

              const runway =
                monthlyBurn > 0
                  ? Math.floor((p.budget - used) / monthlyBurn)
                  : null;

              const status = getStatus(used, p.budget);

              return (
                <tr key={p.programme_id} className="border-t">
                  <td className="p-3">{p.programme_name}</td>
                  <td className="p-3 text-center">
                    R {p.budget.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    R {used.toLocaleString()}
                  </td>
                  <td
                    className={`p-3 text-center font-semibold ${
                      status === "EXHAUSTED"
                        ? "text-red-700"
                        : status === "WARNING"
                        ? "text-yellow-600"
                        : "text-gray-800"
                    }`}
                  >
                    R {(p.budget - used).toLocaleString()}
                    {status !== "OK" && (
                      <span className="ml-2 text-xs px-2 py-1 rounded bg-red-100">
                        {status}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {runway !== null ? `${runway} months` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow border">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-4 rounded shadow border">
    <h3 className="font-semibold mb-2">{title}</h3>
    {children}
  </div>
);