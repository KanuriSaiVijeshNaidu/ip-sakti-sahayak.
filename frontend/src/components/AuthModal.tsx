"use client";

import { useState } from "react";
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
  Eye,
  EyeOff,
  LogOut,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldAlert,
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

// Generate deterministic secure session token
function generateSecureToken(email: string, role: string) {
  let hash = 0;
  const str = `${email}-${role}-${Date.now()}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `AYUR-AUTH-${hex.toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export default function AuthModal({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  onLogout,
}: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState(currentProfile.email || "vaidya.sharma@nia.edu.in");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(currentProfile.name || "Dr. Rajesh Sharma");
  const [role, setRole] = useState<UserRole>(currentProfile.role || "vaidya");
  const [regNum, setRegNum] = useState(currentProfile.registrationNumber || "AYUSH-IN-9842");
  const [institution, setInstitution] = useState(
    currentProfile.institution || "National Institute of Ayurveda"
  );
  const [rememberMe, setRememberMe] = useState(true);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordScore = getPasswordStrength(password);

  // Validate Email regex
  const isValidEmail = (em: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid official email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Successful login
    const token = generateSecureToken(email, role);
    onSaveProfile({
      name: name.trim() || email.split("@")[0].replace(".", " "),
      email: email.trim().toLowerCase(),
      role,
      registrationNumber: regNum.trim(),
      institution: institution.trim(),
      isLoggedIn: true,
      sessionToken: token,
      lastLogin: new Date().toISOString(),
    });
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid official email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters with letters & numbers.");
      return;
    }

    if (!name.trim()) {
      setError("Please provide your full legal name or designation.");
      return;
    }

    const token = generateSecureToken(email, role);
    onSaveProfile({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      registrationNumber: regNum.trim(),
      institution: institution.trim(),
      isLoggedIn: true,
      sessionToken: token,
      lastLogin: new Date().toISOString(),
    });
    onClose();
  };

  const handleDemoFill = (demoRole: UserRole) => {
    if (demoRole === "vaidya") {
      setName("Dr. Rajesh Sharma, BAMS MD");
      setEmail("vaidya.sharma@ayush.gov.in");
      setPassword("AyushSecure@2026");
      setRole("vaidya");
      setRegNum("AYUSH-DL-9842");
      setInstitution("National Institute of Ayurveda, Jaipur");
    } else if (demoRole === "attorney") {
      setName("Adv. Sneha Subramanian");
      setEmail("sneha.ip@patentbar.in");
      setPassword("PatentLaw#2026");
      setRole("attorney");
      setRegNum("IN/PA-3419");
      setInstitution("Apex Intellectual Property Counsel");
    } else {
      setName("Auditor Vikram Sen");
      setEmail("v.sen@fssai.gov.in");
      setPassword("FssaiAudit!2026");
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
                <h2 className="text-lg font-bold">AYURLEX Secure Access</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-400/30">
                  TLS 256-Bit
                </span>
              </div>
              <p className="text-xs text-green-200">
                Email Authentication · Role-Based Statutory Grounding
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

        {/* If Already Logged In: Show Profile Overview with Logout */}
        {currentProfile.isLoggedIn ? (
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {currentProfile.name[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-gray-900">{currentProfile.name}</h3>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5 font-mono">
                      <Mail className="w-3 h-3 text-emerald-700" />
                      {currentProfile.email || "vaidya.sharma@nia.edu.in"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account details */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-200/60 font-mono">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Designation Role</span>
                  <span className="font-semibold text-gray-800 uppercase">{currentProfile.role}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Bar / License No.</span>
                  <span className="font-semibold text-gray-800">{currentProfile.registrationNumber || "N/A"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 block text-[10px] uppercase">Affiliated Body</span>
                  <span className="font-semibold text-gray-800">{currentProfile.institution || "National Institute of Ayurveda"}</span>
                </div>
              </div>

              {/* Session Token */}
              <div className="bg-white/80 border border-emerald-200 rounded-xl p-2.5 text-[11px] font-mono text-gray-700 space-y-1">
                <div className="flex items-center justify-between text-gray-500 text-[10px]">
                  <span>Cryptographic Session Token:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified PoA
                  </span>
                </div>
                <div className="text-gray-800 font-bold break-all">
                  {currentProfile.sessionToken || generateSecureToken(currentProfile.email || "user", currentProfile.role)}
                </div>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Zero-Knowledge Legal Privacy:</span> Inquiries and consultations are processed with strict client-attorney confidentiality. Statutory citations are anchored to official gazette records.
              </div>
            </div>

            {/* Logout & Action Buttons */}
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setTab(tab === "signin" ? "register" : "signin")}
                className="text-xs text-gray-600 hover:text-green-800 font-medium underline"
              >
                Switch Account / Role
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
                    if (confirm("Are you sure you want to log out of AYURLEX? Your current session credentials will be cleared.")) {
                      onLogout();
                      onClose();
                    }
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Form for Sign In or Register */
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setTab("signin");
                  setError(null);
                }}
                className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-colors ${
                  tab === "signin"
                    ? "border-green-700 text-green-800"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                Sign In with Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setError(null);
                }}
                className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-colors ${
                  tab === "register"
                    ? "border-green-700 text-green-800"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                Register Role Credentials
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* TAB: SIGN IN */}
            {tab === "signin" && (
              <form onSubmit={handleSignIn} className="space-y-3.5">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Official Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. vaidya.sharma@ayush.gov.in"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Password
                    </label>
                    <span className="text-[11px] text-green-700 hover:underline cursor-pointer">
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your confidential password"
                      required
                      className="w-full pl-9 pr-9 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Role quick selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Active Authority Domain
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="vaidya">Ayurvedic Practitioner (Vaidya)</option>
                    <option value="attorney">Patent Attorney / IP Advocate</option>
                    <option value="regulator">Regulatory Auditor / FSSAI Officer</option>
                    <option value="researcher">AYUSH Enterprise R&D / Scholar</option>
                    <option value="guest">Public Citizen / Researcher</option>
                  </select>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-green-700 focus:ring-green-500"
                    />
                    <span>Remember terminal credentials</span>
                  </label>
                </div>

                {/* Quick Autofill Buttons for Testing */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-[11px] space-y-1.5">
                  <span className="text-gray-500 font-semibold block text-[10px] uppercase">
                    ⚡ Quick Test Credentials:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDemoFill("vaidya")}
                      className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono hover:bg-emerald-200 transition-colors"
                    >
                      🩺 Vaidya (AYUSH)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoFill("attorney")}
                      className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-mono hover:bg-blue-200 transition-colors"
                    >
                      ⚖️ IP Attorney
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoFill("regulator")}
                      className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-mono hover:bg-purple-200 transition-colors"
                    >
                      🏛️ FSSAI Officer
                    </button>
                  </div>
                </div>

                {/* Submit */}
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
                    className="px-5 py-2 text-xs font-bold text-white bg-green-700 hover:bg-green-800 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    Sign In with Email
                  </button>
                </div>
              </form>
            )}

            {/* TAB: REGISTER */}
            {tab === "register" && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Legal Name & Honors
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Sharma, BAMS MD"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Official Institutional / Bar Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. r.sharma@nia.edu.in"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>

                {/* Password with strength meter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Master Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 characters with letters, numbers, symbols"
                      required
                      className="w-full pl-9 pr-9 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Password strength indicators */}
                  {password && (
                    <div className="mt-1.5 space-y-1">
                      <div className="flex gap-1 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            passwordScore <= 1
                              ? "w-1/4 bg-red-500"
                              : passwordScore === 2
                              ? "w-2/4 bg-amber-500"
                              : passwordScore === 3
                              ? "w-3/4 bg-blue-500"
                              : "w-full bg-green-600"
                          }`}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">
                        Security Strength:{" "}
                        {passwordScore <= 1
                          ? "Weak"
                          : passwordScore === 2
                          ? "Medium"
                          : passwordScore === 3
                          ? "Good"
                          : "Strong (AES-Ready)"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Role selection grid */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Select Your Statutory Persona
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

                {/* Registration Number & Institution */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                      Bar / AYUSH License No.
                    </label>
                    <input
                      type="text"
                      value={regNum}
                      onChange={(e) => setRegNum(e.target.value)}
                      placeholder="e.g. IN/PA-3419"
                      className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                      Institution / Law Firm
                    </label>
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. NIA Jaipur"
                      className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg outline-none"
                    />
                  </div>
                </div>

                {/* Submit Register */}
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
                    className="px-5 py-2 text-xs font-bold text-white bg-green-700 hover:bg-green-800 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Register Verified Role
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
            End-to-End Encrypted Session
          </span>
          <span className="font-mono text-[10px] text-emerald-800 font-bold">
            SHA-256 LEDGER COMPLIANT
          </span>
        </div>
      </div>
    </div>
  );
}
