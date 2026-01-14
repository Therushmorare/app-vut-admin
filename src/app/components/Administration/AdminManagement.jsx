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
const TABLE_API_URL = "https://your-api-domain.com/admins"; // GET for table
const ADD_ADMIN_API_URL = "https://your-api-domain.com/add-admin"; // POST for form

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
      const res = await fetch(ADD_ADMIN_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newAdmin),
      });
      if (!res.ok) throw new Error("Failed to add admin");
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
      console.error(err);
      alert("Failed to add admin");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-10 text-center text-gray-500">Loading admins…</div>;
  }

  return (
    <div className="space-y-4">
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
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: COLORS.border }}>
        <table className="w-full">
          <thead style={{ backgroundColor: COLORS.bgLight }}>
            <tr>
              <th onClick={() => handleSort("name")} className="px-6 py-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  Name <SortIcon field="name" />
                </div>
              </th>
              <th className="px-6 py-3">Contact</th>
              <th onClick={() => handleSort("role")} className="px-6 py-3 cursor-pointer">
                Role <SortIcon field="role" />
              </th>
              <th onClick={() => handleSort("status")} className="px-6 py-3 cursor-pointer">
                Status <SortIcon field="status" />
              </th>
              <th onClick={() => handleSort("joined")} className="px-6 py-3 cursor-pointer">
                Joined <SortIcon field="joined" />
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
                    <Phone className="w-4 h-4 text-gray-400" /> {admin.phone}
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
                  {formatDate(admin.joined_at || admin.Joined_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- MODAL ---------------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Add New Admin</h2>
            <form className="space-y-3" onSubmit={handleAddAdmin}>
              {["first_name","last_name","email","phone","employee_number","role"].map(field => (
                <input
                  key={field}
                  type={field === "email" ? "email" : "text"}
                  placeholder={field.replace("_"," ").toUpperCase()}
                  value={newAdmin[field]}
                  onChange={e => setNewAdmin({...newAdmin, [field]: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              ))}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg mt-2"
              >
                {submitting ? "Adding…" : "Add Admin"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}