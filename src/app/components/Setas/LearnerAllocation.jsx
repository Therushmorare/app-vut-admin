"use client";
import React, { useState, useMemo } from "react";
import { Search, User, CheckCircle } from "lucide-react";
import { COLORS } from "../../utils/helpers";
import axios from "axios";

export default function LearnerAllocationForm({
  fundingWindow,
  agreement,
  programmes, // ✅ programmes FOR THIS funding window
  allStudents,
  allocatedLearners,
  onSubmit,
  onCancel,
}) {
  const [selectedProgrammeId, setSelectedProgrammeId] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFaculty, setFilterFaculty] = useState("");
  const [filterProgramme, setFilterProgramme] = useState("");

  // ✅ SAFE DEFAULTS (prevents undefined.map crashes)
  const safeProgrammes = Array.isArray(programmes) ? programmes : [];
  const safeStudents = Array.isArray(allStudents) ? allStudents : [];
  const safeAllocations = Array.isArray(allocatedLearners) ? allocatedLearners : [];

  const allocatedStudentIds = safeAllocations.map(l => l.studentId);

  const remainingSlots =
    fundingWindow.slots_available -
    safeAllocations.filter(
      l => l.fundingWindowId === fundingWindow.funding_window_id
    ).length;

  const faculties = [
    ...new Set(safeStudents.map(s => s.faculty).filter(Boolean)),
  ];

  const programmeFilters = [
    ...new Set(safeStudents.map(s => s.programme).filter(Boolean)),
  ];

  const availableStudents = useMemo(() => {
    return safeStudents.filter(student => {
      if (student.status !== "Pending") return false;
      if (allocatedStudentIds.includes(student.id)) return false;

      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        const match =
          student.first_name?.toLowerCase().includes(s) ||
          student.id?.toLowerCase().includes(s) ||
          student.student_number?.toLowerCase().includes(s) ||
          student.email?.toLowerCase().includes(s) ||
          student.ID_number?.toLowerCase().includes(s);

        if (!match) return false;
      }

      if (filterFaculty && student.faculty !== filterFaculty) return false;
      if (filterProgramme && student.programme !== filterProgramme) return false;

      return true;
    });
  }, [
    safeStudents,
    searchTerm,
    filterFaculty,
    filterProgramme,
    allocatedStudentIds,
  ]);

  const handleToggleStudent = student => {
    if (selectedStudents.find(s => s.id === student.id)) {
      setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
    } else {
      if (selectedStudents.length >= remainingSlots) {
        alert(`You can only allocate ${remainingSlots} learner(s)`);
        return;
      }
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProgrammeId) {
      alert("Please select a programme");
      return;
    }

    if (selectedStudents.length === 0) {
      alert("Please select at least one learner");
      return;
    }

    try {
      const payload = {
        administrator_id: sessionStorage.getItem("admin_id"),
        students: selectedStudents.map(s => ({
          student_id: s.id,
        })),
      };

      await axios.post(
        `https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/programmes/${selectedProgrammeId}/allocate-learners`,
        payload,
        { withCredentials: true }
      );

      const allocations = selectedStudents.map(student => ({
        fundingWindowId: fundingWindow.funding_window_id,
        agreementId: agreement.agreement_id,
        programmeId: selectedProgrammeId,
        studentId: student.id,
        firstName: student.first_name,
        lastName: student.last_name,
        programme: student.programme,
      }));

      onSubmit(allocations);
    } catch (err) {
      console.error("Allocation failed:", err);
      alert(err.response?.data?.message || "Failed to allocate learners");
    }
  };

  return (
    <div className="space-y-4">

      {/* Programme Selector */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
        <label className="block text-sm font-semibold mb-1">
          Select Programme
        </label>
        <select
          value={selectedProgrammeId}
          onChange={e => setSelectedProgrammeId(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg text-sm"
        >
          <option value="">-- Select Programme --</option>
          {safeProgrammes.map(p => (
            <option key={p.programme_id} value={p.programme_id}>
              {p.programme_name}
            </option>
          ))}
        </select>
      </div>

      {/* Window Info */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.bgLight }}>
        <h3 className="font-semibold" style={{ color: COLORS.primary }}>
          {fundingWindow.funding_window_name}
        </h3>
        <p className="text-sm text-gray-600">
          {agreement.name} – {agreement.reference_number}
        </p>
        <div className="mt-2 flex gap-4 text-sm">
          <span><strong>Slots:</strong> {remainingSlots}</span>
          <span><strong>Selected:</strong> {selectedStudents.length}</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, student number, ID, email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select
            value={filterFaculty}
            onChange={e => setFilterFaculty(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Faculties</option>
            {faculties.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          <select
            value={filterProgramme}
            onChange={e => setFilterProgramme(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Programmes</option>
            {programmeFilters.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student List */}
      <div className="border rounded-lg max-h-96 overflow-y-auto">
        {availableStudents.length ? (
          availableStudents.map(student => {
            const isSelected = selectedStudents.some(s => s.id === student.id);
            return (
              <div
                key={student.id}
                onClick={() => handleToggleStudent(student)}
                className={`p-4 cursor-pointer ${
                  isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                    isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
                  }`}>
                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <User className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="font-semibold">{student.first_name}</p>
                    <p className="text-xs text-gray-600">{student.email}</p>
                    <p className="text-xs text-gray-500">{student.programme}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="p-6 text-center text-gray-500">
            No available students found
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button onClick={onCancel} className="flex-1 border px-4 py-2 rounded-lg">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selectedStudents.length}
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Allocate {selectedStudents.length} Learner(s)
        </button>
      </div>
    </div>
  );
}