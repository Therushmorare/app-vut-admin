"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { GraduationCap, Lock, RotateCw } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { useRouter } from "next/navigation";

const API_BASE = "https://seta-management-api-fvzc9.ondigitalocean.app";

export default function MFA({ onVerify }) {
  const [form, setForm] = useState({ mfa_code: "" });
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageLoaded, setImageLoaded] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const id = sessionStorage.getItem("admin_id");
    const adminRaw = sessionStorage.getItem("administrator");

    if (id && adminRaw) {
      try {
        const admin = JSON.parse(adminRaw);
        setUserId(id);
        setUserEmail(admin.email);
        setUserType("administrator");
      } catch {
        setError("Invalid session data. Please login again.");
      }
    } else {
      setError("Session expired. Please login again.");
    }
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  };

  // 🔹 Verify MFA (exact payload)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.mfa_code.trim()) {
      setError("MFA code is required");
      return;
    }

    if (!userId) {
      setError("Session expired. Please login again.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint =
        userType === "administrator"
          ? `${API_BASE}/api/administrators/verify-mfa`
          : `${API_BASE}/api/students/verify-mfa`;

      const payload =
        userType === "administrator"
          ? { user_id: userId, code: form.mfa_code.trim() } // admin verify
          : { user_id: userId, code: form.mfa_code.trim() }; // student verify

      const response = await axios.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccess(response.data.message || "MFA verified!");
      if (onVerify) onVerify(response.data);

      router.push("/pages/students");
    } catch (err) {
      console.error("MFA verify error:", err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Resend MFA (exact payload)
  const handleResend = async () => {
    if (!userEmail || !userType) {
      setError("Session expired. Please login again.");
      return;
    }

    setResending(true);
    setError("");
    setSuccess("");

    try {
      const endpoint =
        userType === "administrator"
          ? `${API_BASE}/api/administrators/resend-mfa`
          : `${API_BASE}/api/students/resend-mfa`;

      const payload = { email: userEmail, user_type: userType };

      const response = await axios.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccess(response.data.message || "MFA code resent successfully.");
    } catch (err) {
      console.error("Resend MFA error:", err);
      setError(err.response?.data?.message || "Failed to resend MFA code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: COLORS.bgLight }}>
      <div className="w-full max-w-md rounded-lg shadow-lg p-8" style={{ backgroundColor: COLORS.bgWhite }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {imageLoaded ? (
              <img
                src="https://res.cloudinary.com/dbuuizuka/image/upload/v1761697835/id3tj44Wsz_1761674029816_z2fjde.png"
                alt="Graduation Cap"
                className="w-20 h-20 object-contain"
                onError={() => setImageLoaded(false)}
              />
            ) : (
              <GraduationCap className="w-16 h-16" style={{ color: COLORS.primary }} />
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.primary }}>
            MFA Verification
          </h1>
          <p className="text-gray-600">Enter the code sent to your email</p>
        </div>

        {/* Messages */}
        {error && <p className="text-sm text-center mb-4" style={{ color: COLORS.danger }}>{error}</p>}
        {success && <p className="text-sm text-center mb-4" style={{ color: COLORS.success }}>{success}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">MFA Code</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={form.mfa_code}
                onChange={(e) => handleChange("mfa_code", e.target.value)}
                placeholder="Enter MFA Code"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: error ? COLORS.danger : COLORS.border }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold"
            style={{ backgroundColor: COLORS.primary }}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {/* Resend Button */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="flex items-center justify-center gap-2 text-sm font-medium"
            style={{ color: COLORS.primary }}
          >
            <RotateCw className={resending ? "animate-spin" : ""} size={16} />
            {resending ? "Resending..." : "Resend MFA Code"}
          </button>
        </div>
      </div>
    </div>
  );
}