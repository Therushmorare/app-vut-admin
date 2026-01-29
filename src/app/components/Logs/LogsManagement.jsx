"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { COLORS, formatDate } from "../../utils/helpers";

// API endpoint
const API_URL =
  "https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/user-logs";

const PAGE_SIZE = 10;

export default function LogsManagement() {
  const [authorized, setAuthorized] = useState(null); // null = checking
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [userType, setUserType] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch logs
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        const matchesUserType =
          !userType || log.user_type === userType;

        const matchesSearch =
          !search ||
          log.action_type.toLowerCase().includes(search.toLowerCase()) ||
          log.user_id.toLowerCase().includes(search.toLowerCase());

        const logDate = new Date(log.created_at);

        const matchesStart =
          !startDate || logDate >= new Date(startDate);

        const matchesEnd =
          !endDate || logDate <= new Date(endDate + "T23:59:59");

        return (
          matchesUserType &&
          matchesSearch &&
          matchesStart &&
          matchesEnd
        );
      })
      .sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
  }, [logs, userType, search, startDate, endDate]);

  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE);

  const paginatedLogs = filteredLogs.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const exportCSV = () => {
    const headers = ["User ID", "User Type", "Action", "Date"];

    const rows = filteredLogs.map((log) => [
      log.user_id,
      log.user_type,
      log.action_type,
      new Date(log.created_at).toLocaleString(),
    ]);

    const csv =
      headers.join(",") +
      "\n" +
      rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "system-logs.csv";
    a.click();

    URL.revokeObjectURL(url);
  };
    return (
    <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div>
            <h1 className="text-2xl font-semibold text-gray-900">
                System Logs
            </h1>
            <p className="text-sm text-gray-500">
                Track system activity and user actions
            </p>
            </div>

            <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg w-full sm:w-auto justify-center hover:bg-gray-800 transition"
            >
            <Download size={16} />
            Export CSV
            </button>
        </div>

        {/* Filters */}
        <div
            className="rounded-xl p-5 border border-gray-200 shadow-sm bg-white"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <select
                value={userType}
                onChange={(e) => {
                setPage(1);
                setUserType(e.target.value);
                }}
                className="w-full pl-3 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-black focus:outline-none"
                style={{ borderColor: COLORS.border }}
            >
                <option value="">All User Types</option>
                <option value="Super Administrator">Super Administrator</option>
                <option value="Institution Administrator">
                Institution Administrator
                </option>
                <option value="student">Student</option>
            </select>

            <div className="relative w-full">
                <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                type="text"
                placeholder="Search action or user ID"
                value={search}
                onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                }}
                className="border pl-9 pr-3 py-2.5 rounded-lg w-full text-sm focus:ring-2 focus:ring-black focus:outline-none"
                style={{ borderColor: COLORS.border }}
                />
            </div>

            <input
                type="date"
                value={startDate}
                onChange={(e) => {
                setPage(1);
                setStartDate(e.target.value);
                }}
                className="border p-2.5 rounded-lg w-full text-sm focus:ring-2 focus:ring-black focus:outline-none"
                style={{ borderColor: COLORS.border }}
            />

            <input
                type="date"
                value={endDate}
                onChange={(e) => {
                setPage(1);
                setEndDate(e.target.value);
                }}
                className="border p-2.5 rounded-lg w-full text-sm focus:ring-2 focus:ring-black focus:outline-none"
                style={{ borderColor: COLORS.border }}
            />
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                    {["User ID", "User Type", "Action", "Date"].map((title) => (
                    <th
                        key={title}
                        className="text-left px-6 py-4 font-semibold text-gray-700 uppercase tracking-wide"
                    >
                        {title}
                    </th>
                    ))}
                </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                {loading ? (
                    <tr>
                    <td colSpan="4" className="p-6 text-center text-gray-500">
                        Loading...
                    </td>
                    </tr>
                ) : paginatedLogs.length === 0 ? (
                    <tr>
                    <td colSpan="4" className="p-6 text-center text-gray-500">
                        No logs found
                    </td>
                    </tr>
                ) : (
                    paginatedLogs.map((log, idx) => (
                    <tr
                        key={idx}
                        className="hover:bg-gray-50 transition-colors"
                    >
                        <td className="px-6 py-4 font-mono text-xs text-gray-800">
                        {log.user_id}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                        {log.user_type}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                        {log.action_type}
                        </td>
                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
            >
                <ChevronLeft size={16} />
            </button>

            <span className="text-sm text-gray-600">
                Page <span className="font-medium">{page}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
            </span>

            <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
            >
                <ChevronRight size={16} />
            </button>
            </div>
        )}
        </div>
    </div>
    );

}