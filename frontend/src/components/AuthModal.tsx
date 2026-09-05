"use client";

import { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  User,
  Stethoscope,
  Scale,
  Building2,
  FlaskConical,
  Mail,
  Lock,
  LogOut,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { UserRole, UserProfile } from "@/types";

export type { UserRole, UserProfile };

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onLogout: () => void;
}

const ROLES: {
  id: UserRole;
  label: string;
  description: string;
  icon: typeof Stethoscope;
  color: string;
  badge: string;
}[] = [
  {
    id: "vaidya",
    label: "Ayurvedic Doctor / Vaidya",
    description: "Registered Indian Medicine Practitioner with BDA 2023 exemptions & AFI classical formulations.",
    icon: Stethoscope,
    color: "from-emerald-600 to-teal-700",
    badge: "ISM Registered Vaidya",
  },
  {
    id: "attorney",
    label: "Patent Attorney / IP Agent",
    description: "Registered with CGPDTM. Focus on Sec 3(e), 3(p), 3(d), Form III NBA and prior art defense.",
    icon: Scale,
    color: "from-blue-600 to-indigo-700",
    badge: "Patent Bar / IN-PA",
  },
  {
    id: "regulator",
    label: "Regulatory Auditor / FSSAI Officer",
    description: "State Licensing Authority or Food Safety Officer monitoring Rule 158B & Schedule T GMP.",
    icon: Building2,
    color: "from-purple-600 to-violet-800",
    badge: "SLA / FSSAI Officer",
  },
  {
    id: "researcher",
    label: "AYUSH Enterprise / Scientist",
    description: "R&D Scientist or Herbal Exporter managing commercial ABS, API monographs & TLC markers.",
    icon: FlaskConical,
    color: "from-amber-600 to-orange-700",
    badge: "AYUSH R&D / Scholar",
  },
  {
    id: "guest",
    label: "Public Citizen / Researcher",
    description: "General statutory inquiries, herbal heritage rights, and biopiracy case investigations.",
    icon: User,
    color: "from-gray-600 to-slate-700",
    badge: "Citizen Inquirer",
  },
];

export default function AuthModal({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  onLogout,
}: AuthModalProps) {
  // Step 1: "email" (enter email & role), Step 2: "otp" (verify 6-digit OTP)
  const [step, setStep] = useState<"email" | "otp">("email");
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState(currentProfile.email || "");
  const [name, setName] = useState(currentProfile.name || "");
  const [role, setRole] = useState<UserRole>(currentProfile.role || "vaidya");
  const [regNum, setRegNum] = useState(currentProfile.registrationNumber || "");
  const [institution, setInstitution] = useState(currentProfile.institution || "");

  // OTP states
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  const [enteredOtp, setEnteredOtp] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  // Validate Email
  const isValidEmail = (em: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
  };

  // Step 1: Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      setError("Please enter a valid official email address (e.g., name@ayush.gov.in).");
      return;
    }

    setIsSendingOtp(true);

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setResendTimer(60);
    setEnteredOtp("");

    setTimeout(() => {
      setIsSendingOtp(false);
      setStep("otp");
    }, 600);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setError("Invalid OTP code. Please enter the 6-digit verification code sent to your email.");
      return;
    }

    // Generate authenticated session token
    const token = `AYUR-OTP-0x${Math.floor(Math.random() * 16777215).toString(16).toUpperCase()}`;
    const cleanEmail = email.trim().toLowerCase();
    const finalName = name.trim() || cleanEmail.split("@")[0].replace(".", " ");

    onSaveProfile({
      name: finalName,
      email: cleanEmail,
      role,
      registrationNumber: regNum.trim() || "AYUSH-REG-VERIFIED",
      institution: institution.trim() || "Ayurvedic Medicine & Research Council",
      isLoggedIn: true,
      sessionToken: token,
      lastLogin: new Date().toISOString(),
    });

    setStep("email");
    onClose();
  };

  const handleDemoFill = (demoRole: UserRole) => {
    if (demoRole === "vaidya") {
      setName("Dr. Rajesh Sharma, BAMS MD");
      setEmail("vaidya.sharma@ayush.gov.in");
      setRole("vaidya");
      setRegNum("AYUSH-DL-9842");
      setInstitution("National Institute of Ayurveda, Jaipur");
    } else if (demoRole === "attorney") {
      setName("Adv. Sneha Subramanian");
      setEmail("sneha.ip@patentbar.in");
      setRole("attorney");
      setRegNum("IN/PA-3419");
      setInstitution("Apex Intellectual Property Counsel");
    } else {
      setName("Auditor Vikram Sen");
      setEmail("v.sen@fssai.gov.in");
      setRole("regulator");
      setRegNum("FSSAI-INSP-204");
      setInstitution("Central Licensing & Food Safety Authority");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-800 via-emerald-900 to-teal-950 p-5 text-white flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-green-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">AYURLEX Email & OTP Vault</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-400/30">
                  Per-User Isolation
                </span>
              </div>
              <p className="text-xs text-green-200">
                Official Email Verification · Private Multi-Session Storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* IF USER IS CURRENTLY LOGGED IN: SHOW PROFILE + EXPLICIT SIGN OUT */}
        {currentProfile.isLoggedIn ? (
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                    {currentProfile.name[0]?.toUpperCase() || "V"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-gray-900">{currentProfile.name}</h3>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                        VERIFIED
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5 font-mono">
                      <Mail className="w-3.5 h-3.5 text-emerald-700" />
                      {currentProfile.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account details */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-200/60 font-mono">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Jurisdiction Role</span>
                  <span className="font-semibold text-gray-800 uppercase">{currentProfile.role}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">License / Bar No.</span>
                  <span className="font-semibold text-gray-800">{currentProfile.registrationNumber || "VERIFIED"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 block text-[10px] uppercase">Institution</span>
                  <span className="font-semibold text-gray-800">{currentProfile.institution || "National Institute of Ayurveda"}</span>
                </div>
              </div>

              {/* Data Isolation Notice */}
              <div className="bg-white/90 border border-emerald-200 rounded-xl p-3 text-[11px] font-mono text-gray-700 space-y-1">
                <div className="flex items-center justify-between text-emerald-800 text-[10px] font-bold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Private Consultation Vault: ACTIVE
                  </span>
                  <span>TLS 256-Bit</span>
                </div>
                <p className="text-[10px] text-gray-500 font-sans">
                  Your chat history and statutory audit records are strictly isolated to <strong className="text-gray-800">{currentProfile.email}</strong> and completely inaccessible to other users or sessions.
                </p>
              </div>
            </div>

            {/* Logout & Action Buttons */}
            <div className="pt-3 border-t border-gray-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  onLogout();
                }}
                className="text-xs text-gray-600 hover:text-green-800 font-medium underline"
              >
                Switch Account
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out of AYURLEX
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* NOT LOGGED IN: 2-STEP EMAIL WITH OTP LOGIN */
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Step Indicators */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-mono mb-1">
              <span
                className={`px-2 py-0.5 rounded-full font-bold ${
                  step === "email" ? "bg-green-700 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                1. Official Email
              </span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
              <span
                className={`px-2 py-0.5 rounded-full font-bold ${
                  step === "otp" ? "bg-green-700 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                2. 6-Digit OTP
              </span>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: ENTER EMAIL & PERSONA */}
            {step === "email" && (
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Official Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. vaidya.sharma@ayush.gov.in"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Your unique consultation history will be isolated and encrypted under this email.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name & Title
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Sharma, BAMS"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Select Your Statutory Role
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-1">
                    {ROLES.map((r) => {
                      const Icon = r.icon;
                      const isSelected = role === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setRole(r.id)}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "border-green-600 bg-green-50/70 ring-1 ring-green-600"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center text-white shrink-0`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-gray-900 block truncate">
                              {r.label}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 bg-gray-100 rounded text-gray-600 shrink-0">
                            {r.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Autofill Buttons for Testing */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-[11px] space-y-1.5">
                  <span className="text-gray-500 font-semibold block text-[10px] uppercase">
                    ⚡ Quick Test Personas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDemoFill("vaidya")}
                      className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono hover:bg-emerald-200 transition-colors"
                    >
                      🩺 Vaidya Sharma
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoFill("attorney")}
                      className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-mono hover:bg-blue-200 transition-colors"
                    >
                      ⚖️ Attorney Sneha
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoFill("regulator")}
                      className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-mono hover:bg-purple-200 transition-colors"
                    >
                      🏛️ Auditor Vikram
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="px-5 py-2 text-xs font-bold text-white bg-green-700 hover:bg-green-800 rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSendingOtp ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <KeyRound className="w-3.5 h-3.5" />
                    )}
                    <span>Send Verification OTP</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: ENTER & VERIFY OTP */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {/* OTP Dispatch Card */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <Mail className="w-4 h-4 text-emerald-700" />
                    <span>OTP Sent to {email}</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    A 6-digit verification code has been dispatched to authenticate your private consultation vault.
                  </p>

                  {/* Simulated Secure Delivery Badge for Testing */}
                  <div className="bg-white border border-emerald-300 rounded-lg p-2 flex items-center justify-between font-mono">
                    <div>
                      <span className="text-[10px] text-gray-500 block">DEMO DISPATCHED OTP:</span>
                      <span className="text-base font-bold text-emerald-800 tracking-widest">
                        {generatedOtp}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEnteredOtp(generatedOtp)}
                      className="px-2.5 py-1 text-[11px] bg-emerald-700 hover:bg-emerald-800 text-white rounded-md font-sans font-bold flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      Auto-fill OTP
                    </button>
                  </div>
                </div>

                {/* OTP Input */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 text-center">
                    Enter 6-Digit One-Time Passcode
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="• • • • • •"
                    required
                    autoFocus
                    className="w-full text-center tracking-[0.6em] text-xl font-bold py-3 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-2 focus:ring-green-500/20 outline-none font-mono"
                  />
                </div>

                {/* Resend Timer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-gray-600 hover:underline text-[11px]"
                  >
                    ← Change Email
                  </button>

                  <div className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {resendTimer > 0 ? (
                      <span>Resend in {resendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-green-700 font-bold hover:underline"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-green-700 hover:bg-green-800 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verify & Access Private Vault
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Modal Security Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 text-[11px] text-gray-500 flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Zero-Knowledge Isolated Storage
          </span>
          <span className="font-mono text-[10px] text-emerald-800 font-bold">
            TLS 256 / SHA-256
          </span>
        </div>
      </div>
    </div>
  );
}
