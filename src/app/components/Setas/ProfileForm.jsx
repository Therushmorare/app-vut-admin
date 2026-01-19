"use client"

import React, { useState } from 'react';
import { COLORS } from '../../utils/helpers';
import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://seta-management-api-fvzc9.ondigitalocean.app";

const SETAProfileForm = ({ profile, agreementId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    agreementId: agreementId || profile?.agreementId || '',
    profileName: profile?.profileName || '',
    description: profile?.description || '',
    financialYear: profile?.financialYear || '',
    contactPerson: profile?.contactPerson || '',
    contactEmail: profile?.contactEmail || '',
    contactPhone: profile?.contactPhone || '',
    programTypes: profile?.programTypes || [],
    notes: profile?.notes || ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.profileName) newErrors.profileName = 'Profile name is required';
    if (!formData.financialYear) newErrors.financialYear = 'Financial year is required';
    if (!formData.contactEmail) newErrors.contactEmail = 'Contact email is required';
    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }
    if (formData.programTypes.length === 0) newErrors.programTypes = 'Select at least one programme type';
    return newErrors;
  };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const adminId = sessionStorage.getItem("admin_id");
      if (!adminId) {
        alert("Admin session expired. Please log in again.");
        return;
      }

      const newErrors = validate();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      try {
        const payload = {
          administrator_id: adminId,
          agreement_id: formData.agreementId,
          description: formData.description,
          financial_year: formData.financialYear,
          seta_phone: formData.contactPhone,
          seta_email: formData.contactEmail,
          program_type: formData.programTypes.join(", "),
          comments: formData.notes
        };

        const res = await axios.post(
          `${API_BASE}/api/administrators/seta-profiles`,
          payload,
          { withCredentials: true }
        );

        console.log("SETA profile created:", res.data);

        // optional: close modal / refresh list
        onSubmit?.(res.data);

      } catch (err) {
        console.error(
          "Failed to create SETA profile:",
          err.response?.data || err
        );
      }
    };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCheckbox = (value) => {
    const updated = formData.programTypes.includes(value)
      ? formData.programTypes.filter(t => t !== value)
      : [...formData.programTypes, value];
    handleChange('programTypes', updated);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>Profile Name *</label>
        <input 
          type="text"
          value={formData.profileName}
          onChange={(e) => handleChange('profileName', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          style={{ borderColor: errors.profileName ? COLORS.danger : COLORS.border }}
          placeholder="e.g., BANKSETA Main Profile"
        />
        {errors.profileName && <p className="text-xs mt-1" style={{ color: COLORS.danger }}>{errors.profileName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>Description</label>
        <textarea 
          rows="3"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          style={{ borderColor: COLORS.border }}
          placeholder="Enter profile description..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>Financial Year *</label>
          <input 
            type="text"
            value={formData.financialYear}
            onChange={(e) => handleChange('financialYear', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: errors.financialYear ? COLORS.danger : COLORS.border }}
            placeholder="e.g., 2024/2025"
          />
          {errors.financialYear && <p className="text-xs mt-1" style={{ color: COLORS.danger }}>{errors.financialYear}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>Contact Person</label>
          <input 
            type="text"
            value={formData.contactPerson}
            onChange={(e) => handleChange('contactPerson', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: COLORS.border }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>Contact Email *</label>
          <input 
            type="email"
            value={formData.contactEmail}
            onChange={(e) => handleChange('contactEmail', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: errors.contactEmail ? COLORS.danger : COLORS.border }}
          />
          {errors.contactEmail && <p className="text-xs mt-1" style={{ color: COLORS.danger }}>{errors.contactEmail}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>Contact Phone</label>
          <input 
            type="tel"
            value={formData.contactPhone}
            onChange={(e) => handleChange('contactPhone', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: COLORS.border }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>Programme Types *</label>
        <div className="space-y-2">
          {['Learnerships', 'Internships', 'Apprenticeships', 'Skills Programmes'].map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={formData.programTypes.includes(type)}
                onChange={() => handleCheckbox(type)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
        {errors.programTypes && <p className="text-xs mt-1" style={{ color: COLORS.danger }}>{errors.programTypes}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>Internal Notes</label>
        <textarea 
          rows="3"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          style={{ borderColor: COLORS.border }}
          placeholder="Add internal comments..."
        />
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
          type="submit"
          className="flex-1 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90"
          style={{ backgroundColor: COLORS.success }}
        >
          {profile ? 'Update Profile' : 'Create Profile'}
        </button>
      </div>
    </form>
  );
};

export default SETAProfileForm;