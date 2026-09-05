"use client";

import { useState } from "react";
import { X, ShieldCheck, User, Stethoscope, Scale, Building2, FlaskConical } from "lucide-react";

export type UserRole = "vaidya" | "attorney" | "regulator" | "researcher" | "guest";

export interface UserProfile {
  name: string;
  role: UserRole;
  registrationNumber?: string;
  institution?: string;
  isLoggedIn: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
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
}: AuthModalProps) {
  const [name, setName] = useState(currentProfile.name || "Dr. Rajesh Sharma");
  const [role, setRole] = useState<UserRole>(currentProfile.role || "vaidya");
  const [regNum, setRegNum] = useState(currentProfile.registrationNumber || "AYUSH-IN-9842");
  const [institution, setInstitution] = useState(
    currentProfile.institution || "National Institute of Ayurveda"
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name: name.trim() || "Ayurvedic Practitioner",
      role,
      registrationNumber: regNum.trim(),
      institution: institution.trim(),
      isLoggedIn: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 via-emerald-800 to-teal-900 p-5 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-green-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AYURLEX Professional Login</h2>
              <p className="text-xs text-green-200">
                Verified Jurisdictional Access · Role-Based Statutory Adaptation
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Role selector grid */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Select Your Professional Role
            </label>
            <div className="grid grid-cols-1 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-green-600 bg-green-50/70 shadow-xs ring-2 ring-green-500/20"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center text-white shrink-0 shadow-xs mt-0.5`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">
                          {r.label}
                        </span>
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {r.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {r.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Full Name / Title
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Rajesh Sharma"
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Registration / Bar / License No.
              </label>
              <input
                type="text"
                value={regNum}
                onChange={(e) => setRegNum(e.target.value)}
                placeholder="e.g. AYUSH-DL-2018"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Institution / Law Firm / Hospital
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. National Institute of Ayurveda / Apex IP Law"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          {/* Security note */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Statutory Privacy Assurance:</span> Sessions are stored locally in your browser. Consultations can be cryptographically hashed to SHA-256 for audit trails.
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              Sign In to AYURLEX
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
