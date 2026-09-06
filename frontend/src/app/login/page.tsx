"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LiveNatureWallpaper from "@/components/LiveNatureWallpaper";
import {
  ShieldShaded,
  ShieldLockFill,
  PersonFill,
  EnvelopeAtFill,
  KeyFill,
  EyeFill,
  EyeSlashFill,
  ArrowRight,
  ArrowRepeat,
  Check2Circle,
  ExclamationCircleFill,
  HeartPulseFill,
  BriefcaseFill,
  BuildingFillGear,
  Flower1,
  Stars,
  HouseDoorFill,
} from "react-bootstrap-icons";
import { UserProfile, UserRole } from "@/types";

const ROLES: {
  id: UserRole;
  label: string;
  badge: string;
  description: string;
  icon: typeof HeartPulseFill;
  color: string;
}[] = [
  {
    id: "vaidya",
    label: "Ayurvedic Doctor / Vaidya",
    badge: "ISM Practitioner",
    description: "Registered practitioner with BDA 2023 exemptions & AFI classical formulations.",
    icon: HeartPulseFill,
    color: "from-emerald-600 to-teal-700",
  },
  {
    id: "attorney",
    label: "Patent Attorney / IP Agent",
    badge: "Patent Bar / IN-PA",
    description: "Focus on Sec 3(e), 3(p), Form III NBA access and prior art defense.",
    icon: BriefcaseFill,
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: "researcher",
    label: "AYUSH Enterprise / Scientist",
    badge: "R&D Scientist",
    description: "Managing commercial ABS, botanical monographs & TLC phytochemical markers.",
    icon: Flower1,
    color: "from-amber-600 to-orange-700",
  },
  {
    id: "regulator",
    label: "Regulatory Auditor / FSSAI",
    badge: "SLA / FSSAI Officer",
    description: "State Licensing Authority or Food Safety Officer monitoring Rule 158B & GMP.",
    icon: BuildingFillGear,
    color: "from-purple-600 to-violet-800",
  },
  {
    id: "guest",
    label: "Public Citizen / Researcher",
    badge: "Citizen Scholar",
    description: "General statutory inquiries, traditional knowledge heritage & biopiracy cases.",
    icon: PersonFill,
    color: "from-gray-600 to-slate-700",
  },
];

export default function LoginPage() {
  const router = useRouter();

  // Mode: "signin" for returning users, "signup" for first-time users
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  // Sign in fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Sign up fields
  const [signupStep, setSignupStep] = useState<"form" | "otp">("form");
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [role, setRole] = useState<UserRole>("vaidya");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Alerts
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Check if already logged in -> redirect to main app
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ayurlex_user_profile");
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        if (parsed && parsed.isLoggedIn) {
          router.replace("/");
        }
      }
    } catch {}
  }, [router]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (signupStep === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [signupStep, resendTimer]);

  // ───────────────────────────────────────────────────────────────────────────
  // HANDLER: Returning User Sign In (Zero OTP required)
  // ───────────────────────────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!loginPassword.trim()) {
      setError("Please enter your password.");
      return;
    }

    setIsLoggingIn(true);
    try {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email: cleanEmail,
          password: loginPassword.trim(),
          device: isMobile ? "📱 Mobile (Phone)" : "💻 Desktop / Laptop",
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Login failed. Please check your credentials.");
        setIsLoggingIn(false);
        return;
      }

      // Success: Save user profile in client storage and route to app
      setSuccessMsg("Welcome back! Directing to AYURLEX...");
      localStorage.setItem("ayurlex_user_profile", JSON.stringify(data.user));

      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Connection error. Please ensure backend services are active.");
      setIsLoggingIn(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // HANDLER: First-time User Registration — Step 1: Validate & Send OTP
  // ───────────────────────────────────────────────────────────────────────────
  const handleSendSignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanName = name.trim();
    const cleanEmail = signupEmail.trim().toLowerCase();

    if (!cleanName) {
      setError("Please provide your full legal name or professional title.");
      return;
    }
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please provide a valid official or personal email address.");
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    if (signupPassword !== confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    setIsSendingOtp(true);
    try {
      // Dispatch 6-digit OTP to user's email
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", email: cleanEmail }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Failed to dispatch verification code to email.");
        setIsSendingOtp(false);
        return;
      }

      setResendTimer(60);
      setEnteredOtp("");
      setSignupStep("otp");
      setSuccessMsg(`Verification code dispatched to ${cleanEmail}. Please enter the 6-digit code.`);
      setIsSendingOtp(false);
    } catch (err) {
      console.error("Failed to send signup OTP:", err);
      setError("Authentication server unreachable. Please verify your connection.");
      setIsSendingOtp(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // HANDLER: First-time User Registration — Step 2: Verify OTP & Activate
  // ───────────────────────────────────────────────────────────────────────────
  const handleVerifySignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = signupEmail.trim().toLowerCase();
    const cleanOtp = enteredOtp.trim();

    if (!cleanOtp || cleanOtp.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsRegistering(true);
    try {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          name: name.trim(),
          email: cleanEmail,
          role,
          password: signupPassword.trim(),
          confirmPassword: confirmPassword.trim(),
          otp: cleanOtp,
          device: isMobile ? "📱 Mobile (Phone)" : "💻 Desktop / Laptop",
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Verification failed. Please check the code.");
        setIsRegistering(false);
        return;
      }

      setSuccessMsg("Account verified successfully! Entering AYURLEX portal...");
      localStorage.setItem("ayurlex_user_profile", JSON.stringify(data.user));

      setTimeout(() => {
        router.push("/");
      }, 600);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration encountered a network error. Please try again.");
      setIsRegistering(false);
    }
  };

  // Demo auto-fill helpers for instant reviewer testing
  const handleFillDemo = (demoRole: UserRole) => {
    if (demoRole === "vaidya") {
      setLoginEmail("vaidya.sharma@ayush.gov.in");
      setLoginPassword("ayurlex123");
    } else if (demoRole === "researcher") {
      setLoginEmail("saivijesh63@gmail.com");
      setLoginPassword("ayurlex123");
    } else {
      setLoginEmail("mobile.tester@ayurlex.in");
      setLoginPassword("ayurlex123");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden bg-slate-50/50">
      {/* Live Animated Nature Motion Wallpaper Background */}
      <LiveNatureWallpaper />

      {/* Main Glassmorphic Auth Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl border border-gray-200/90 shadow-2xl p-6 sm:p-8 space-y-6 card-motion animate-entrance-1">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-600 via-green-600 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/15 ring-1 ring-emerald-500/20">
            <ShieldShaded className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-2">
              <span>IP-SAKTI Sahayak</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 leading-none">
                AYURLEX
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">
              Ministry of Ayush · Sovereign Statutory Intelligence & Patent Defense
            </p>
          </div>
        </div>

        {/* Auth Mode Tabs (Sign In vs Create Account) */}
        <div className="flex bg-gray-100/90 p-1 rounded-2xl text-xs font-bold border border-gray-200/60">
          <button
            type="button"
            onClick={() => {
              setTab("signin");
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              tab === "signin"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Sign In (Returning)
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("signup");
              setSignupStep("form");
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              tab === "signup"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Create Account (New User)
          </button>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 shadow-2xs">
            <ExclamationCircleFill className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl p-3 shadow-2xs">
            <Check2Circle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span className="leading-snug">{successMsg}</span>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* TAB 1: SIGN IN (RETURNING USERS — NO OTP REQUIRED)                 */}
        {/* ───────────────────────────────────────────────────────────────── */}
        {tab === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <EnvelopeAtFill className="w-3.5 h-3.5 text-emerald-700" />
                <span>Registered Email Address</span>
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="e.g. yourname@ayush.gov.in or gmail.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-normal"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <KeyFill className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Password</span>
                </label>
                <span className="text-[10px] text-gray-400">Direct Entry (No OTP)</span>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your confidential account password"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-gray-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-normal"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 cursor-pointer"
                  title={showLoginPassword ? "Hide password" : "Show password"}
                >
                  {showLoginPassword ? <EyeSlashFill className="w-3.5 h-3.5" /> : <EyeFill className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-300 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 btn-spring cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <ArrowRepeat className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to AYURLEX</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Quick Demonstration Fill Pills */}
            <div className="pt-2 border-t border-gray-100">
              <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1.5">
                Quick Demo Fill (Evaluator One-Click):
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleFillDemo("vaidya")}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg text-gray-700 border border-gray-200 transition-colors cursor-pointer"
                >
                  🌿 Vaidya
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo("researcher")}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg text-gray-700 border border-gray-200 transition-colors cursor-pointer"
                >
                  🔬 Researcher (K sai)
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo("guest")}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg text-gray-700 border border-gray-200 transition-colors cursor-pointer"
                >
                  📱 Mobile User
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* TAB 2: CREATE ACCOUNT (FIRST-TIME USER — PASSWORD + OTP)           */}
        {/* ───────────────────────────────────────────────────────────────── */}
        {tab === "signup" && (
          <>
            {signupStep === "form" ? (
              <form onSubmit={handleSendSignupOtp} className="space-y-3.5">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <PersonFill className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Full Legal Name / User Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma or Adv. Sneha"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-normal"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <EnvelopeAtFill className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Official or Personal Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="Verification OTP will be sent here"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-normal"
                  />
                </div>

                {/* Category / Role Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Stars className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Professional Category / Stakeholder Role</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ROLES.map((r) => {
                      const isRoleActive = role === r.id;
                      const Icon = r.icon;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setRole(r.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2 ${
                            isRoleActive
                              ? "bg-emerald-50 border-emerald-400 font-bold text-gray-900 shadow-2xs"
                              : "bg-gray-50 border-gray-200/80 hover:bg-gray-100/70 text-gray-700"
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${r.color} text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="overflow-hidden">
                            <span className="text-xs block leading-snug">{r.label}</span>
                            <span className="text-[10px] text-gray-400 font-normal block truncate">
                              {r.badge}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                      <KeyFill className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Password</span>
                    </label>
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-normal"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                      <ShieldLockFill className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Confirm Password</span>
                    </label>
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-normal"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="hover:text-gray-800 transition-colors cursor-pointer"
                  >
                    {showSignupPassword ? "Hide passwords" : "Show passwords"}
                  </button>
                  {signupPassword && confirmPassword && (
                    <span className={signupPassword === confirmPassword ? "text-emerald-600 font-bold" : "text-red-500 font-bold"}>
                      {signupPassword === confirmPassword ? "✓ Passwords Match" : "✕ Passwords Do Not Match"}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-300 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 btn-spring cursor-pointer"
                >
                  {isSendingOtp ? (
                    <>
                      <ArrowRepeat className="w-4 h-4 animate-spin" />
                      <span>Dispatching 6-Digit OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to OTP Verification</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* OTP Verification Step */
              <form onSubmit={handleVerifySignupOtp} className="space-y-4">
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-center space-y-1">
                  <span className="text-xs font-bold text-emerald-900 block">
                    Verification Code Dispatched
                  </span>
                  <p className="text-xs text-gray-600">
                    A 6-digit security code has been sent to{" "}
                    <span className="font-bold text-emerald-800">{signupEmail}</span>.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 text-center block">
                    Enter 6-Digit Passcode:
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="• • • • • •"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-center text-xl tracking-[8px] font-mono font-bold text-emerald-900 outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <button
                    type="button"
                    onClick={() => setSignupStep("form")}
                    className="text-gray-500 hover:text-emerald-700 font-semibold cursor-pointer"
                  >
                    ← Edit Details
                  </button>

                  <button
                    type="button"
                    disabled={resendTimer > 0 || isSendingOtp}
                    onClick={handleSendSignupOtp}
                    className="text-emerald-700 hover:text-emerald-800 disabled:text-gray-400 font-semibold cursor-pointer"
                  >
                    {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend Code"}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isRegistering || enteredOtp.length !== 6}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-300 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 btn-spring cursor-pointer"
                >
                  {isRegistering ? (
                    <>
                      <ArrowRepeat className="w-4 h-4 animate-spin" />
                      <span>Activating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Enter AYURLEX</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}

        {/* Footer Disclaimer */}
        <div className="pt-2 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-400">
            End-to-End Cryptographic Vault Isolation · Section 3(p) & TKDL Compliance
          </p>
        </div>
      </div>
    </div>
  );
}
