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
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/create-form">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Create Form
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Form Name</th>
              <th className="p-2 text-left">Created On</th>
              <th className="p-2 text-left">Responses</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr key={form.formId} className="border-t">
                <td className="p-2">{form.title}</td>
                <td className="p-2">{form.createdOn}</td>
                <td className="p-2">{form.responses}</td>
                <td className="p-2">
                  <Link href={`/admin/form/${form.formId}`}>
                    <button className="text-blue-600 hover:underline mr-2">View</button>
                  </Link>
                  <Link href={`/admin/edit-form/${form.formId}`}>
                    <button className="text-green-600 hover:underline">Edit</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
