"use client"
import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import {COLORS, formDate } from '../../utils/helpers';

const FundingWindowForm = ({ window, agreementId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    agreementId: agreementId || window?.agreementId || '',
    windowName: window?.windowName || '',
    startDate: window?.startDate || '',
    endDate: window?.endDate || '',
    numLearners: window?.numLearners || '',
    financialYear: window?.financialYear || '',
    slotsAvailable: window?.slotsAvailable || '',
    budgetAllocation: window?.budgetAllocation || '',
    programmes: window?.programmes || [{
      id: Date.now(),
      programmeName: '',
      programmeDuration: '',
      budgetAllocation: '',
      requiredDocs: '',
      timesheetTemplate: null,
      notes: ''
    }]
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!formData.windowName) newErrors.windowName = 'Window name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.numLearners || formData.numLearners <= 0) newErrors.numLearners = 'Valid number required';
    if (!formData.slotsAvailable || formData.slotsAvailable <= 0) newErrors.slotsAvailable = 'Valid slots required';
    if (!formData.budgetAllocation || formData.budgetAllocation <= 0) newErrors.budgetAllocation = 'Valid budget required';
    
    formData.programmes.forEach((prog, index) => {
      if (!prog.programmeName) newErrors[`programme_${index}_name`] = 'Programme name required';
      if (!prog.budgetAllocation || prog.budgetAllocation <= 0) {
        newErrors[`programme_${index}_budget`] = 'Valid budget required';
      }
    });

    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleFileChange = (programmeId, file) => {
    setFormData(prev => ({
      ...prev,
      programmes: prev.programmes.map(p =>
        p.id === programmeId ? { ...p, timesheetTemplate: file } : p
      )
    }));
  };

  const removeFile = (programmeId) => {
    setFormData(prev => ({
      ...prev,
      programmes: prev.programmes.map(p =>
        p.id === programmeId ? { ...p, timesheetTemplate: null } : p
      )
    }));
  };

  const addProgramme = () => {
    const newProgramme = {
      id: Date.now(),
      programmeName: '',
      programmeDuration: '',
      budgetAllocation: '',
      requiredDocs: '',
      timesheetTemplate: null,
      notes: ''
    };
    
    setFormData(prev => ({
      ...prev,
      programmes: [...prev.programmes, newProgramme]
    }));
  };

  const removeProgramme = (programmeId) => {
    if (formData.programmes.length === 1) return;
    
    setFormData(prev => ({
      ...prev,
      programmes: prev.programmes.filter(p => p.id !== programmeId)
    }));
  };

  const handleProgrammeChange = (programmeId, field, value) => {
    setFormData(prev => ({
      ...prev,
      programmes: prev.programmes.map(p =>
        p.id === programmeId ? { ...p, [field]: value } : p
      )
    }));
    
    const errorKey = `programme_${formData.programmes.findIndex(p => p.id === programmeId)}_${field === 'programmeName' ? 'name' : 'budget'}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: undefined
      }));
    }
  };

  const getTotalProgrammeBudget = () => {
    return formData.programmes.reduce((sum, prog) => {
      return sum + (parseFloat(prog.budgetAllocation) || 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
            Funding Window Name *
          </label>
          <input
            type="text"
            value={formData.windowName}
            onChange={(e) => handleChange('windowName', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: errors.windowName ? COLORS.danger : COLORS.border }}
            placeholder="e.g., Q1 2025 Intake"
          />
          {errors.windowName && (
            <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
              {errors.windowName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
            Contract Start Date *
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: errors.startDate ? COLORS.danger : COLORS.border }}
          />
          {errors.startDate && (
            <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
              {errors.startDate}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
            Contract End Date *
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: errors.endDate ? COLORS.danger : COLORS.border }}
          />
          {errors.endDate && (
            <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
              {errors.endDate}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
            Number of Learners *
          </label>
          <input
            type="number"
            value={formData.numLearners}
            onChange={(e) => handleChange('numLearners', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: errors.numLearners ? COLORS.danger : COLORS.border }}
            min="1"
          />
          {errors.numLearners && (
            <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
              {errors.numLearners}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
            Financial Year
          </label>
          <input
            type="text"
            value={formData.financialYear}
            onChange={(e) => handleChange('financialYear', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: COLORS.border }}
            placeholder="e.g., 2024/2025"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
            Slots Available *
          </label>
          <input
            type="number"
            value={formData.slotsAvailable}
            onChange={(e) => handleChange('slotsAvailable', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: errors.slotsAvailable ? COLORS.danger : COLORS.border }}
            min="1"
          />
          {errors.slotsAvailable && (
            <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
              {errors.slotsAvailable}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
            Budget Allocation (ZAR) *
          </label>
          <input
            type="number"
            value={formData.budgetAllocation}
            onChange={(e) => handleChange('budgetAllocation', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: errors.budgetAllocation ? COLORS.danger : COLORS.border }}
            min="0"
            step="0.01"
          />
          {errors.budgetAllocation && (
            <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
              {errors.budgetAllocation}
            </p>
          )}
        </div>
      </div>

      <div className="border-t pt-6" style={{ borderColor: COLORS.border }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold" style={{ color: COLORS.primary }}>
            Programme Details
          </h3>
          <button
            type="button"
            onClick={addProgramme}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: COLORS.primary }}
          >
            + Add Programme
          </button>
        </div>

        {formData.programmes.map((programme, index) => {
          const progIndex = formData.programmes.findIndex(p => p.id === programme.id);
          return (
            <div
              key={programme.id}
              className="mb-6 p-6 border rounded-lg bg-gray-50"
              style={{ borderColor: COLORS.border }}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium" style={{ color: COLORS.primary }}>
                  Programme {index + 1}
                </h4>
                {formData.programmes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProgramme(programme.id)}
                    className="text-sm px-3 py-1 rounded hover:bg-red-50"
                    style={{ color: COLORS.danger }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                    Programme Name *
                  </label>
                  <input
                    type="text"
                    value={programme.programmeName}
                    onChange={(e) => handleProgrammeChange(programme.id, 'programmeName', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white"
                    style={{ borderColor: errors[`programme_${progIndex}_name`] ? COLORS.danger : COLORS.border }}
                    placeholder="e.g., Advanced Engineering Learnership"
                  />
                  {errors[`programme_${progIndex}_name`] && (
                    <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
                      {errors[`programme_${progIndex}_name`]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                    Duration (months)
                  </label>
                  <input
                    type="number"
                    value={programme.programmeDuration}
                    onChange={(e) => handleProgrammeChange(programme.id, 'programmeDuration', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white"
                    style={{ borderColor: COLORS.border }}
                    min="1"
                    placeholder="12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                    Budget Allocation (ZAR) *
                  </label>
                  <input
                    type="number"
                    value={programme.budgetAllocation}
                    onChange={(e) => handleProgrammeChange(programme.id, 'budgetAllocation', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white"
                    style={{ borderColor: errors[`programme_${progIndex}_budget`] ? COLORS.danger : COLORS.border }}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                  {errors[`programme_${progIndex}_budget`] && (
                    <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
                      {errors[`programme_${progIndex}_budget`]}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                    Required Documents
                  </label>
                  <textarea
                    rows="3"
                    value={programme.requiredDocs}
                    onChange={(e) => handleProgrammeChange(programme.id, 'requiredDocs', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white"
                    style={{ borderColor: COLORS.border }}
                    placeholder="List required documents (one per line)..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                    Timesheet Template
                  </label>
                  
                  {programme.timesheetTemplate ? (
                    <div className="border rounded-lg p-4 bg-white" style={{ borderColor: COLORS.border }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e0f2fe' }}>
                            <Upload className="w-5 h-5" style={{ color: COLORS.primary }} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {programme.timesheetTemplate.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(programme.timesheetTemplate.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(programme.id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          style={{ color: COLORS.danger }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-6 bg-white text-center" style={{ borderColor: COLORS.border }}>
                      <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: COLORS.text }} />
                      <p className="text-sm text-gray-600 mb-1">
                        Upload timesheet template
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        Excel, PDF, or Word documents
                      </p>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.pdf,.docx,.doc"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileChange(programme.id, file);
                          }
                        }}
                        className="hidden"
                        id={`file-upload-${programme.id}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById(`file-upload-${programme.id}`);
                          if (input) input.click();
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90"
                        style={{ backgroundColor: COLORS.primary }}
                      >
                        Choose File
                      </button>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
                    Notes
                  </label>
                  <textarea
                    rows="2"
                    value={programme.notes}
                    onChange={(e) => handleProgrammeChange(programme.id, 'notes', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white"
                    style={{ borderColor: COLORS.border }}
                    placeholder="Add programme notes..."
                  />
                </div>
              </div>
            </div>
          );
        })}

        {formData.programmes.length > 0 && (
          <div
            className="mt-4 p-4 rounded-lg"
            style={{ backgroundColor: '#f0f9ff', borderLeft: `4px solid ${COLORS.primary}` }}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium" style={{ color: COLORS.primary }}>
                Total Programme Budget:
              </span>
              <span className="text-lg font-bold" style={{ color: COLORS.primary }}>
                R {getTotalProgrammeBudget().toLocaleString('en-ZA', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
            {formData.budgetAllocation && getTotalProgrammeBudget() > parseFloat(formData.budgetAllocation) && (
              <p className="text-sm mt-2" style={{ color: COLORS.danger }}>
                ⚠️ Programme budgets exceed total funding window budget
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 rounded-lg border font-medium hover:bg-gray-50"
          style={{ borderColor: COLORS.border, color: COLORS.primary }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90"
          style={{ backgroundColor: COLORS.success }}
        >
          {window ? 'Update Window' : 'Create Funding Window'}
        </button>
      </div>
    </div>
  );
};

export default FundingWindowForm;
