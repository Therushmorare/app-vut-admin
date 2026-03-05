"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Mail,
  FileText,
  Plus,
} from "lucide-react";
import { COLORS } from "../../utils/helpers";

export default function AdminFormManagement() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    setForms([
      { formId: "1", title: "Training 1", createdOn: "2026-03-01", responses: 15 },
      { formId: "2", title: "Survey 2", createdOn: "2026-02-28", responses: 12 },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
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

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">

              {/* Table Head */}
              <thead className="bg-[#201c52] bg-opacity-5 border-b border-gray-200">
                <tr className="text-gray-600 uppercase text-xs tracking-wide">
                  <th className="text-left px-6 py-4 font-semibold">
                    Form Name
                  </th>
                  <th className="text-left px-6 py-4 font-semibold">
                    Created On
                  </th>
                  <th className="text-left px-6 py-4 font-semibold">
                    Responses
                  </th>
                  <th className="text-right px-6 py-4 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-100">
                {forms.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center text-gray-400">
                      No forms created yet.
                    </td>
                  </tr>
                ) : (
                  forms.map((form) => (
                    <tr
                      key={form.formId}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3 font-medium text-gray-900">
                          <FileText className="w-4 h-4 text-gray-400" />
                          {form.title}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {form.createdOn}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {form.responses}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-right space-x-3">
                        <Link href={`/admin/form/${form.formId}`}>
                          <button
                            className="px-4 py-2 text-sm rounded-lg font-medium hover:bg-gray-100 transition"
                            style={{ color: COLORS.text }}
                          >
                            View
                          </button>
                        </Link>

                        <Link href={`/admin/edit-form/${form.formId}`}>
                          <button
                            className="px-4 py-2 text-sm rounded-lg font-medium hover:bg-gray-100 transition"
                            style={{ color: COLORS.danger }}
                          >
                            Edit
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}