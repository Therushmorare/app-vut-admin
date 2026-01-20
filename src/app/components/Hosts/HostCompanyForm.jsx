import React, { useState } from 'react';
import { COLORS } from '../../utils/helpers';

export default function HostCompanyForm({ company, agreements, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    agreementId: company?.agreementId || '',
    companyName: company?.companyName || '',
    registrationNumber: company?.registrationNumber || '',
    address: company?.address || '',
    contactPerson: company?.contactPerson || '',
    contactEmail: company?.contactEmail || '',
    contactPhone: company?.contactPhone || '',
    industrySector: company?.industrySector || '',
    learnerCapacity: company?.learnerCapacity || '',
    confirmationLetter: company?.confirmationLetter || false,
    mouStatus: company?.mouStatus || 'Not Applicable',
    notes: company?.notes || ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const industrySectors = [
    'Manufacturing',
    'Information Technology',
    'Engineering',
    'Healthcare',
    'Finance',
    'Retail',
    'Construction',
    'Education',
    'Hospitality',
    'Other'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.agreementId) newErrors.agreementId = 'SETA Agreement is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Email is invalid';
    }
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone number is required';
    if (!formData.industrySector) newErrors.industrySector = 'Industry sector is required';
    if (!formData.learnerCapacity || formData.learnerCapacity < 1) {
      newErrors.learnerCapacity = 'Learner capacity must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //UPDATED: API + existing onSubmit support
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError('');

    //Backend payload mapping
    const payload = {
      administrator_id: sessionStorage.getItem("admin_id"),
      company_name: formData.companyName,
      registration_number: formData.registrationNumber,
      address: formData.address,
      contact_person: formData.contactPerson,
      company_email: formData.contactEmail,
      company_phone: formData.contactPhone,
      industry: formData.industrySector,
      capacity_of_required_learners: Number(formData.learnerCapacity)
    };
    try {
        const url = company
          ? `/api/administrators/editHostCompany/${company.company_id}`
          : '/api/administrators/addHostCompany';

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data?.message || 'API request failed');

        // Call existing onSubmit callback
        onSubmit?.(formData);

      } catch (error) {
        setApiError(error.message);
      } finally {
        setIsSubmitting(false);
      }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* API Error */}
      {apiError && (
        <div className="text-sm p-3 rounded bg-red-50 border border-red-200 text-red-700">
          {apiError}
        </div>
      )}

      {/* Company Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.primary }}>
          Company Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
              SETA Agreement *
            </label>
            <select
              name="agreementId"
              value={formData.agreementId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: errors.agreementId ? COLORS.danger : COLORS.border }}
            >
              <option value="">Select SETA Agreement...</option>
              {agreements
                .filter(agreement => agreement.status === 'Active')
                .map(agreement => (
                  <option key={agreement.agreement_id} value={agreement.agreement_id}>
                    {agreement.name} - {agreement.reference_number}
                  </option>
                ))}
            </select>
            {errors.agreementId && (
              <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.agreementId}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Only learners allocated to this SETA can be placed at this company
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: errors.companyName ? COLORS.danger : COLORS.border }}
              placeholder="Enter company name"
            />
            {errors.companyName && (
              <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.companyName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
              Registration Number *
            </label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: errors.registrationNumber ? COLORS.danger : COLORS.border }}
              placeholder="e.g., 2021/123456/07"
            />
            {errors.registrationNumber && (
              <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.registrationNumber}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: errors.address ? COLORS.danger : COLORS.border }}
              placeholder="Enter company address"
            />
            {errors.address && (
              <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
              Industry Sector *
            </label>
            <select
              name="industrySector"
              value={formData.industrySector}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: errors.industrySector ? COLORS.danger : COLORS.border }}
            >
              <option value="">Select industry sector...</option>
              {industrySectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
            {errors.industrySector && (
              <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.industrySector}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
              Learner Capacity *
            </label>
            <input
              type="number"
              name="learnerCapacity"
              value={formData.learnerCapacity}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: errors.learnerCapacity ? COLORS.danger : COLORS.border }}
              placeholder="Number of learners"
            />
            {errors.learnerCapacity && (
              <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.learnerCapacity}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.primary }}>
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
              Contact Person *
            </label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: errors.contactPerson ? COLORS.danger : COLORS.border }}
              placeholder="Full name"
            />
            {errors.contactPerson && (
              <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.contactPerson}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
              Email *
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: errors.contactEmail ? COLORS.danger : COLORS.border }}
              placeholder="email@company.com"
            />
            {errors.contactEmail && (
              <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.contactEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
              Phone *
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: errors.contactPhone ? COLORS.danger : COLORS.border }}
              placeholder="+27 12 345 6789"
            />
            {errors.contactPhone && (
              <p className="text-sm mt-1" style={{ color: COLORS.danger }}>{errors.contactPhone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Documentation */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.primary }}>
          Documentation
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="confirmationLetter"
              checked={formData.confirmationLetter}
              onChange={handleChange}
              className="w-4 h-4 rounded"
              style={{ accentColor: COLORS.primary }}
            />
            <label className="text-sm font-medium" style={{ color: COLORS.primary }}>
              Company Confirmation Letter Received
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
              MoU Status
            </label>
            <select
              name="mouStatus"
              value={formData.mouStatus}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: COLORS.border }}
            >
              <option value="Not Applicable">Not Applicable</option>
              <option value="Pending">Pending</option>
              <option value="Signed">Signed</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
          Additional Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          style={{ borderColor: COLORS.border }}
          placeholder="Add any additional information..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 rounded-lg border hover:bg-gray-50 font-medium"
          style={{ borderColor: COLORS.border, color: COLORS.text }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: COLORS.success }}
        >
          {isSubmitting
            ? 'Saving...'
            : company ? 'Update Company' : 'Create Company'}
        </button>
      </div>
    </form>
  );
}