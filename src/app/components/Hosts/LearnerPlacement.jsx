"use client";
import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { COLORS } from '../../utils/helpers';

const normalizeId = (id) => id ? String(id).toLowerCase() : '';

export default function LearnerPlacementForm({ 
  placement = null,
  companyId, 
  availableLearners = [], 
  studentInfo = [],
  onSubmit, 
  onCancel 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // ---------------- SELECTED LEARNERS ----------------
  const [selectedLearners, setSelectedLearners] = useState(() => {
    if (placement) {
      const id = placement.student_id ?? placement.learnerId ?? placement.studentId;
      return id ? [normalizeId(id)] : [];
    }
    return [];
  });

  // ---------------- FORM DATA ----------------
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
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // ---------------- STUDENT LOOKUP ----------------
  const studentMap = useMemo(() => {
    return studentInfo.reduce((acc, s) => {
      acc[normalizeId(s.id)] = s;
      return acc;
    }, {});
  }, [studentInfo]);

  // ---------------- ENRICH + DEDUPE ALLOCATIONS ----------------
  const enrichedLearners = useMemo(() => {
    const seen = new Set();
    return availableLearners
      .map(allocation => {
        const studentId = allocation.student_id ?? allocation.studentId ?? allocation.learner_id;
        if (!studentId) return null;

        const normalizedId = normalizeId(studentId);
        const student = studentMap[normalizedId];
        if (!student || seen.has(student.id)) return null;

        seen.add(student.id);

        return {
          studentId: normalizeId(student.id),
          firstName: student.first_name || '',
          lastName: student.last_name || '',
          email: student.email || '',
          phone: student.phone || '',
          programme: student.programme || '',
          faculty: student.faculty || '',
          setaProgrammeId: allocation.programme_id || null,
          fundingWindowId: allocation.funding_window_id || null
        };
      })
      .filter(Boolean);
  }, [availableLearners, studentMap]);

  // ---------------- FILTER ----------------
  const filteredLearners = useMemo(() => {
    if (!searchTerm) return enrichedLearners;
    const search = searchTerm.toLowerCase();
    return enrichedLearners.filter(l => {
      const fullName = `${l.firstName} ${l.lastName}`.toLowerCase();
      return fullName.includes(search) || l.studentId.includes(search) || l.programme.toLowerCase().includes(search);
    });
  }, [enrichedLearners, searchTerm]);

  // ---------------- HANDLERS ----------------
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleToggleLearner = (studentId) => {
    if (placement) return;
    const normalized = normalizeId(studentId);
    setSelectedLearners(prev =>
      prev.includes(normalized)
        ? prev.filter(id => id !== normalized)
        : [...prev, normalized]
    );
    if (errors.learners) setErrors(prev => ({ ...prev, learners: '' }));
  };

  const handleSelectAll = () => {
    if (placement) return;
    if (selectedLearners.length === filteredLearners.length) {
      setSelectedLearners([]);
    } else {
      setSelectedLearners(filteredLearners.map(l => l.studentId));
    }
  };

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const newErrors = {};
    if (!placement && selectedLearners.length === 0) newErrors.learners = 'Please select at least one learner';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.supervisorName) newErrors.supervisorName = 'Supervisor name is required';
    if (!formData.supervisorEmail) newErrors.supervisorEmail = 'Supervisor email is required';
    if (!formData.supervisorPhone) newErrors.supervisorPhone = 'Supervisor phone is required';
    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (!validate()) return;

    const adminId = sessionStorage.getItem('admin_id');
    if (!adminId) return setErrors({ api: 'Administrator session expired. Please log in again.' });
    if (!companyId) return setErrors({ api: 'Please select a valid company before placing learners.' });

    const learnersToSubmit = (placement ? [selectedLearners[0]] : selectedLearners).filter(Boolean);
    if (learnersToSubmit.length === 0) return setErrors({ api: 'No learners selected for placement.' });

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    const failed = [];
    const success = [];

    for (const student_id of learnersToSubmit) {
      try {
        const learnerData = enrichedLearners.find(l => l.studentId === student_id);
        const res = await fetch('https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/place-learner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            administrator_id: adminId,
            student_id,
            company_id: companyId,
            start_date: formData.startDate || null,
            end_date: formData.endDate || null,
            supervisor: formData.supervisorName || '',
            supervisor_email: formData.supervisorEmail || '',
            supervisor_phone: formData.supervisorPhone || '',
            status: formData.status || 'Pending',
            comments: formData.notes || '',
            programme_id: learnerData?.setaProgrammeId || null
          })
        });

        if (!res.ok) {
          const contentType = res.headers.get('content-type');
          const errorBody = contentType?.includes('application/json')
            ? JSON.stringify(await res.json(), null, 2)
            : await res.text();
          failed.push(`Student ${student_id}: HTTP ${res.status} - ${errorBody}`);
        } else {
          success.push(student_id);
        }

        await new Promise(r => setTimeout(r, 300));
      } catch (err) {
        failed.push(`Student ${student_id}: ${err.message || 'Unexpected error'}`);
      }
    }

    if (failed.length > 0) setErrors({ api: failed.join(' | ') });
    if (success.length > 0) setSuccessMessage(`Successfully placed ${success.length} learner(s)`);
    setLoading(false);
  };

  const allSelected = filteredLearners.length > 0 && selectedLearners.length === filteredLearners.length;
  /* ---------------- UI ---------------- */
  return (
  <div className="flex flex-col md:flex-row gap-6">

    {/* ---------------- LEFT: Learner Selection ---------------- */}
    <div className="flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold" style={{ color: COLORS.primary }}>
          Select Learners {!placement && '*'}
        </h3>
        {!placement && (
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-sm font-medium"
            style={{ color: COLORS.primary }}
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        )}
      </div>

      <div className="relative mb-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search learners..."
          className="w-full pl-9 pr-4 py-2 border rounded-lg"
        />
      </div>

      {enrichedLearners.length === 0 ? (
        <div className="flex-1 rounded-lg p-6 text-center bg-gray-50">
          <p className="text-gray-600 mb-1">No learners available for placement</p>
          <p className="text-sm text-gray-500">
            Learners must be allocated to the same SETA before placement.
          </p>
        </div>
      ) : (
        <div className="flex-1 border rounded-lg overflow-y-auto max-h-[300px]">
          {filteredLearners.map(l => {
            const selected = selectedLearners.includes(l.studentId);
            return (
              <div
                key={l.studentId}
                onClick={() => handleToggleLearner(l.studentId)}
                className={`flex items-center justify-between p-3 cursor-pointer ${
                  selected ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div>
                  <p className="font-semibold">{l.firstName} {l.lastName}</p>
                  <p className="text-xs text-gray-600">
                    {l.studentId} • {l.programme || 'No programme'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={selected}
                  readOnly
                  className="w-4 h-4"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>

    {/* ---------------- RIGHT: Placement Details ---------------- */}
    <div className="flex-1 flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="date"
          value={formData.startDate}
          onChange={e => handleChange('startDate', e.target.value)}
          className="border rounded-lg px-3 py-2"
          placeholder="Start Date"
        />
        <input
          type="date"
          value={formData.endDate}
          onChange={e => handleChange('endDate', e.target.value)}
          className="border rounded-lg px-3 py-2"
          placeholder="End Date"
        />
      </div>

      <input
        type="text"
        placeholder="Supervisor Name"
        value={formData.supervisorName}
        onChange={e => handleChange('supervisorName', e.target.value)}
        className="border rounded-lg px-3 py-2"
      />
      <input
        type="email"
        placeholder="Supervisor Email"
        value={formData.supervisorEmail}
        onChange={e => handleChange('supervisorEmail', e.target.value)}
        className="border rounded-lg px-3 py-2"
      />
      <input
        type="tel"
        placeholder="Supervisor Phone"
        value={formData.supervisorPhone}
        onChange={e => handleChange('supervisorPhone', e.target.value)}
        className="border rounded-lg px-3 py-2"
      />

      <select
        value={formData.status}
        onChange={e => handleChange('status', e.target.value)}
        className="border rounded-lg px-3 py-2"
      >
        <option value="Active">Active</option>
        <option value="Completed">Completed</option>
        <option value="On Hold">On Hold</option>
        <option value="Terminated">Terminated</option>
      </select>

      <textarea
        placeholder="Notes"
        value={formData.notes}
        onChange={e => handleChange('notes', e.target.value)}
        className="border rounded-lg px-3 py-2 h-24 resize-none"
      />

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 border rounded-lg px-4 py-2 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 rounded-lg px-4 py-2 text-white disabled:opacity-60"
          style={{ backgroundColor: COLORS.success }}
        >
          {loading
            ? 'Placing...'
            : placement
              ? 'Update Placement'
              : `Place ${selectedLearners.length} Learner(s)`
          }
        </button>      
  </div>
    </div>

  </div>

  );
}