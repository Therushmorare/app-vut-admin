"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Plus,
  X,
} from "lucide-react";
import { COLORS, formatDate } from "../../utils/helpers";

// API endpoints
const TABLE_API_URL = "https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/allAdmins"; // GET for table

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    employee_number: "",
    role: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const itemsPerPage = 10;

  /* ---------------- FETCH TABLE DATA ---------------- */
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch(TABLE_API_URL, { credentials: "include" });
        const data = await res.json();
        setAdmins(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load admins", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const fullName = `${admin.first_name ?? ""} ${admin.last_name ?? ""}`.toLowerCase();

      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (
          !fullName.includes(search) &&
          !admin.email?.toLowerCase().includes(search) &&
          !admin.employee_number?.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      if (filterStatus && admin.status !== filterStatus) return false;
      if (filterRole && admin.role !== filterRole) return false;

      return true;
    });
  }, [admins, searchTerm, filterStatus, filterRole]);

  /* ---------------- SORT ---------------- */
  const sortedAdmins = useMemo(() => {
    if (!sortField) return filteredAdmins;

    return [...filteredAdmins].sort((a, b) => {
      let aVal, bVal;

      switch (sortField) {
        case "name":
          aVal = `${a.first_name} ${a.last_name}`;
          bVal = `${b.first_name} ${b.last_name}`;
          break;
        case "role":
          aVal = a.role;
          bVal = b.role;
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        case "joined":
          aVal = new Date(a.joined_at || a.Joined_at);
          bVal = new Date(b.joined_at || b.Joined_at);
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredAdmins, sortField, sortDirection]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(sortedAdmins.length / itemsPerPage);

  const paginatedAdmins = sortedAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 text-gray-400" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" style={{ color: COLORS.primary }} />
    ) : (
      <ChevronDown className="w-4 h-4" style={{ color: COLORS.primary }} />
    );
  };

  const getStatusBadge = (status) =>
    status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

  /* ---------------- ADD ADMIN ---------------- */
    const handleAddAdmin = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        administrator_id: sessionStorage.getItem("admin_id"),
        first_name: newAdmin.first_name.trim(),
        last_name: newAdmin.last_name.trim(),
        email: newAdmin.email.trim(),
        phone: newAdmin.phone.trim(),
        employee_number: newAdmin.employee_number.trim(),
        role: newAdmin.role.trim(),
      };

      const url = "/api/administrators/administrator/addAdministrator"; // backend endpoint
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include", // include session cookies if required
      });

      let data;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error(await response.text());
      }

      if (!response.ok) throw new Error(data?.message || data?.error || "Request failed");

      alert("Admin added successfully!");
      setShowModal(false);
      setNewAdmin({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        employee_number: "",
        role: "",
      });

    } catch (err) {
      console.error("Add admin failed:", err);
      alert(err.message || "Failed to add admin");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-10 text-center text-gray-500">Loading admins…</div>;
  }

  return (
   <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-7xl mx-auto">

      {/* ADD ADMIN BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" /> Add Admin
        </button>
      </div>

      {/* FILTERS */}
      <div className="rounded-lg p-4" style={{ backgroundColor: COLORS.bgWhite }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search name, email or employee number…"
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              style={{ borderColor: COLORS.border }}
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border rounded-lg"
            style={{ borderColor: COLORS.border }}
          >
            <option value="">All Roles</option>
            {[...new Set(admins.map((a) => a.role))].map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg"
            style={{ borderColor: COLORS.border }}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
          <thead className="bg-[#201c52] bg-opacity-5 border-b border-gray-200">
            <tr>
              <th onClick={() => handleSort("name")} className="text-left p-4 font-semibold text-white cursor-pointer hover:bg-[#201c52] hover:bg-opacity-10 transition-colors">
                <div className="flex items-center space-x-1">
                  <span>Name <SortIcon field="name" /></span>
                </div>
              </th>
              <th className="text-left p-4 font-semibold text-white cursor-pointer hover:bg-[#201c52] hover:bg-opacity-10 transition-colors">
                <div className="flex items-center space-x-1">
                <span>Contact</span>
                </div>
              </th>
              <th onClick={() => handleSort("role")} className="text-left p-4 font-semibold text-white cursor-pointer hover:bg-[#201c52] hover:bg-opacity-10 transition-colors">
                <div className="flex items-center space-x-1">
                  <span>Role <SortIcon field="role" /></span>
                </div>
              </th>
              <th onClick={() => handleSort("status")} className="text-left p-4 font-semibold text-white cursor-pointer hover:bg-[#201c52] hover:bg-opacity-10 transition-colors">
                <div className="flex items-center space-x-1">
                  Status <SortIcon field="status" />
                </div>
              </th>
              <th onClick={() => handleSort("joined")} className="text-left p-4 font-semibold text-white cursor-pointer hover:bg-[#201c52] hover:bg-opacity-10 transition-colors">
                <div className="flex items-center space-x-1">
                  Joined <SortIcon field="joined" />
                </div>
              </th>
            </tr>
          </thead>
            <tbody className="divide-y">
            {paginatedAdmins.map((admin) => (
              <tr key={admin.admin_id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-semibold">{admin.first_name} {admin.last_name}</p>
                      <p className="text-sm text-gray-500">{admin.employee_number}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" /> {admin.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" /> {admin.phone_number}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    <Shield className="w-3 h-3" /> {admin.role}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadge(admin.status)}`}>
                    {admin.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm">
                  <Calendar className="inline w-4 h-4 mr-1 text-gray-400" />
                  {formatDate(admin.joined_at)}
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
        {admins.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No Admins found matching your criteria</p>
          <button onClick={onClearFilters} className="text-[#5F9BEA] hover:text-[#201c52] font-medium">
            Clear filters to see all admins
          </button>
        </div>
        )}
        </div>


      {/* ---------------- MODAL ---------------- */}
    {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Add New Admin
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleAddAdmin} className="space-y-4 px-6 py-5">
            {[
              { key: "first_name", label: "First Name" },
              { key: "last_name", label: "Last Name" },
              { key: "email", label: "Email", type: "email" },
              { key: "phone", label: "Phone Number" },
              { key: "employee_number", label: "Employee Number" }
            ].map(({ key, label, type = "text" }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  value={newAdmin[key]}
                  onChange={e =>
                    setNewAdmin({ ...newAdmin, [key]: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  required
                />
              </div>
            ))}

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Role
              </label>
              <select
                value={newAdmin.role}
                onChange={e =>
                  setNewAdmin({ ...newAdmin, role: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                required
              >
                <option value="">Select role</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? "Adding…" : "Add Admin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </div>
  </div>
  );
}