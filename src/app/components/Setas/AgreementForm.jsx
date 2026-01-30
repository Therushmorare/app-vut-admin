"use client";

import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { COLORS, formatDate } from "../../utils/helpers";
import axios from "axios";

const AgreementForm = ({ agreement, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    setaName: agreement?.setaName || "",
    faculties: agreement?.faculties || [],
    agreementRef: agreement?.agreementRef || "",
    startDate: agreement?.startDate || "",
    endDate: agreement?.endDate || "",
    status: agreement?.status || "Pending",
    uploadDate: agreement?.uploadDate || formatDate(new Date()),
    documentName: agreement?.documentName || "",
    documentUrl: agreement?.documentUrl || ""
  });

  const [errors, setErrors] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(
    agreement?.documentName || null
  );

  const availableFaculties = [
    "Faculty of Applied & Computer Science",
    "Faculty of Management Science",
    "Faculty of Engineering & Technology",
    "Faculty of Human Science"
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.setaName) newErrors.setaName = "SETA name is required";
    if (!formData.faculties.length)
      newErrors.faculties = "At least one faculty is required";
    if (!formData.agreementRef)
      newErrors.agreementRef = "Agreement reference is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) <= new Date(formData.startDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }
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
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    if (!uploadedFile && !formData.agreementId) {
      // Require file only if creating new agreement
      setErrors({ document: "Agreement document is required" });
      return;
    }

    try {
      const payload = new FormData();
      payload.append("administrator_id", adminId);
      if (uploadedFile) payload.append("agreement_file", uploadedFile);
      payload.append("seta_name", formData.setaName);
      payload.append("faculty", formData.faculties.join(","));
      payload.append("start_period", formData.startDate);
      payload.append("end_period", formData.endDate);
      payload.append("reference_number", formData.agreementRef);
      payload.append("status", formData.status);

      if (formData.agreementId) {
        // 🔹 UPDATE EXISTING AGREEMENT
        await axios.post(
          `https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/agreements/${formData.agreementId}`,
          payload
        );
      } else {
        // 🔹 CREATE NEW AGREEMENT
        await axios.post(
          "https://seta-management-api-fvzc9.ondigitalocean.app/api/administrators/agreements",
          payload
        );
      }

      onSubmit?.();
    } catch (err) {
      console.error("Agreement save failed:", err);
      alert(err.response?.data?.message || "Failed to save agreement");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setUploadedFile(file);
    setUploadPreview(file.name);
    handleChange("documentName", file.name);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadPreview(null);
    handleChange("documentName", "");
    handleChange("documentUrl", "");

    const fileInput = document.getElementById("pdf-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleToggleFaculty = (faculty) => {
    const exists = formData.faculties.includes(faculty);
    handleChange(
      "faculties",
      exists
        ? formData.faculties.filter((f) => f !== faculty)
        : [...formData.faculties, faculty]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* File Upload Section */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
          SETA Agreement Document
        </label>
        {!uploadPreview ? (
          <div 
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            style={{ borderColor: COLORS.border }}
            onClick={() => document.getElementById('pdf-upload').click()}
          >
            <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: COLORS.text }} />
            <p className="text-sm text-gray-600 mb-2">Upload SETA agreement PDF</p>
            <p className="text-xs text-gray-500 mb-3">Click to browse or drag and drop</p>
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              id="pdf-upload"
              onChange={handleFileUpload}
            />
            <span 
              className="inline-block px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90" 
              style={{ backgroundColor: COLORS.text }}
            >
              Select File
            </span>
          </div>
        ) : (
          <div 
            className="border-2 rounded-lg p-4 flex items-center justify-between"
            style={{ borderColor: COLORS.success, backgroundColor: '#f0fdf4' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded flex items-center justify-center" style={{ backgroundColor: COLORS.success }}>
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: COLORS.primary }}>
                  {uploadPreview}
                </p>
                <p className="text-xs text-gray-500">
                  {uploadedFile ? `${(uploadedFile.size / 1024).toFixed(2)} KB` : 'Uploaded'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="p-2 rounded-lg hover:bg-red-50 transition-colors"
              style={{ color: COLORS.danger }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>SETA Name *</label>
          <select 
            value={formData.setaName}
            onChange={(e) => handleChange('setaName', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: errors.setaName ? COLORS.danger : COLORS.border }}
          >
            <option value="">Select SETA</option>
            <option>BANKSETA</option>
            <option>MERSETA</option>
            <option>FASSET</option>
            <option>HWSETA</option>
            <option>CHIETA</option>
            <option>FOODBEV</option>
            <option>W&RSETA</option>
            <option>SERVICES SETA</option>
            <option>ETDP SETA</option>
          </select>
          {errors.setaName && <p className="text-xs mt-1" style={{ color: COLORS.danger }}>{errors.setaName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>Agreement Reference *</label>
          <input 
            type="text"
            value={formData.agreementRef}
            onChange={(e) => handleChange('agreementRef', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: errors.agreementRef ? COLORS.danger : COLORS.border }}
            placeholder="e.g., AGR-2024-001"
          />
          {errors.agreementRef && <p className="text-xs mt-1" style={{ color: COLORS.danger }}>{errors.agreementRef}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>Start Date *</label>
          <input 
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: errors.startDate ? COLORS.danger : COLORS.border }}
          />
          {errors.startDate && <p className="text-xs mt-1" style={{ color: COLORS.danger }}>{errors.startDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>End Date *</label>
          <input 
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: errors.endDate ? COLORS.danger : COLORS.border }}
          />
          {errors.endDate && <p className="text-xs mt-1" style={{ color: COLORS.danger }}>{errors.endDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>Status</label>
          <select 
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: COLORS.border }}
          >
            <option>Pending</option>
            <option>Active</option>
            <option>Expired</option>
          </select>
        </div>
      </div>

      {/* Multiple Faculties Selection */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: COLORS.primary }}>
          Faculties * <span className="text-xs text-gray-500">(Select all that apply)</span>
        </label>
        <div 
          className="border rounded-lg p-4"
          style={{ 
            borderColor: errors.faculties ? COLORS.danger : COLORS.border,
            backgroundColor: COLORS.bgLight 
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableFaculties.map(faculty => {
              const isSelected = formData.faculties?.includes(faculty);
              return (
                <button
                  key={faculty}
                  type="button"
                  onClick={() => handleToggleFaculty(faculty)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    isSelected 
                      ? 'shadow-sm' 
                      : 'hover:bg-gray-50'
                  }`}
                  style={{
                    borderColor: isSelected ? COLORS.primary : COLORS.border,
                    backgroundColor: isSelected ? COLORS.primary : 'white',
                    color: isSelected ? 'white' : COLORS.text
                  }}
                >
                  {faculty}
                </button>
              );
            })}
          </div>
          {formData.faculties && formData.faculties.length > 0 && (
            <div className="mt-3 pt-3 border-t" style={{ borderColor: COLORS.border }}>
              <p className="text-xs text-gray-600">
                Selected: <span className="font-medium">{formData.faculties.join(', ')}</span>
              </p>
            </div>
          )}
        </div>
        {errors.faculties && <p className="text-xs mt-1" style={{ color: COLORS.danger }}>{errors.faculties}</p>}
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
          style={{ backgroundColor: COLORS.text }}
        >
          {agreement ? 'Update Agreement' : 'Create Agreement'}
        </button>
      </div>
    </form>
  );
};

export default AgreementForm;