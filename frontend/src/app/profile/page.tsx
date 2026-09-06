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
} from "react-bootstrap-icons";
import { UserProfile, UserRole } from "@/types";
import { signOutFromSupabase, upsertSupabaseUserProfile, setSupabaseUserPassword } from "@/lib/supabase";

const ROLE_DETAILS: Record<string, { label: string; icon: any; color: string; desc: string }> = {
  vaidya: {
    label: "Ayurvedic Doctor / Vaidya",
    icon: HeartPulseFill,
    color: "from-emerald-600 to-teal-700",
    desc: "ISM Registered Practitioner with BDA 2023 exemptions and AFI classical formulations.",
  },
  attorney: {
    label: "Patent Attorney / IP Agent",
    icon: BriefcaseFill,
    color: "from-blue-600 to-indigo-700",
    desc: "Registered with CGPDTM. Focus on Section 3(e), 3(p), Form III NBA and prior art defense.",
  },
  regulator: {
    label: "Regulatory Auditor / FSSAI Officer",
    icon: BuildingFillGear,
    color: "from-purple-600 to-violet-800",
    desc: "State Licensing Authority or Food Safety Officer monitoring Rule 158B and Schedule T GMP.",
  },
  researcher: {
    label: "AYUSH Enterprise / Scientist",
    icon: Flower1,
    color: "from-amber-600 to-orange-700",
    desc: "Research Scientist or Herbal Exporter managing commercial ABS, API monographs and TLC markers.",
  },
  guest: {
    label: "Public Citizen / Researcher",
    icon: PersonFill,
    color: "from-gray-600 to-slate-700",
    desc: "General statutory inquiries, herbal heritage rights, and traditional knowledge.",
  },
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
      const stored = localStorage.getItem("ayurlex_user_profile");
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        if (parsed && parsed.isLoggedIn) {
          setProfile(parsed);
          setEditName(parsed.name || "");
          setEditRole((parsed.role as UserRole) || "vaidya");
          setEditInstitution(parsed.institution || "");
          setEditRegNum(parsed.registrationNumber || "");
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center text-emerald-400 font-mono flex items-center gap-3">
          <ArrowRepeat className="w-6 h-6 animate-spin" />
          <span>Loading AYURLEX User Profile...</span>
        </div>
      </div>
    );
  }

  const roleMeta = ROLE_DETAILS[profile.role || "guest"] || ROLE_DETAILS.guest;
  const RoleIcon = roleMeta.icon;

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

      // 1. Sync to Supabase Cloud Database
      await upsertSupabaseUserProfile({
        username: updatedProfile.username || profile.email.split("@")[0],
        email: updatedProfile.email,
        name: updatedProfile.name,
        role: updatedProfile.role,
        institution: updatedProfile.institution,
        registrationNumber: updatedProfile.registrationNumber,
      });

      // 2. Sync to local client storage
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 text-slate-100 p-3 sm:p-6 flex flex-col items-center">
      {/* Top Navbar */}
      <header className="w-full max-w-4xl flex items-center justify-between py-3 px-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl mb-6 shadow-xl">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-left hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-sm">
            <ShieldShaded className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
              <span>AYURLEX</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                USER VAULT
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 hidden sm:block">Ministry of Ayush · SIH26045</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl border border-slate-700 transition-all"
          >
            <HouseDoorFill className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chat Workspace</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 rounded-xl transition-all cursor-pointer"
          >
            <BoxArrowRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-4xl flex flex-col gap-6">
        {/* Status Notification */}
        {statusMsg && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2.5 animate-in fade-in ${
              statusMsg.type === "success"
                ? "bg-emerald-950/60 border-emerald-700 text-emerald-300"
                : "bg-red-950/60 border-red-700 text-red-300"
            }`}
          >
            {statusMsg.type === "success" ? (
              <Check2Circle className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <ExclamationCircleFill className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Hero User Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-900/40 border border-emerald-400/20 shrink-0">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{profile.name}</h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                    @{profile.username || profile.email.split("@")[0]}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <RoleIcon className="w-3.5 h-3.5" />
                    {roleMeta.label}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>{profile.institution || "Ayurvedic Medical Community"}</span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-[11px] text-teal-300 bg-teal-950/80 border border-teal-800/80 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3 h-3 text-teal-400" />
                    Supabase Cloud Authenticated
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-md font-mono">
                    ID: {profile.registrationNumber || "AYUR-VERIFIED"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-700/80 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <PencilSquare className="w-3.5 h-3.5" />
              <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
            </button>
          </div>

          {/* Edit Profile Form (Conditional) */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="pt-5 pb-2 border-b border-slate-800/80 animate-in fade-in">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <PencilSquare className="w-4 h-4 text-emerald-400" />
                Edit Profile Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Professional Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {Object.entries(ROLE_DETAILS).map(([key, r]) => (
                      <option key={key} value={key}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Institution / Organization</label>
                  <input
                    type="text"
                    value={editInstitution}
                    onChange={(e) => setEditInstitution(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Registration / AYUR-ID</label>
                  <input
                    type="text"
                    value={editRegNum}
                    onChange={(e) => setEditRegNum(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <ArrowRepeat className="w-3.5 h-3.5 animate-spin" /> : <CheckCircleFill className="w-3.5 h-3.5" />}
                  <span>Save to Supabase</span>
                </button>
              </div>
            </form>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <EnvelopeAtFill className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Verified Email / Gmail</span>
                <span className="text-xs sm:text-sm font-semibold text-white truncate block mt-0.5">{profile.email}</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                  <Check2Circle className="w-3 h-3" /> Supabase OTP Verified
                </span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <PersonBadgeFill className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Unique Username</span>
                <span className="text-xs sm:text-sm font-semibold text-white block mt-0.5">
                  @{profile.username || profile.email.split("@")[0]}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Used for direct password login</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <CalendarCheck className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Last Login & Activity</span>
                <span className="text-xs sm:text-sm font-semibold text-white block mt-0.5">
                  {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : "Active Now"}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Device: {profile.device || "💻 Desktop / Laptop"}</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <KeyFill className="w-4 h-4 text-amber-400" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Security & Session Vault</span>
                <span className="text-xs sm:text-sm font-mono text-emerald-400 font-bold block mt-0.5 truncate">
                  {profile.sessionToken || "AYUR-SECURE-SESSION"}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">256-Bit Encrypted · Supabase Protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Password Settings Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 border border-slate-700">
                <LockFill className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">Password & Authentication Management</h3>
                <p className="text-xs text-slate-400">
                  First login was verified via Gmail OTP. Subsequent logins use Username & Password.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all cursor-pointer"
            >
              {showPasswordSection ? "Close" : "Change Password"}
            </button>
          </div>

          {showPasswordSection && (
            <form onSubmit={handleChangePassword} className="mt-5 pt-4 border-t border-slate-800 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 pr-9 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeSlashFill className="w-3.5 h-3.5" /> : <EyeFill className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-medium">Confirm New Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordSection(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isChangingPassword ? <ArrowRepeat className="w-3.5 h-3.5 animate-spin" /> : <CheckCircleFill className="w-3.5 h-3.5" />}
                  <span>Update Password in Supabase</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Cloud Architecture Badge */}
        <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs text-emerald-300">
          <div className="flex items-center gap-2.5">
            <ShieldLockFill className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Supabase Cloud Security Active:</strong> All user records, roles, and session tokens are isolated with Row-Level Security (RLS) and encrypted password digests.
            </span>
          </div>
          <Link
            href="/"
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-sm shrink-0"
          >
            Launch Chat
          </Link>
        </div>
      </main>
    </div>
  );
}
