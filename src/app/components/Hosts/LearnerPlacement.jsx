"use client";
import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { COLORS } from '../../utils/helpers';

const normalizeId = (id) => String(id).toLowerCase();

export default function LearnerPlacementForm({ 
  placement = null,
  companyId, 
  availableLearners = [], 
  studentInfo = [],
  onSubmit, 
  onCancel 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  /* ---------------- SELECTED LEARNERS (NORMALIZED) ---------------- */
  const [selectedLearners, setSelectedLearners] = useState(
    placement
      ? [
          placement.student_id ??
          placement.learnerId ??
          placement.studentId
        ]
      : []
  );

  /* ---------------- FORM DATA ---------------- */
  const [formData, setFormData] = useState({
    startDate: placement?.startDate || '',
    endDate: placement?.endDate || '',
    supervisorName: placement?.supervisorName || '',
    supervisorEmail: placement?.supervisorEmail || '',
    supervisorPhone: placement?.supervisorPhone || '',
    status: placement?.status || 'Active',
    notes: placement?.notes || ''
  });

  const [errors, setErrors] = useState({});

  /* ---------------- STUDENT LOOKUP ---------------- */
  const studentMap = useMemo(() => {
    const map = studentInfo.reduce((acc, s) => {
      const key = normalizeId(s.id); // Normalize key here
      acc[key] = s;
      return acc;
    }, {});
    console.log('STUDENT MAP:', map);
    return map;
  }, [studentInfo]);

  /* ---------------- ENRICH + DEDUPE ALLOCATIONS ---------------- */
  const enrichedLearners = useMemo(() => {
    const seen = new Set();

    const result = availableLearners
      .map(allocation => {
        const studentId =
          allocation.student_id ??
          allocation.studentId ??
          allocation.learner_id;

        if (!studentId) return null;

        const student = studentMap[normalizeId(studentId)];

        if (!student) {
          console.warn('Missing studentInfo for allocation:', allocation);
          return null;
        }

        if (seen.has(student.id)) return null;
        seen.add(student.id);

        return {
          studentId: student.id,
          firstName: student.first_name ?? '',
          lastName: student.last_name ?? '',
          email: student.email ?? '',
          phone: student.phone ?? '',
          programme: student.programme ?? '',
          faculty: student.faculty ?? '',
          setaProgrammeId: allocation.programme_id,
          fundingWindowId: allocation.funding_window_id
        };
      })
      .filter(Boolean);

    console.log('ENRICHED LEARNERS:', result);
    return result;
  }, [availableLearners, studentMap]);

  /* ---------------- FILTER ---------------- */
  const filteredLearners = useMemo(() => {
    if (!searchTerm) return enrichedLearners;

    const search = searchTerm.toLowerCase();

    const result = enrichedLearners.filter(l => {
      const fullName = `${l.firstName} ${l.lastName}`.toLowerCase();
      const studentId = String(l.studentId).toLowerCase();
      const programme = l.programme?.toLowerCase() || '';

      return (
        fullName.includes(search) ||
        studentId.includes(search) ||
        programme.includes(search)
      );
    });

    console.log('FILTERED LEARNERS:', result);
    return result;
  }, [enrichedLearners, searchTerm]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleToggleLearner = (studentId) => {
    if (placement) return;

    setSelectedLearners(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );

    if (errors.learners) {
      setErrors(prev => ({ ...prev, learners: '' }));
    }
  };

  const handleSelectAll = () => {
    if (placement) return;

    if (selectedLearners.length === filteredLearners.length) {
      setSelectedLearners([]);
    } else {
      setSelectedLearners(
        filteredLearners.map(l => l.studentId).filter(Boolean)
      );
    }
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const newErrors = {};

    if (!placement && selectedLearners.length === 0) {
      newErrors.learners = 'Please select at least one learner';
    }

    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.supervisorName) newErrors.supervisorName = 'Supervisor name is required';
    if (!formData.supervisorEmail) newErrors.supervisorEmail = 'Supervisor email is required';
    if (!formData.supervisorPhone) newErrors.supervisorPhone = 'Supervisor phone is required';

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) <= new Date(formData.startDate)
    ) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = () => {
    if (!validate()) return;

    console.log('SUBMITTING WITH SELECTED LEARNERS:', selectedLearners);

    if (placement) {
      if (!selectedLearners[0]) return;

      onSubmit({
        ...formData,
        student_id: selectedLearners[0],
        companyId
      });
    } else {
      const uniqueLearners = [...new Set(selectedLearners)];

      onSubmit(
        uniqueLearners.map(student_id => ({
          ...formData,
          student_id,
          companyId
        }))
      );
    }
  };

  const allSelected =
    filteredLearners.length > 0 &&
    selectedLearners.length === filteredLearners.length;

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">

      {/* Learner Selection */}
      {enrichedLearners.length === 0 ? (
        <div className="rounded-lg p-6 text-center" style={{ backgroundColor: COLORS.bgLight }}>
          <p className="text-gray-600 mb-2">No learners available for placement</p>
          <p className="text-sm text-gray-500">
            Learners must be allocated to the same SETA before placement.
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium" style={{ color: COLORS.primary }}>
              Select Learners {!placement && '*'}
            </label>

            {!placement && (
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-sm"
                style={{ color: COLORS.primary }}
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search learners..."
              className="w-full pl-9 pr-4 py-2 border rounded-lg"
            />
          </div>

          <div className="border rounded-lg max-h-64 overflow-y-auto">
            {filteredLearners.map(l => {
              const selected = selectedLearners.includes(l.studentId);

              return (
                <div
                  key={l.studentId}
                  onClick={() => handleToggleLearner(l.studentId)}
                  className={`p-3 cursor-pointer ${
                    selected ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="font-semibold">
                    {l.firstName} {l.lastName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {l.studentId} • {l.programme || 'No programme'}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Placement Details */}
      <div className="grid grid-cols-2 gap-4">
        <input type="date" value={formData.startDate} onChange={e => handleChange('startDate', e.target.value)} />
        <input type="date" value={formData.endDate} onChange={e => handleChange('endDate', e.target.value)} />
      </div>

      <input placeholder="Supervisor Name" value={formData.supervisorName} onChange={e => handleChange('supervisorName', e.target.value)} />
      <input placeholder="Supervisor Email" value={formData.supervisorEmail} onChange={e => handleChange('supervisorEmail', e.target.value)} />
      <input placeholder="Supervisor Phone" value={formData.supervisorPhone} onChange={e => handleChange('supervisorPhone', e.target.value)} />

      <select value={formData.status} onChange={e => handleChange('status', e.target.value)}>
        <option value="Active">Active</option>
        <option value="Completed">Completed</option>
        <option value="On Hold">On Hold</option>
        <option value="Terminated">Terminated</option>
      </select>

      <textarea
        placeholder="Notes"
        value={formData.notes}
        onChange={e => handleChange('notes', e.target.value)}
      />

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button onClick={onCancel} className="flex-1 border rounded-lg px-4 py-2">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 rounded-lg px-4 py-2 text-white"
          style={{ backgroundColor: COLORS.success }}
        >
          {placement ? 'Update Placement' : `Place ${selectedLearners.length} Learner(s)`}
        </button>
      </div>
    </div>
  );
}