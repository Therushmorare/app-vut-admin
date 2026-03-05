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

export default function AdminFormManagement(){
  const [forms, setForms] = useState([]);

  useEffect(() => {
    // Mock fetch forms
    setForms([
        { formId: "1", title: "Training 1", createdOn: "2026-03-01", responses: 15 },
        { formId: "2", title: "Survey 2", createdOn: "2026-02-28", responses: 12 },
    ]);
    }, []);

    return (
    <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-end">
        <Link href="/pages/designer">
          <button 
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity shadow-md mb-4"
          style={{ backgroundColor: COLORS.text }}
          >
        <Plus className="w-5 h-5" /> Create Form
          </button>
        </Link>
      </div>

    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#201c52] bg-opacity-5 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-white cursor-pointer hover:bg-[#201c52] hover:bg-opacity-10 transition-colors">
                <div className="flex items-center space-x-1">
                    Form Name
                </div>
                </th>
              <th className="text-left p-4 font-semibold text-white cursor-pointer hover:bg-[#201c52] hover:bg-opacity-10 transition-colors">
                <div className="flex items-center space-x-1">
                    Created On
                </div>
             </th>
              <th className="text-left p-4 font-semibold text-white cursor-pointer hover:bg-[#201c52] hover:bg-opacity-10 transition-colors">
                <div className="flex items-center space-x-1">
                    Responses
                </div>
                </th>
              <th className="text-left p-4 font-semibold text-white cursor-pointer hover:bg-[#201c52] hover:bg-opacity-10 transition-colors">
                <div className="flex items-center space-x-1">
                    Actions
                </div>
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
                    >View</button>
                  </Link>
                  <Link href={`/admin/edit-form/${form.formId}`}>
                    <button 
                        className="p-2 rounded-lg hover:bg-gray-100"
                        style={{ color: COLORS.danger }}
                    >Edit</button>
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
