"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldShaded,
  ShieldCheck,
  ShieldLockFill,
  PersonFill,
  PersonBadgeFill,
  EnvelopeAtFill,
  KeyFill,
  HeartPulseFill,
  BriefcaseFill,
  BuildingFillGear,
  Flower1,
  BoxArrowRight,
  HouseDoorFill,
  Check2Circle,
  PencilSquare,
  LockFill,
  CalendarCheck,
  CheckCircleFill,
  EyeFill,
  EyeSlashFill,
  ArrowRepeat,
  ExclamationCircleFill,
  Globe2,
  ArrowRightCircleFill,
} from "react-bootstrap-icons";
import { UserProfile, UserRole, JurisdictionType, LanguageCode } from "@/types";
import { signOutFromSupabase, upsertSupabaseUserProfile, setSupabaseUserPassword } from "@/lib/supabase";
import { getTranslation } from "@/lib/i18n";

const ROLE_DETAILS: Record<string, { label: string; icon: any; desc: string }> = {
  vaidya: {
    label: "Ayurvedic Doctor / Vaidya",
    icon: HeartPulseFill,
    desc: "ISM Registered Practitioner with BDA 2023 exemptions and AFI classical formulations.",
  },
  attorney: {
    label: "Patent Attorney / IP Agent",
    icon: BriefcaseFill,
    desc: "Registered with CGPDTM. Focus on Section 3(e), 3(p), Form III NBA and prior art defense.",
  },
  regulator: {
    label: "Regulatory Auditor / FSSAI Officer",
    icon: BuildingFillGear,
    desc: "State Licensing Authority or Food Safety Officer monitoring Rule 158B and Schedule T GMP.",
  },
  researcher: {
    label: "AYUSH Enterprise / Scientist",
    icon: Flower1,
    desc: "Research Scientist or Herbal Exporter managing commercial ABS, API monographs and TLC markers.",
  },
  guest: {
    label: "Public Citizen / Researcher",
    icon: PersonFill,
    desc: "General statutory inquiries, herbal heritage rights, and traditional knowledge.",
  },
};

const JURISDICTION_DETAILS: Record<string, { label: string; flag: string; desc: string }> = {
  US: { label: "United States", flag: "🇺🇸", desc: "USPTO Patent Examination (35 U.S.C.) · FDA DSHEA 1994 · Lanham Act" },
  IN: { label: "India", flag: "🇮🇳", desc: "CGPDTM Patents Act 1970 · AYUSH Rule 158B · FSSAI 2022 · NBA Section 6" },
  EU: { label: "European Union", flag: "🇪🇺", desc: "EPO European Patent Convention (EPC Art. 52-56) · EMA Herbal Directive" },
  DE: { label: "Germany", flag: "🇩🇪", desc: "DPMA Patentgesetz (PatG) · BfArM · Commission E Herbal Standards" },
  WO: { label: "International / Global", flag: "🌐", desc: "WIPO Patent Cooperation Treaty (PCT) · Genetic Resources Treaty 2024" },
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeJurisdiction, setActiveJurisdiction] = useState<JurisdictionType>("IN");
  const [language, setLanguage] = useState<LanguageCode>("en");

  // Edit Mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("vaidya");
  const [editInstitution, setEditInstitution] = useState("");
  const [editRegNum, setEditRegNum] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password change states
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("ayurlex_language") as LanguageCode;
      if (savedLang && ["en", "te", "hi", "de", "ta", "kn", "ml"].includes(savedLang)) {
        setLanguage(savedLang);
      }

      const stored = localStorage.getItem("ayurlex_user_profile");
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        if (parsed && parsed.isLoggedIn) {
          setProfile(parsed);
          setEditName(parsed.name || "");
          setEditRole((parsed.role as UserRole) || "vaidya");
          setEditInstitution(parsed.institution || "");
          setEditRegNum(parsed.registrationNumber || "");

          const savedJur = localStorage.getItem("ayurlex_jurisdiction") as JurisdictionType;
          if (savedJur && ["US", "IN", "EU", "DE", "WO"].includes(savedJur)) {
            setActiveJurisdiction(savedJur);
          }

          setLoading(false);
          return;
        }
      }
      router.replace("/login");
    } catch {
      router.replace("/login");
    }
  }, [router]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center text-zinc-300 font-mono flex items-center gap-3">
          <ArrowRepeat className="w-6 h-6 animate-spin text-white" />
          <span>Loading AYURLEX User Profile...</span>
        </div>
      </div>
    );
  }

  const roleMeta = ROLE_DETAILS[profile.role || "guest"] || ROLE_DETAILS.guest;
  const RoleIcon = roleMeta.icon;
  const jurMeta = JURISDICTION_DETAILS[activeJurisdiction] || JURISDICTION_DETAILS.IN;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setIsSaving(true);

    try {
      const updatedProfile: UserProfile = {
        ...profile,
        name: editName.trim() || profile.name,
        role: editRole,
        institution: editInstitution.trim() || profile.institution,
        registrationNumber: editRegNum.trim() || profile.registrationNumber,
      };

      await upsertSupabaseUserProfile({
        username: updatedProfile.username || profile.email.split("@")[0],
        email: updatedProfile.email,
        name: updatedProfile.name,
        role: updatedProfile.role,
        institution: updatedProfile.institution,
        registrationNumber: updatedProfile.registrationNumber,
      });

      localStorage.setItem("ayurlex_user_profile", JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      setIsEditing(false);
      setStatusMsg({ type: "success", text: "Profile updated and synchronized with Supabase successfully." });
    } catch (err: any) {
      console.error("Save profile error:", err);
      setStatusMsg({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (newPassword.length < 6) {
      setStatusMsg({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setStatusMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    setIsChangingPassword(true);
    try {
      await setSupabaseUserPassword(newPassword);
      setStatusMsg({ type: "success", text: "Password updated successfully via Supabase Auth." });
      setNewPassword("");
      setConfirmNewPassword("");
      setShowPasswordSection(false);
    } catch (err: any) {
      console.error("Change password error:", err);
      setStatusMsg({ type: "error", text: err?.message || "Failed to update password. Please check your connection." });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to sign out of AYURLEX?")) {
      await signOutFromSupabase();
      router.replace("/login");
    }
  };

  const t = getTranslation(language);

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-3 sm:p-6 flex flex-col items-center relative overflow-x-hidden">
      {/* Top Navbar */}
      <header className="w-full max-w-4xl flex items-center justify-between py-3 px-4 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-2xl mb-6 shadow-2xl">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-left hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold shadow-md shrink-0">
            <ShieldShaded className="w-4 h-4 text-black" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
              <span>{t.title}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                PRO
              </span>
            </h1>
            <p className="text-[10px] text-zinc-400 hidden sm:block">{t.subtitle}</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/location"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-all"
          >
            <Globe2 className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">{t.nav.activeMarket}:</span>
            <span>{jurMeta.flag}</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-black bg-white hover:bg-zinc-200 rounded-xl transition-all shadow-md"
          >
            <HouseDoorFill className="w-3.5 h-3.5 text-black" />
            <span>{t.locationPage.backToChat}</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-4xl flex flex-col gap-5 text-left">
        {/* Status Notification */}
        {statusMsg && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2.5 animate-in fade-in ${
              statusMsg.type === "success"
                ? "bg-zinc-900 border-zinc-700 text-white"
                : "bg-red-950/60 border-red-800 text-red-300"
            }`}
          >
            {statusMsg.type === "success" ? (
              <Check2Circle className="w-4 h-4 shrink-0 text-white" />
            ) : (
              <ExclamationCircleFill className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Hero User Card */}
        <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{profile.name}</h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-semibold">
                    @{profile.username || profile.email.split("@")[0]}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1 text-zinc-200 font-medium">
                    <RoleIcon className="w-3.5 h-3.5 text-white" />
                    {roleMeta.label}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span>{profile.institution || "Ayurvedic Medical Community"}</span>
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[11px] text-zinc-300 bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3 h-3 text-white" />
                    Supabase Cloud Authenticated
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-zinc-300 bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded-md font-mono">
                    ID: {profile.registrationNumber || "AYUR-VERIFIED"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <PencilSquare className="w-3.5 h-3.5 text-white" />
              <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
            </button>
          </div>

          {/* Edit Profile Form (Conditional) */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="pt-5 pb-2 border-b border-zinc-800/80 animate-in fade-in">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <PencilSquare className="w-4 h-4 text-white" />
                Edit Profile Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1 font-medium">Professional Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white cursor-pointer"
                  >
                    {Object.entries(ROLE_DETAILS).map(([key, r]) => (
                      <option key={key} value={key}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1 font-medium">Institution / Organization</label>
                  <input
                    type="text"
                    value={editInstitution}
                    onChange={(e) => setEditInstitution(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1 font-medium">Registration / AYUR-ID</label>
                  <input
                    type="text"
                    value={editRegNum}
                    onChange={(e) => setEditRegNum(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-black bg-white hover:bg-zinc-200 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <ArrowRepeat className="w-3.5 h-3.5 animate-spin" /> : <CheckCircleFill className="w-3.5 h-3.5" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* Details Grid (Mobile-Optimized Vertical Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-5">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                <EnvelopeAtFill className="w-4 h-4 text-white" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">Verified Email / Gmail</span>
                <span className="text-xs sm:text-sm font-semibold text-white truncate block mt-0.5">{profile.email}</span>
                <span className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5 font-medium">
                  <Check2Circle className="w-3 h-3 text-white" /> Supabase OTP Verified
                </span>
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                <PersonBadgeFill className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">Unique Username</span>
                <span className="text-xs sm:text-sm font-semibold text-white block mt-0.5">
                  @{profile.username || profile.email.split("@")[0]}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Used for direct password login</span>
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                <CalendarCheck className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">Last Login & Activity</span>
                <span className="text-xs sm:text-sm font-semibold text-white block mt-0.5">
                  {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : "Active Now"}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Device: {profile.device || "📱 Mobile / Laptop"}</span>
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                <KeyFill className="w-4 h-4 text-white" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">Security Vault</span>
                <span className="text-xs sm:text-sm font-mono text-zinc-200 font-bold block mt-0.5 truncate">
                  {profile.sessionToken || "AYUR-SECURE-SESSION"}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">256-Bit Encrypted · Supabase Protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operating Location & Jurisdiction Card (User can view and change location here!) */}
        <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-2xl shrink-0">
                {jurMeta.flag}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {t.profilePage.targetMarketCardTitle}: {jurMeta.label}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-semibold">
                    {t.locationPage.strictIsolation}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-snug">
                  {jurMeta.desc}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1 italic">
                  {t.profilePage.jurisdictionNote}
                </p>
              </div>
            </div>

            <Link
              href="/location"
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-black bg-white hover:bg-zinc-200 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>{t.profilePage.changeMarketButton}</span>
              <ArrowRightCircleFill className="w-3.5 h-3.5 text-black" />
            </Link>
          </div>
        </div>

        {/* Security & Password Settings Card */}
        <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white border border-zinc-800 shrink-0">
                <LockFill className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">Password & Authentication Management</h3>
                <p className="text-xs text-zinc-400">
                  Update your AYURLEX login password for fast direct sign-in.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl transition-all cursor-pointer"
            >
              {showPasswordSection ? "Close" : "Change Password"}
            </button>
          </div>

          {showPasswordSection && (
            <form onSubmit={handleChangePassword} className="mt-5 pt-4 border-t border-zinc-800 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1 font-medium">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 pr-9 text-xs text-white focus:outline-none focus:border-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showPassword ? <EyeSlashFill className="w-3.5 h-3.5" /> : <EyeFill className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1 font-medium">Confirm New Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordSection(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-black bg-white hover:bg-zinc-200 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isChangingPassword ? <ArrowRepeat className="w-3.5 h-3.5 animate-spin" /> : <CheckCircleFill className="w-3.5 h-3.5" />}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Bottom Sign Out Card (Clear and Prominent at Bottom) */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
            <div className="w-11 h-11 rounded-xl bg-zinc-900 flex items-center justify-center text-red-400 border border-zinc-800 shrink-0">
              <BoxArrowRight className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Sign Out of AYURLEX</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Logged in as <span className="font-semibold text-white">{profile.name}</span> ({profile.email}). Safely end your active session.
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 btn-spring cursor-pointer shrink-0"
          >
            <BoxArrowRight className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </main>
    </div>
  );
}
