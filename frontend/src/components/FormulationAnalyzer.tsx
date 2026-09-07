"use client";

import React, { useState } from "react";
import { PlusCircleFill, Trash3Fill, ArrowRepeat, Search, Flower1, CheckCircleFill, BookHalf } from "react-bootstrap-icons";
import { FormulationAnalysisResponse } from "@/types";
import { analyzeFormulation } from "@/lib/api";

interface Props {
  onAnalyzed?: (res: FormulationAnalysisResponse) => void;
}

const COMMON_HERBS = [
  "Turmeric (Curcuma longa)",
  "Black Pepper (Piper nigrum)",
  "Dry Ginger (Zingiber officinale)",
  "Ashwagandha (Withania somnifera)",
  "Guduchi (Tinospora cordifolia)",
  "Amalaki (Phyllanthus emblica)",
  "Haritaki (Terminalia chebula)",
  "Brahmi (Bacopa monnieri)",
  "Tulsi (Ocimum sanctum)",
  "Arjuna (Terminalia arjuna)",
];

export default function FormulationAnalyzer({ onAnalyzed }: Props) {
  const [formulationName, setFormulationName] = useState("");
  const [ingredients, setIngredients] = useState<string[]>(["Turmeric", "Black Pepper"]);
  const [newIngredient, setNewIngredient] = useState("");
  const [dosageForm, setDosageForm] = useState("Churna (Powder)");
  const [preparationMethod, setPreparationMethod] = useState("Standard Classical Preparation");
  const [intendedUse, setIntendedUse] = useState("Synergistic anti-inflammatory & bio-enhancement");
  const [geographicalSource, setGeographicalSource] = useState("India (Western Ghats)");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FormulationAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addIngredient = (name: string) => {
    const clean = name.trim();
    if (clean && !ingredients.includes(clean)) {
      setIngredients([...ingredients, clean]);
      setNewIngredient("");
    }
  };

  const removeIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await analyzeFormulation({
        formulation_name: formulationName || undefined,
        ingredients,
        dosage_form: dosageForm,
        preparation_method: preparationMethod,
        intended_use: intendedUse,
        geographical_source: geographicalSource,
      });
      setResult(res);
      if (onAnalyzed) onAnalyzed(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze formulation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 text-left">
      {/* Input Workbench Form */}
      <form onSubmit={handleRunAnalysis} className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-5">
        <div className="border-b border-zinc-800 pb-4">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Flower1 className="w-5 h-5 text-white" />
            <span>Ayurvedic Formulation & Taxonomic Workbench</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Extract botanical binomials, Sanskrit classical entities, ingredient ratios, and AFI formulation correlations
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Basic Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Formulation Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Polyherbal Bio-Enhancer Compound"
              value={formulationName}
              onChange={(e) => setFormulationName(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Dosage Form
            </label>
            <select
              value={dosageForm}
              onChange={(e) => setDosageForm(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
            >
              <option value="Churna (Powder)">Churna (Powder)</option>
              <option value="Vati / Gutika (Tablet)">Vati / Gutika (Tablet)</option>
              <option value="Avaleha (Paste / Confection)">Avaleha (Paste / Confection)</option>
              <option value="Asava / Arishta (Fermented Liquid)">Asava / Arishta (Fermented Liquid)</option>
              <option value="Taila / Ghrita (Medicated Oil/Ghee)">Taila / Ghrita (Medicated Oil/Ghee)</option>
              <option value="Hydro-Alcoholic Standardized Extract">Hydro-Alcoholic Standardized Extract</option>
              <option value="Capsule / Novel Delivery Matrix">Capsule / Novel Delivery Matrix</option>
            </select>
          </div>
        </div>

        {/* Ingredients Builder */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 block">
            Formulation Ingredients ({ingredients.length} Added)
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add herb / mineral name (e.g. Turmeric, Ashwagandha, Haritaki)"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addIngredient(newIngredient);
                }
              }}
              className="flex-1 bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
            />
            <button
              type="button"
              onClick={() => addIngredient(newIngredient)}
              className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
            >
              <PlusCircleFill className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Quick-add chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-zinc-500 self-center mr-1">Quick Select:</span>
            {COMMON_HERBS.map((herb) => {
              const baseName = herb.split(" ")[0];
              return (
                <button
                  key={herb}
                  type="button"
                  onClick={() => addIngredient(baseName)}
                  className="px-2 py-0.5 rounded-lg bg-zinc-900 hover:bg-slate-700 text-[10px] text-zinc-300 border border-zinc-700 transition-colors"
                >
                  + {baseName}
                </button>
              );
            })}
          </div>

          {/* Active Ingredients List */}
          <div className="flex flex-wrap gap-2 pt-2">
            {ingredients.map((ing, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs rounded-xl font-medium"
              >
                <span>{ing}</span>
                <button
                  type="button"
                  onClick={() => removeIngredient(idx)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash3Fill className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Intended Use & Geographical Origin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Therapeutic Claims / Intended Use
            </label>
            <input
              type="text"
              value={intendedUse}
              onChange={(e) => setIntendedUse(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Geographical Source (Biodiversity Origin)
            </label>
            <input
              type="text"
              value={geographicalSource}
              onChange={(e) => setGeographicalSource(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <ArrowRepeat className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Analyze Formulation & Ratios</span>
          </button>
        </div>
      </form>

      {/* Analysis Results Display */}
      {result && (
        <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircleFill className="w-4 h-4 text-white" />
                <span>{result.formulation_name}</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Dosage Form: {result.dosage_form} · Origin: {result.geographical_origin}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-lg">
              {result.botanical_entities.length} Normalized Botanical Entities
            </span>
          </div>

          {/* Botanical Entities Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Normalized Botanical Entities & Active Compounds
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.botanical_entities.map((bot, idx) => (
                <div
                  key={idx}
                  className="bg-black/80 border border-zinc-800 rounded-xl p-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{bot.common_name}</span>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/50">
                      {bot.family || "Botanical"}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-white">
                    {bot.botanical_name}
                  </div>

                  <div className="text-[11px] text-amber-300 font-serif">
                    Sanskrit: {bot.sanskrit_name}
                  </div>

                  <div className="text-[10px] text-zinc-400 pt-1 border-t border-zinc-800 space-y-1">
                    <div>
                      <strong className="text-zinc-300">Part Used:</strong> {bot.part_used || "Whole Herb"}
                    </div>
                    {bot.active_compounds && bot.active_compounds.length > 0 && (
                      <div>
                        <strong className="text-zinc-300">Marker Phytochemicals:</strong>{" "}
                        {bot.active_compounds.join(", ")}
                      </div>
                    )}
                    {bot.classical_treatises && bot.classical_treatises.length > 0 && (
                      <div>
                        <strong className="text-zinc-300">Classical Samhitas:</strong>{" "}
                        {bot.classical_treatises.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Classical Formulation Correlation */}
          {result.classical_formulation_matches && result.classical_formulation_matches.length > 0 && (
            <div className="bg-purple-950/20 border border-purple-800/40 rounded-xl p-4 text-xs space-y-3">
              <h4 className="font-bold text-purple-200 flex items-center gap-2">
                <BookHalf className="w-4 h-4 text-purple-400" />
                <span>Correlated Classical Formulations (Ayurvedic Formulary of India)</span>
              </h4>

              <div className="space-y-2">
                {result.classical_formulation_matches.map((cfm, idx) => (
                  <div key={idx} className="bg-black/30 p-3 rounded-lg border border-purple-900/40">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{cfm.formulation_name}</span>
                      <span className="text-[10px] font-mono text-purple-300">
                        Matches {cfm.matched_herbs_count} Key Herbs
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-200/80 mt-1 font-mono">{cfm.statutory_reference}</p>
                    <p className="text-[11px] text-zinc-300 mt-1">
                      <strong>Classical Indications:</strong> {cfm.classical_indications}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
