"use client";

import React, { useEffect, useState, useMemo } from "react";
import { COLORS } from '../../utils/helpers';
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";

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

    // Client-side role check (SSR SAFE)
    useEffect(() => {
    const adminId = sessionStorage.getItem("admin_id");

    if (!adminId) {
        sessionStorage.clear();
        window.location.replace("/");
        return;
    }

    setAuthorized(true);
    }, []);

  // Stop rendering until auth check completes
  if (authorized === null) {
    return (
      <div className="p-10 text-center text-gray-500">
        Checking permissions...
      </div>
    );
  }

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
  <div className="space-y-6 w-full">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <h1 className="text-2xl font-semibold">System Logs</h1>

      <button
        onClick={exportCSV}
        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded w-full sm:w-auto justify-center"
      >
        <Download size={16} />
        Export CSV
      </button>
    </div>

    {/* Filters */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <select
        value={userType}
        onChange={(e) => {
          setPage(1);
          setUserType(e.target.value);
        }}
        className="border p-2 rounded w-full"
      >
        <option value="">All User Types</option>
        <option value="Super Administrator">Super Administrator</option>
        <option value="Institution Administrator">
          Institution Administrator
        </option>
        <option value="student">Student</option>
      </select>

      <div className="relative w-full">
        <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search action or user ID"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border pl-8 p-2 rounded w-full"
        />
      </div>

      <input
        type="date"
        value={startDate}
        onChange={(e) => {
          setPage(1);
          setStartDate(e.target.value);
        }}
        className="border p-2 rounded w-full"
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => {
          setPage(1);
          setEndDate(e.target.value);
        }}
        className="border p-2 rounded w-full"
      />
    </div>

    {/* Table */}
    <div className="border rounded overflow-x-auto">
      <table className="min-w-[700px] w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">User ID</th>
            <th className="p-3 text-left">User Type</th>
            <th className="p-3 text-left">Action</th>
            <th className="p-3 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="p-4 text-center">
                Loading...
              </td>
            </tr>
          ) : paginatedLogs.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center">
                No logs found
              </td>
            </tr>
          ) : (
            paginatedLogs.map((log, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-3 font-mono text-xs break-all">
                  {log.user_id}
                </td>
                <td className="p-3">{log.user_type}</td>
                <td className="p-3">{log.action_type}</td>
                <td className="p-3 whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="flex justify-center items-center gap-4 pt-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="p-2 border rounded disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="p-2 border rounded disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    )}
  </div>
);

}