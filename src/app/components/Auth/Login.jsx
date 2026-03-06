"use client";

import { useState } from "react";
import axios from "axios";
import { GraduationCap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { useRouter } from "next/navigation";

const Login = ({ onLogin }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [imageLoaded, setImageLoaded] = useState(true);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError("");
    setApiSuccess("");

    try {
      // Login request
      const payload = {
        user_type: "administrator",
        email: formData.email.trim(),
        id_number: "",
        password: formData.password,
      };

      const response = await axios.post(
        "https://seta-api-3g5xl.ondigitalocean.app/api/administrators/login",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { message, user_id, access_token } = response.data;

      setApiSuccess(message || "Login successful!");

      // Fetch admin full profile
      const profileRes = await axios.get(
        `https://seta-api-3g5xl.ondigitalocean.app/api/administrators/administrator/${user_id}`,
      );

      const admin = profileRes.data;

      // Map API snake_case → camelCase
      const mappedAdmin = {
        id: admin.admin_id,
        firstName: admin.first_name,
        lastName: admin.last_name,
        email: admin.email,
        phone: admin.phone_number,
        employeeNumber: admin.employee_number,
        role: admin.role,
        status: admin.status,
        dateJoined: admin.joined_at,
      };

      // Browser-only sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("access_token", access_token);
        sessionStorage.setItem("admin_id", user_id);
        sessionStorage.setItem("administrator", JSON.stringify(mappedAdmin));
      }

      if (onLogin) onLogin(mappedAdmin);

      // Redirect
      router.push("/pages/students");

    } catch (err) {
      console.error("Login error:", err);
      setApiError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 "
    >
      <div
        className="w-full max-w-md rounded-lg shadow-lg p-8"
        style={{ backgroundColor: COLORS.bgWhite }}
      >
        <div className="text-center mb-8">
          {imageLoaded ? (
            <div className="flex items-center justify-center">
              <img
                src="https://www.hwseta.org.za/wp-content/uploads/2019/12/Logo-HWSETA.png"
                alt="Graduation Cap"
                className="w-20 h-20 object-contain"
                onError={() => setImageLoaded(false)}
              />
            </div>
          ) : (
            <GraduationCap
              className="w-16 h-16 bg-[#387F40]"
            />
          )}
          <h1
            className="text-3xl font-bold mb-2 text-[#387F40]"
          >
            Welcome Back
          </h1>
          <p className="text-gray-600">Login to your portal</p>
        </div>

        {apiError && (
          <p className="mb-4 text-center text-sm font-medium" style={{ color: COLORS.danger }}>
            {apiError}
          </p>
        )}

        {apiSuccess && (
          <p className="mb-4 text-center text-sm font-medium" style={{ color: COLORS.success }}>
            {apiSuccess}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#387F40]" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="your.email@university.ac.za"
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                style={{ borderColor: errors.email ? COLORS.danger : COLORS.border }}
              />
            </div>
            {errors.email && (
              <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#387F40]" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full pl-10 pr-10 py-2 border rounded-lg"
                style={{ borderColor: errors.password ? COLORS.danger : COLORS.border }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-[#387F40]" />
                ) : (
                  <Eye className="w-5 h-5 text-[#387F40]" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm mt-1" style={{ color: COLORS.danger }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => router.push("/forgot")}
              className="text-sm ml-4"
              style={{ color: COLORS.primary }}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold hover:opacity-90 bg-[#387F40] hover:bg-[#2a5d2f]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;