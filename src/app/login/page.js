"use client";

import { useRouter } from "next/navigation";
import Login from "../components/Auth/Login";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (data) => {
    console.log("Login successful:", data);
    router.push("/mfa");
  };

  const switchToForgotPassword = () => {
    router.push("/forgot");
  };

  return (
    <Login
      onLogin={handleLogin}
      onSwitchToForgotPassword={switchToForgotPassword}
    />
  );
}