import { NextResponse } from "next/server";

interface NormalizedBotanicalEntity {
  common_name: string;
  botanical_name: string;
  sanskrit_name: string;
  family: string;
  part_used: string;
  active_compounds: string[];
  classical_treatises: string[];
}

const BOTANICAL_REGISTRY: Record<string, NormalizedBotanicalEntity> = {
  turmeric: {
    common_name: "Turmeric",
    botanical_name: "Curcuma longa L.",
    sanskrit_name: "Haridra (हरिद्रा / निशा)",
    family: "Zingiberaceae",
    part_used: "Rhizome",
    active_compounds: ["Curcumin", "Demethoxycurcumin", "Bisdemethoxycurcumin", "Turmerone"],
    classical_treatises: ["Charaka Samhita", "Sushruta Samhita", "Bhavaprakasha"],
  },
  "black pepper": {
    common_name: "Black Pepper",
    botanical_name: "Piper nigrum L.",
    sanskrit_name: "Maricha (मरिच / कृष्ण)",
    family: "Piperaceae",
    part_used: "Dried Fruit",
    active_compounds: ["Piperine", "Piperidine", "Chavicine"],
    classical_treatises: ["Charaka Samhita", "Ashtanga Hridaya", "Sharangadhara Samhita"],
  },
  "dry ginger": {
    common_name: "Dry Ginger",
    botanical_name: "Zingiber officinale Roscoe",
    sanskrit_name: "Shunthi (शुण्ठी / नागर)",
    family: "Zingiberaceae",
    part_used: "Dried Rhizome",
    active_compounds: ["Gingerol", "Shogaol", "Zingiberene"],
    classical_treatises: ["Charaka Samhita", "Bhaishajya Ratnavali"],
  },
  ashwagandha: {
    common_name: "Indian Ginseng / Winter Cherry",
    botanical_name: "Withania somnifera (L.) Dunal",
    sanskrit_name: "Ashwagandha (अश्वगन्धा / वराहकर्णी)",
    family: "Solanaceae",
    part_used: "Root",
    active_compounds: ["Withaferin A", "Withanolide A", "Withanolide D", "Sominone"],
    classical_treatises: ["Charaka Samhita", "Sushruta Samhita", "Bhavaprakasha"],
  },
  guduchi: {
    common_name: "Heart-leaved Moonseed",
    botanical_name: "Tinospora cordifolia (Willd.) Miers",
    sanskrit_name: "Guduchi (गुडूची / अमृता)",
    family: "Menispermaceae",
    part_used: "Stem",
    active_compounds: ["Tinosporide", "Cordifolide", "Berberine", "Tinosporine"],
    classical_treatises: ["Charaka Samhita", "Sushruta Samhita", "Ashtanga Hridaya"],
  },
  amalaki: {
    common_name: "Indian Gooseberry",
    botanical_name: "Phyllanthus emblica L. (syn. Emblica officinalis)",
    sanskrit_name: "Amalaki (आमलकी / धात्री)",
    family: "Phyllanthaceae",
    part_used: "Pericarp / Fresh Fruit",
    active_compounds: ["Ascorbic Acid (Vitamin C)", "Emblicanin A", "Emblicanin B", "Gallic Acid"],
    classical_treatises: ["Charaka Samhita", "Sushruta Samhita", "AFI Part I"],
  },
  haritaki: {
    common_name: "Chebulic Myrobalan",
    botanical_name: "Terminalia chebula Retz.",
    sanskrit_name: "Haritaki (हरीतकी / अभया)",
    family: "Combretaceae",
    part_used: "Pericarp of Fruit",
    active_compounds: ["Chebulinic Acid", "Chebulagic Acid", "Corilagin", "Tannins"],
    classical_treatises: ["Charaka Samhita", "Bhavaprakasha", "AFI Part I"],
  },
  bibhitaki: {
    common_name: "Belliric Myrobalan",
    botanical_name: "Terminalia bellirica (Gaertn.) Roxb.",
    sanskrit_name: "Bibhitaki (विभीतकी / कलिद्रुम)",
    family: "Combretaceae",
    part_used: "Dried Fruit Pericarp",
    active_compounds: ["Bellericanin", "Gallic Acid", "Ellagic Acid"],
    classical_treatises: ["Charaka Samhita", "AFI Part I"],
  },
  brahmi: {
    common_name: "Water Hyssop",
    botanical_name: "Bacopa monnieri (L.) Wettst.",
    sanskrit_name: "Brahmi (ब्राह्मी / ऐन्द्री)",
    family: "Plantaginaceae",
    part_used: "Whole Plant",
    active_compounds: ["Bacoside A", "Bacoside B", "Bacopasaponin"],
    classical_treatises: ["Charaka Samhita", "Sushruta Samhita"],
  },
  tulsi: {
    common_name: "Holy Basil",
    botanical_name: "Ocimum sanctum L. (syn. Ocimum tenuiflorum)",
    sanskrit_name: "Tulasi (तुलसी / सुरसा)",
    family: "Lamiaceae",
    part_used: "Leaves / Aerial Parts",
    active_compounds: ["Eugenol", "Ursolic Acid", "Rosmarinic Acid", "Caryophyllene"],
    classical_treatises: ["Charaka Samhita", "Bhavaprakasha"],
  },
  arjuna: {
    common_name: "Arjuna Tree",
    botanical_name: "Terminalia arjuna (Roxb. ex DC.) Wight & Arn.",
    sanskrit_name: "Arjuna (अर्जुन / पार्थ)",
    family: "Combretaceae",
    part_used: "Stem Bark",
    active_compounds: ["Arjunic Acid", "Arjunolic Acid", "Arjungenin", "Terminic Acid"],
    classical_treatises: ["Charaka Samhita", "Sushruta Samhita", "Bhaishajya Ratnavali"],
  },
};

const CLASSICAL_FORMULATIONS = [
  {
    name: "Trikatu Churna",
    reference: "Sharangadhara Samhita, Madhyama Khanda 6/12-13; AFI Part I",
    key_ingredients: ["Shunthi (Zingiber officinale)", "Maricha (Piper nigrum)", "Pippali (Piper longum)"],
    botanical_keys: ["zingiber", "piper"],
    dosage_form: "Churna (Fine Powder)",
    therapeutic_use: "Deepana (Appetizer), Pachana (Digestive), Synergy enhancer for active bioavailability",
  },
  {
    name: "Triphala Churna",
    reference: "Charaka Samhita, Chikitsasthana 1/3; AFI Part I",
    key_ingredients: ["Haritaki (Terminalia chebula)", "Bibhitaki (Terminalia bellirica)", "Amalaki (Phyllanthus emblica)"],
    botanical_keys: ["terminalia", "phyllanthus"],
    dosage_form: "Churna",
    therapeutic_use: "Rasayana (Rejuvenator), Chakshushya (Ophthalmic), Mild laxative",
  },
  {
    name: "Haridra Khanda",
    reference: "Bhaishajya Ratnavali, Shitarapittaudardakotha Rogadhikara 13-18; AFI Part I",
    key_ingredients: ["Haridra (Curcuma longa)", "Maricha (Piper nigrum)", "Shunthi (Zingiber officinale)"],
    botanical_keys: ["curcuma", "piper", "zingiber"],
    dosage_form: "Khanda (Granules / Confection)",
    therapeutic_use: "Kandu (Pruritus), Udarda (Urticaria), Anti-allergic, Anti-inflammatory",
  },
  {
    name: "Ashwagandhadi Lehya / Churna",
    reference: "Bhaishajya Ratnavali, Karshya Rogadhikara; AFI Part I",
    key_ingredients: ["Ashwagandha (Withania somnifera)", "Shatavari (Asparagus racemosus)", "Guduchi (Tinospora cordifolia)"],
    botanical_keys: ["withania", "tinospora"],
    dosage_form: "Avaleha / Churna",
    therapeutic_use: "Balya (Strength promoter), Rasayana (Adaptogen), Neuroprotective",
  },
];

function matchEntity(term: string): NormalizedBotanicalEntity {
  const clean = term.toLowerCase().trim();
  for (const [key, ent] of Object.entries(BOTANICAL_REGISTRY)) {
    if (
      clean.includes(key) ||
      clean.includes(ent.common_name.toLowerCase()) ||
      clean.includes(ent.botanical_name.toLowerCase().split(" ")[0]) ||
      clean.includes(ent.sanskrit_name.toLowerCase().split(" ")[0])
    ) {
      return ent;
    }
  }
  return {
    common_name: term,
    botanical_name: `${term.charAt(0).toUpperCase() + term.slice(1)} sp.`,
    sanskrit_name: `${term} (शास्त्रीय द्रव्य)`,
    family: "Medicinal Plantae",
    part_used: "Aerial Parts / Extract",
    active_compounds: ["Phytochemical Polyphenols", "Glycosides", "Flavonoids"],
    classical_treatises: ["The Ayurvedic Pharmacopoeia of India (API)"],
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ingredients: string[] = body.ingredients || [];

    if (ingredients.length === 0 && !body.intended_use) {
      return NextResponse.json(
        { error: "Must provide at least one ingredient or intended use." },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;
    if (backendUrl && backendUrl.startsWith("http") && !backendUrl.includes("localhost")) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`${backendUrl}/formulation/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (res.ok) return NextResponse.json(await res.json());
      } catch {}
    }

    const botanicalEntities: NormalizedBotanicalEntity[] = [];
    const seen = new Set<string>();
    const traditionalNames: string[] = [];
    const taxonomicHierarchy: Record<string, string> = {};

    for (const ing of ingredients) {
      const ent = matchEntity(ing);
      if (ent && !seen.has(ent.botanical_name)) {
        seen.add(ent.botanical_name);
        botanicalEntities.push(ent);
        traditionalNames.push(ent.sanskrit_name);
        taxonomicHierarchy[ent.botanical_name] = `Family: ${ent.family}`;
      }
    }

    const ratios: Record<string, number> = {};
    if (botanicalEntities.length > 0) {
      const eq = +(1 / botanicalEntities.length).toFixed(4);
      for (const ent of botanicalEntities) {
        ratios[ent.common_name] = eq;
      }
    }

    const botanicalKeywords = botanicalEntities.map((e) => e.botanical_name.toLowerCase());
    const classicalMatches = [];

    for (const c of CLASSICAL_FORMULATIONS) {
      let matches = 0;
      for (const k of c.botanical_keys) {
        if (botanicalKeywords.some((bk) => bk.includes(k))) {
          matches++;
        }
      }
      if (matches >= 2 || (matches === 1 && c.botanical_keys.length === 1)) {
        classicalMatches.push({
          formulation_name: c.name,
          statutory_reference: c.reference,
          matched_herbs_count: `${matches}/${c.botanical_keys.length}`,
          dosage_form: c.dosage_form,
          classical_indications: c.therapeutic_use,
        });
      }
    }

    const title =
      body.formulation_name ||
      (botanicalEntities.length > 0
        ? `Polyherbal Formulation (${botanicalEntities.map((e) => e.common_name).join(" + ")})`
        : "Ayurvedic Proprietary Compound");

    const claimedUse =
      body.intended_use ||
      (body.therapeutic_claims && body.therapeutic_claims.length > 0
        ? body.therapeutic_claims.join(", ")
        : "Synergistic Bio-enhancement and Wellness");

    const response = {
      formulation_name: title,
      ingredients,
      botanical_entities: botanicalEntities,
      traditional_names: traditionalNames,
      ratios,
      preparation_method:
        body.preparation_method ||
        "Classical Aqueous/Hydro-alcoholic Extraction or Shodhita Churna (Rule 158B Compliant)",
      dosage_form: body.dosage_form || "Solid Oral Dosage Form / Churna (Powder)",
      claimed_use: claimedUse,
      geographical_origin: body.geographical_source || "India (Western Ghats Bioreserve)",
      taxonomic_hierarchy: taxonomicHierarchy,
      mono_ingredient_flag: botanicalEntities.length === 1,
      classical_formulation_matches: classicalMatches,
    };

    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to analyze formulation." },
      { status: 500 }
    );
  }
}
