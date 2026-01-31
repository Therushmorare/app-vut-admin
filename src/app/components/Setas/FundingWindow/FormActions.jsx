"use client";

import React, { useState } from "react";
import { COLORS } from "../../utils/helpers";
import { Loader2 } from "lucide-react";

export default function FormActions({ isEditMode, onCancel, onSubmit }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return; // prevent multiple clicks
    setLoading(true);
    try {
      // Await parent callback if provided
      const result = await onSubmit?.();
      return result;
    } catch (err) {
      console.error("Form submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        onClick={handleClick}
        disabled={loading}
        className={`flex-1 px-6 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all ${
          loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
        }`}
        style={{ backgroundColor: COLORS.success }}
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        {loading
          ? "Processing..."
          : isEditMode
          ? "Update Window"
          : "Create Funding Window"}
      </button>
    </div>
  );
}