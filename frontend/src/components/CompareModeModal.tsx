"use client";

import { useState } from "react";
import { X, Scale, FileText, CheckCircle2, XCircle, AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";

interface CompareModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "ip_regimes" | "ayush_fssai" | "biodiversity";

export default function CompareModeModal({ isOpen, onClose }: CompareModeModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("ip_regimes");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 via-emerald-950 to-green-950 text-white p-5 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Scale className="w-6 h-6 text-green-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">AYURLEX Statutory Compare Mode</h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-400/30">
                  Multivariate Analysis
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                Side-by-side comparative matrices across Indian IP statutes and regulatory frameworks.
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

        {/* Tab Navigation */}
        <div className="bg-gray-100 border-b border-gray-200 px-5 flex gap-2 shrink-0 pt-2">
          <button
            onClick={() => setActiveTab("ip_regimes")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-t border-x ${
              activeTab === "ip_regimes"
                ? "bg-white text-green-900 border-gray-200 shadow-2xs"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
            }`}
          >
            ⚖️ Patent vs Trademark vs GI
          </button>
          <button
            onClick={() => setActiveTab("ayush_fssai")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-t border-x ${
              activeTab === "ayush_fssai"
                ? "bg-white text-green-900 border-gray-200 shadow-2xs"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
            }`}
          >
            🌿 Classical Drug (AYUSH) vs Ayurveda Aahara (FSSAI)
          </button>
          <button
            onClick={() => setActiveTab("biodiversity")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-t border-x ${
              activeTab === "biodiversity"
                ? "bg-white text-green-900 border-gray-200 shadow-2xs"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
            }`}
          >
            🧬 BDA Form III vs 2023 AYUSH Practitioner Relief
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: IP Regimes Comparison */}
          {activeTab === "ip_regimes" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Strategic IP Guidance:</span> Classical recipes (e.g. Triphala) cannot be patented (Sec 3p) or monopolized as trademarks (Sec 9). Protection must be achieved through proprietary extraction technology (Patents), brand distinctiveness (Trademarks), or regional terroir (GI).
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase font-mono text-[11px]">
                      <th className="p-3 border-r border-gray-200 w-1/4">Statutory Feature</th>
                      <th className="p-3 border-r border-gray-200 w-1/4 bg-amber-50/50 text-amber-950 font-bold">
                        Patents Act, 1970
                      </th>
                      <th className="p-3 border-r border-gray-200 w-1/4 bg-blue-50/50 text-blue-950 font-bold">
                        Trade Marks Act, 1999
                      </th>
                      <th className="p-3 w-1/4 bg-emerald-50/50 text-emerald-950 font-bold">
                        GI of Goods Act, 1999
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    <tr>
                      <td className="p-3 font-semibold bg-gray-50/40">Protected Subject Matter</td>
                      <td className="p-3">Novel synergistic formulations, standardized extracts, phytopharmaceuticals</td>
                      <td className="p-3">Brand names, logos, distinctive packaging dress (Class 5, 3, 30)</td>
                      <td className="p-3">Medicinal agricultural cultivars tied to bounded geography (e.g. Kashmir Saffron)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-gray-50/40">Classical Medicine Bar</td>
                      <td className="p-3">
                        <span className="font-bold text-red-700">Section 3(p) & 3(e)</span>: Complete statutory exclusion of traditional formulations and admixtures
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-red-700">Section 9 & 13</span>: Sanskrit botanical names (Ashwagandha) and AFI recipes cannot be registered
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-red-700">Section 9(a)</span>: Generic Ayurvedic formulations practiced pan-India are barred
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-gray-50/40">Exclusivity Term</td>
                      <td className="p-3 font-mono">20 Years from filing date</td>
                      <td className="p-3 font-mono">10 Years (Indefinitely renewable)</td>
                      <td className="p-3 font-mono">10 Years (Collective right, renewable)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-gray-50/40">Mandatory NBA Approval</td>
                      <td className="p-3 font-bold text-red-800">
                        Yes: Mandatory under Section 6 before grant
                      </td>
                      <td className="p-3 text-gray-500">Not Applicable</td>
                      <td className="p-3 text-gray-500">SBB Intimation / Excluded for farmers</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-gray-50/40">Commercial Monetization</td>
                      <td className="p-3">Exclusive licensing, patent monopoly, pharma partnerships</td>
                      <td className="p-3">Brand equity, consumer trust, franchise licensing</td>
                      <td className="p-3">Premium export pricing, collective farmer association protection</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: AYUSH Drug vs Ayurveda Aahara */}
          {activeTab === "ayush_fssai" && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Statutory Claim Demarcation:</span> Advertising an Ayurveda Aahara food product to cure disease (e.g. diabetes or arthritis) is a direct statutory violation of Regulation 6 and attracts penal action under Section 53 of the Food Safety & Standards Act.
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase font-mono text-[11px]">
                      <th className="p-3 border-r border-gray-200 w-1/3">Regulatory Dimension</th>
                      <th className="p-3 border-r border-gray-200 w-1/3 bg-emerald-50 text-emerald-950 font-bold">
                        Classical ASU Medicine (AYUSH)
                      </th>
                      <th className="p-3 w-1/3 bg-orange-50 text-orange-950 font-bold">
                        Ayurveda Aahara (FSSAI 2022)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    <tr>
                      <td className="p-3 font-semibold bg-gray-50/40">Governing Statute</td>
                      <td className="p-3 font-semibold text-emerald-900">Drugs and Cosmetics Act, 1940 & Rules, 1945</td>
                      <td className="p-3 font-semibold text-orange-900">Food Safety and Standards Act, 2006 & Regs 2022</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-gray-50/40">Licensing Authority</td>
                      <td className="p-3">State Licensing Authority (SLA - AYUSH)</td>
                      <td className="p-3">State Food Safety Commissioner (FSSAI)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-gray-50/40">Permitted Claims</td>
                      <td className="p-3">
                        <span className="text-emerald-700 font-bold">Therapeutic indications</span>: Treatment of specific diseases (Vyadhi) as documented in Schedule 1 texts
                      </td>
                      <td className="p-3">
                        <span className="text-orange-700 font-bold">Wellness & Agni Deepana</span>: General health, dosha balance, rejuvenation. Zero disease cure claims permitted.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-gray-50/40">Mandatory Packaging Mark</td>
                      <td className="p-3">Manufacturing License No., Schedule E(1) Caution if applicable</td>
                      <td className="p-3 font-bold text-orange-800">
                        Official Green Ayur-A Logo + Mandatory Front-of-Pack Non-Medicine Disclaimer
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-gray-50/40">Manufacturing GMP</td>
                      <td className="p-3 font-mono">Schedule T GMP (1200 sq. ft., QC lab, heavy metals, microbial)</td>
                      <td className="p-3 font-mono">Schedule 4 GMP (Sanitary and hygiene requirements for food units)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-gray-50/40">Distribution Channels</td>
                      <td className="p-3">Licensed Ayurvedic pharmacies, Vaidya clinics, healthcare dispensaries</td>
                      <td className="p-3">Supermarkets, grocery stores, food e-commerce platforms</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BDA Form III vs 2023 Amendments */}
          {activeTab === "biodiversity" && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Historic Decriminalization:</span> The Biological Diversity (Amendment) Act, 2023 replaced imprisonment with civil penalties, while officially recognizing registered AYUSH vaidyas as exempt custodians of traditional medicine.
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase font-mono text-[11px]">
                      <th className="p-3 border-r border-gray-200 w-1/3">Statutory Mechanism</th>
                      <th className="p-3 border-r border-gray-200 w-1/3 bg-gray-50 font-bold">
                        Biological Diversity Act, 2002
                      </th>
                      <th className="p-3 w-1/3 bg-emerald-50 text-emerald-950 font-bold">
                        2023 Amendment Act Relief
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    <tr>
                      <td className="p-3 font-semibold bg-gray-50/40">AYUSH Practitioner Status</td>
                      <td className="p-3 text-red-700">Ambiguous; State Boards (SBB) issued notices for commercial utilization</td>
                      <td className="p-3 font-bold text-emerald-800">
                        Section 7 Exemption: Registered AYUSH practitioners completely exempt from prior intimation
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-gray-50/40">Patent Applications (Section 6)</td>
                      <td className="p-3">Prior NBA approval required before filing patent application</td>
                      <td className="p-3 font-bold text-blue-800">
                        Streamlined: Approval may be obtained anytime before the actual grant/sealing of the patent
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-gray-50/40">Cultivated Medicinal Herbs</td>
                      <td className="p-3">Treated on par with wild forest biological resources</td>
                      <td className="p-3 font-bold text-emerald-800">
                        Exempt from ABS: Cultivated medicinal plants exempt upon maintaining certificate of origin
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-gray-50/40">Penalties for Violation</td>
                      <td className="p-3 text-red-700 font-semibold">
                        Imprisonment up to 5 years + non-bailable criminal offense
                      </td>
                      <td className="p-3 font-bold text-emerald-900">
                        Decriminalized: Imprisonment repealed; replaced with civil penalties (₹1 Lakh to ₹50 Lakhs)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold bg-gray-50/40">ABS Sharing Matrix</td>
                      <td className="p-3 font-mono">0.1% to 0.5% ex-factory sales</td>
                      <td className="p-3 font-mono">Retained under 2014 Regulations, channeled to local Biodiversity Committees</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-gray-500 font-mono text-[11px]">
            Statutory Sources: The Patents Act 1970 · FSSAI Regs 2022 · BDA 2023 · D&C Act 1940
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
