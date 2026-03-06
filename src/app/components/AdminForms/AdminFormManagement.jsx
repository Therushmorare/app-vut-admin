"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  FileText,
  Plus,
  X,
} from "lucide-react";
import { COLORS, formatDate } from "../../utils/helpers";

export default function AdminFormManagement() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch(
          "https://seta-api-3g5xl.ondigitalocean.app/api/administrators/all-forms",
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();

        // Map API response to your table fields
        const mappedForms = data.map((form) => ({
          formId: form.form_id,
          title: form.title,
          createdOn: new Date(form.created_at).toLocaleDateString(),
          responses: form.response_count
        }));

        setForms(mappedForms);
      } catch (err) {
        console.error("Failed to fetch forms:", err);
        setError("Failed to load forms.");
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  if (loading) return <div className="p-8">Loading forms...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Form Management
            </h1>
            <p className="text-gray-500 mt-1">
              Create and manage beneficiary tracking forms
            </p>
          </div>

          <Link href="/pages/designer">
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium hover:opacity-90 transition shadow-sm"
              style={{ backgroundColor: COLORS.text }}
            >
              <Plus className="w-5 h-5" />
              Create Form
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#201c52] bg-opacity-5 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-white cursor-pointer hover:bg-[#201c52] hover:bg-opacity-10 transition-colors">
                    Form Name
                  </th>
                  <th className="text-left p-4 font-semibold text-white cursor-pointer hover:bg-[#201c52] hover:bg-opacity-10 transition-colors">
                    Created On
                  </th>
                  <th className="text-left p-4 font-semibold text-white cursor-pointer hover:bg-[#201c52] hover:bg-opacity-10 transition-colors">
                    Responses
                  </th>
                  <th className="text-left p-4 font-semibold text-white cursor-pointer hover:bg-[#201c52] hover:bg-opacity-10 transition-colors">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {forms.map((form) => (
                  <tr key={form.formId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" /> {form.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" /> {form.createdOn}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" /> {form.responses}
                      </div>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Link href={`/admin/form/${form.formId}`}>
                        <button
                          className="p-2 rounded-lg hover:bg-gray-100"
                          style={{ color: COLORS.text }}
                        >
                          View
                        </button>
                      </Link>
                      <Link href={`/admin/edit-form/${form.formId}`}>
                        <button
                          className="p-2 rounded-lg hover:bg-gray-100"
                          style={{ color: COLORS.danger }}
                        >
                          Edit
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}