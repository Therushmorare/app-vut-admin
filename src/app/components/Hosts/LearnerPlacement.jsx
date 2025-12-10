"use client"
import React, { useState, useMemo } from 'react';
import { Search, CheckCircle, User } from 'lucide-react';
import { COLORS } from '../../utils/helpers';

export default function LearnerPlacementForm({ 
  placement = null,
  companyId, 
  availableLearners = [], 
  onSubmit, 
  onCancel 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLearners, setSelectedLearners] = useState(
    placement ? [placement.learnerId] : []
  );
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

  const filteredLearners = useMemo(() => {
    if (!searchTerm) return availableLearners;
    
    const search = searchTerm.toLowerCase();
    return availableLearners.filter(learner => {
      const fullName = `${learner.firstName || ''} ${learner.lastName || ''}`.toLowerCase();
      const studentId = learner.studentId || learner.id || '';
      const programme = learner.programme || '';
      
      return (
        fullName.includes(search) ||
        studentId.toLowerCase().includes(search) ||
        programme.toLowerCase().includes(search)
      );
    });
  }, [availableLearners, searchTerm]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleToggleLearner = (learnerId) => {
    if (placement) return;
    
    setSelectedLearners(prev => {
      if (prev.includes(learnerId)) {
        return prev.filter(id => id !== learnerId);
      } else {
        return [...prev, learnerId];
      }
    });

    if (errors.learners) {
      setErrors(prev => ({ ...prev, learners: '' }));
    }
  };

  const handleSelectAll = () => {
    if (placement) return;
    
    if (selectedLearners.length === filteredLearners.length) {
      setSelectedLearners([]);
    } else {
      setSelectedLearners(filteredLearners.map(l => l.id));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (selectedLearners.length === 0) newErrors.learners = 'Please select at least one learner';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.supervisorName) newErrors.supervisorName = 'Supervisor name is required';
    if (!formData.supervisorEmail) newErrors.supervisorEmail = 'Supervisor email is required';
    if (!formData.supervisorPhone) newErrors.supervisorPhone = 'Supervisor phone is required';

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (placement) {
      onSubmit({
        ...formData,
        learnerId: selectedLearners[0],
        companyId
      });
    } else {
      const placements = selectedLearners.map(learnerId => ({
        ...formData,
        learnerId,
        companyId
      }));
      onSubmit(placements);
    }
  };

  const allSelected = filteredLearners.length > 0 && 
    selectedLearners.length === filteredLearners.length;

  return (
    <div className="space-y-6">
      {/* Available Learners Info */}
      {availableLearners.length === 0 ? (
        <div className="rounded-lg p-6 text-center" style={{ backgroundColor: COLORS.bgLight }}>
          <p className="text-gray-600 mb-2">No learners available for placement</p>
          <p className="text-sm text-gray-500">
            Learners must be allocated to the same SETA as this host company before they can be placed.
          </p>
        </div>
      ) : (
        <>
          {/* Search and Select All */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium" style={{ color: COLORS.primary }}>
                Select Learners {!placement && '*'}
              </label>
              {!placement && filteredLearners.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-sm px-3 py-1 rounded-lg hover:bg-gray-100"
                  style={{ color: COLORS.primary }}
                >
                  {allSelected ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>
            
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, student ID, or programme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.border }}
              />
            </div>

            {/* Learner List */}
            <div 
              className="border rounded-lg max-h-64 overflow-y-auto" 
              style={{ borderColor: errors.learners ? COLORS.danger : COLORS.border }}
            >
              {filteredLearners.length > 0 ? (
                <div className="divide-y" style={{ borderColor: COLORS.border }}>
                  {filteredLearners.map(learner => {
                    const isSelected = selectedLearners.includes(learner.id);
                    return (
                      <div
                        key={learner.id}
                        onClick={() => handleToggleLearner(learner.id)}
                        className={`p-4 cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                        } ${placement ? 'opacity-75 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                            }`}>
                              {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                            </div>
                            <User className="w-8 h-8 text-gray-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold truncate" style={{ color: COLORS.primary }}>
                                {learner.firstName} {learner.lastName}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                {learner.studentId || learner.id} • {learner.email || 'No email'}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 truncate">
                                {learner.programme || 'No programme'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No learners found</p>
                  <p className="text-sm mt-1">Try adjusting your search</p>
                </div>
              )}
            </div>
            
            {errors.learners && (
              <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.learners}</p>
            )}
            
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                Showing {filteredLearners.length} of {availableLearners.length} available learners
              </p>
              <p className="text-sm font-medium" style={{ color: COLORS.primary }}>
                {selectedLearners.length} selected
              </p>
            </div>
          </div>

          {/* Placement Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: errors.startDate ? COLORS.danger : COLORS.border }}
              />
              {errors.startDate && (
                <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: errors.endDate ? COLORS.danger : COLORS.border }}
              />
              {errors.endDate && (
                <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Supervisor Details */}
          <div>
            <h4 className="font-semibold mb-3" style={{ color: COLORS.primary }}>Workplace Supervisor</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                  Supervisor Name *
                </label>
                <input
                  type="text"
                  value={formData.supervisorName}
                  onChange={(e) => handleChange('supervisorName', e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: errors.supervisorName ? COLORS.danger : COLORS.border }}
                />
                {errors.supervisorName && (
                  <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.supervisorName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                  Supervisor Email *
                </label>
                <input
                  type="email"
                  value={formData.supervisorEmail}
                  onChange={(e) => handleChange('supervisorEmail', e.target.value)}
                  placeholder="supervisor@company.com"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: errors.supervisorEmail ? COLORS.danger : COLORS.border }}
                />
                {errors.supervisorEmail && (
                  <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.supervisorEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                  Supervisor Phone *
                </label>
                <input
                  type="tel"
                  value={formData.supervisorPhone}
                  onChange={(e) => handleChange('supervisorPhone', e.target.value)}
                  placeholder="+27 11 123 4567"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: errors.supervisorPhone ? COLORS.danger : COLORS.border }}
                />
                {errors.supervisorPhone && (
                  <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.supervisorPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
              Placement Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: COLORS.border }}
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes about the placement..."
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none"
              style={{ borderColor: COLORS.border }}
            />
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 rounded-lg border font-medium hover:bg-gray-50"
          style={{ borderColor: COLORS.border, color: COLORS.text }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={availableLearners.length === 0}
          className="flex-1 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: COLORS.success }}
        >
          {placement ? 'Update Placement' : `Place ${selectedLearners.length} Learner${selectedLearners.length !== 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  );
}