"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Globe, 
  ChevronDown, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  FileText, 
  Bookmark, 
  Sliders, 
  LogOut, 
  LogIn,
  Activity
} from "lucide-react";
import { JurisdictionType } from "@/types";

interface NavbarProps {
  onOpenSystemStatus?: () => void;
}

const MARKETS: { id: JurisdictionType; label: string; flag: string; sub: string }[] = [
  { id: "US", label: "United States", flag: "🇺🇸", sub: "USPTO / FDA DSHEA" },
  { id: "IN", label: "India", flag: "🇮🇳", sub: "Patents Act § 3(e)/3(p) & NBA" },
  { id: "EU", label: "European Union", flag: "🇪🇺", sub: "EPO / EMA THMPD" },
  { id: "JP", label: "Japan", flag: "🇯🇵", sub: "JPO / PMD Act (薬機法)" },
  { id: "WO", label: "Global", flag: "🌐", sub: "WIPO PCT Framework" },
];

export default function Navbar({ onOpenSystemStatus }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentMarket, setCurrentMarket] = useState<JurisdictionType>("US");
  const [marketDropdownOpen, setMarketDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const marketRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Sync market and profile from localStorage
  useEffect(() => {
    try {
      const savedJur = localStorage.getItem("ayurlex_jurisdiction") as JurisdictionType;
      if (savedJur && ["US", "IN", "EU", "JP", "WO"].includes(savedJur)) {
        setCurrentMarket(savedJur);
      }
      const rawUser = localStorage.getItem("ayurlex_user_profile");
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (parsed?.email) setUserEmail(parsed.email);
      }
    } catch {}
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (marketRef.current && !marketRef.current.contains(event.target as Node)) {
        setMarketDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectMarket = (marketId: JurisdictionType) => {
    setCurrentMarket(marketId);
    try {
      localStorage.setItem("ayurlex_jurisdiction", marketId);
      // Dispatch storage event so other components immediately react
      window.dispatchEvent(new Event("storage"));
    } catch {}
    setMarketDropdownOpen(false);
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem("ayurlex_user_profile");
    } catch {}
    setUserEmail(null);
    setProfileDropdownOpen(false);
    router.push("/login");
  };

  const activeMarketInfo = MARKETS.find((m) => m.id === currentMarket) || MARKETS[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* LEFT: Logo & Subtitle */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-sm group-hover:bg-emerald-700 transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-slate-900 leading-tight">
              AYURLEX
            </div>
            <div className="text-[11px] text-slate-500 font-medium tracking-tight">
              IP & Regulatory Intelligence
            </div>
          </div>
        </Link>

        {/* CENTER: Navigation (Home, Analyze, Reports) */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
              pathname === "/" 
                ? "text-emerald-800 bg-emerald-50 font-semibold" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            Home
          </Link>
          <Link
            href="/analyze"
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
              pathname === "/analyze" || pathname.startsWith("/decision")
                ? "text-emerald-800 bg-emerald-50 font-semibold" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            Analyze
          </Link>
          <Link
            href="/reports"
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
              pathname === "/reports"
                ? "text-emerald-800 bg-emerald-50 font-semibold" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            Reports
          </Link>
        </nav>

        {/* RIGHT: Target Market Dropdown + Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Target Market Dropdown */}
          <div className="relative" ref={marketRef}>
            <button
              onClick={() => setMarketDropdownOpen(!marketDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-all cursor-pointer"
              title="Change Target Market"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{activeMarketInfo.label}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${marketDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {marketDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 animate-in fade-in-50 zoom-in-95">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Target Market
                </div>
                {MARKETS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMarket(m.id)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      currentMarket === m.id ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{m.flag}</span>
                      <div>
                        <div>{m.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{m.sub}</div>
                      </div>
                    </div>
                    {currentMarket === m.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              title="Profile & Settings"
            >
              <User className="w-4 h-4" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 animate-in fade-in-50 zoom-in-95 text-xs text-slate-700">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="font-semibold text-slate-900 truncate">
                    {userEmail || "Guest Citizen"}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {userEmail ? "Active User" : "Unsaved Session"}
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profile & Settings</span>
                </Link>

                <Link
                  href="/reports"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                  <span>Saved Reports</span>
                </Link>

                {onOpenSystemStatus && (
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenSystemStatus();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>System Status</span>
                  </button>
                )}

                <div className="border-t border-slate-100 my-1"></div>

                {userEmail ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-emerald-700 flex items-center gap-2 font-medium"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In / Register</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-md">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-sm font-medium ${
              pathname === "/" ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            Home
          </Link>
          <Link
            href="/analyze"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-sm font-medium ${
              pathname === "/analyze" || pathname.startsWith("/decision") ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            Analyze
          </Link>
          <Link
            href="/reports"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-sm font-medium ${
              pathname === "/reports" ? "bg-emerald-50 text-emerald-800 font-semibold" : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            Reports
          </Link>
          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Profile & Settings
          </Link>
        </div>
      )}
    </header>
  );
}
