/**
 * frontend/src/lib/domainGuard.ts
 * ───────────────────────────────
 * AYURLEX Strict Domain Boundary Validator.
 *
 * Enforces the logical pipeline rule:
 * USER QUERY -> DOMAIN VALIDATION -> JURISDICTION VALIDATION -> RETRIEVAL ...
 *
 * Rejects arbitrary non-IP, named-person, trivia, entertainment, daily-life,
 * and out-of-scope inquiries before any decision engine or educational fallback runs.
 */

export interface DomainValidationResult {
  isDomainValid: boolean;
  reasonCode: "IN_DOMAIN" | "OUT_OF_DOMAIN" | "NAMED_PERSON_QUERY" | "GENERAL_TRIVIA";
  explanation: string;
}

// ── Explicit Out-of-Domain Blocklist Patterns ──────────────────────────────────
const OUT_OF_DOMAIN_PATTERNS: Array<{ regex: RegExp; code: "NAMED_PERSON_QUERY" | "GENERAL_TRIVIA" | "OUT_OF_DOMAIN"; label: string }> = [
  // 1. Named Persons, Celebrities, Athletes, Politicians
  {
    regex: /\b(ms\s+dhoni|dhoni|virat\s+kohli|kohli|sachin\s+tendulkar|tendulkar|rohit\s+sharma|elon\s+musk|narendra\s+modi|donald\s+trump|amit\s+shah|rahul\s+gandhi|cristiano\s+ronaldo|lionel\s+messi|shah\s*rukh\s*khan|salman\s*khan)\b/i,
    code: "NAMED_PERSON_QUERY",
    label: "Named person query",
  },
  {
    regex: /\b(who\s+is\s+(the\s+)?(prime\s+minister|pm|president|chief\s+minister|cm|governor|actor|actress|singer|cricketer|captain))\b/i,
    code: "NAMED_PERSON_QUERY",
    label: "Public figure inquiry",
  },
  {
    regex: /\b(who\s+is\s+[a-z]{3,}\b(?!\s+(a\s+)?(patent|trademark|examiner|inventor|phosita|controller)))/i,
    code: "NAMED_PERSON_QUERY",
    label: "Generic person inquiry",
  },
  {
    regex: /\b(where\s+was\s+[a-z\s]+born|birthplace\s+of|date\s+of\s+birth\s+of|age\s+of)\b/i,
    code: "NAMED_PERSON_QUERY",
    label: "Biographical inquiry",
  },

  // 2. General Trivia, Geography, Weather, Sports
  {
    regex: /\b(capital\s+of|tallest\s+mountain|highest\s+peak|longest\s+river|population\s+of|currency\s+of)\b/i,
    code: "GENERAL_TRIVIA",
    label: "Geographical / demographic trivia",
  },
  {
    regex: /\b(today('?s)?\s+(weather|temperature|forecast|climate)|weather\s+in|rain\s+forecast)\b/i,
    code: "GENERAL_TRIVIA",
    label: "Weather query",
  },
  {
    regex: /\b(cricket\s+score|match\s+score|ipl\s+score|who\s+won\s+the\s+match|who\s+won\s+the\s+world\s+cup|football\s+score)\b/i,
    code: "GENERAL_TRIVIA",
    label: "Sports / entertainment query",
  },

  // 3. Unrelated Practical Daily Life / Automotive / Cooking / Non-IP Licensing / Finance
  {
    regex: /\b(cook\s+biryani|cooking\s+biryani|recipe\s+for\s+biryani|how\s+to\s+cook|recipe\s+for|best\s+biryani)\b/i,
    code: "OUT_OF_DOMAIN",
    label: "Cooking / recipe query",
  },
  {
    regex: /\b(repair\s+a\s+car|car\s+repair|fix\s+a\s+car|car\s+engine|engine\s+oil|puncture\s+repair|bike\s+repair)\b/i,
    code: "OUT_OF_DOMAIN",
    label: "Automotive repair query",
  },
  {
    regex: /\b(driving\s+license|driver('?s)?\s+license|pilot\s+license|learner('?s)?\s+license|rto\s+driving|traffic\s+fine)\b/i,
    code: "OUT_OF_DOMAIN",
    label: "Vehicle / driving license query",
  },
  {
    regex: /\b(bitcoin|cryptocurrency|crypto\s+price|crypto\s+wallet|ethereum|dogecoin|stock\s+price|share\s+market|sensex|nifty)\b/i,
    code: "OUT_OF_DOMAIN",
    label: "Cryptocurrency / stock market query",
  },
  {
    regex: /\b(income\s+tax|gst\s+rates?|gst\s+return|tax\s+filing|pan\s+card|aadhar\s+card|passport\s+renewal|train\s+ticket|flight\s+booking|divorce\s+procedure|divorce\s+in\s+india|voting\s+age|legal\s+age\s+for\s+voting)\b/i,
    code: "OUT_OF_DOMAIN",
    label: "Unrelated civil / tax / governance query",
  },
  {
    regex: /\b(cricket\s+act|movie\s+act|theater\s+act|car\s+insurance|bike\s+insurance)\b/i,
    code: "OUT_OF_DOMAIN",
    label: "Adversarial keyword mismatch",
  },
  {
    regex: /\b(latest\s+movie|new\s+movie|box\s+office|movie\s+review|cinema\s+show)\b/i,
    code: "OUT_OF_DOMAIN",
    label: "Movie / entertainment inquiry",
  },
];

// ── Explicit In-Domain Concept Matchers ─────────────────────────────────────────
const IN_DOMAIN_KEYWORDS = [
  // Core IP
  "patent", "patents", "patentability", "patentable", "prior art", "novelty", "inventive step",
  "non-obviousness", "freedom to operate", "fto", "infringe", "infringement", "provisional application",
  "complete specification", "patent claim", "patent claims", "patent office", "cgpdtm", "uspto", "jpo",
  "epo", "epc", "pct", "wipo", "patentscope", "third party observation", "pre-grant opposition", "post-grant opposition",

  // Trademarks
  "trademark", "trade mark", "trademarks", "trade marks", "nice class", "class 5", "class 3", "class 30",
  "class 32", "form tm-a", "trade marks act", "deceptive similarity", "coined mark", "arbitrary mark",

  // Other IP Regimes
  "copyright", "copyrights", "copyright act", "fair dealing", "literary work", "design registration",
  "designs act", "industrial design", "geographical indication", "geographical indications", "gi tag",
  "gi act", "plant variety", "ppvfr", "dus", "extant variety", "farmers' rights", "breeder",

  // Traditional Knowledge & Biodiversity
  "traditional knowledge", "tkdl", "traditional knowledge digital library", "biopiracy",
  "biological diversity", "biological resources", "nba chennai", "national biodiversity authority",
  "state biodiversity board", "access and benefit sharing", "abs",

  // Statutory Articles & Rules
  "section 3(p)", "section 3(e)", "section 3(d)", "section 3(a)", "section 3(b)", "section 3(c)",
  "section 3(h)", "section 3(i)", "section 3(j)", "section 10(4)", "section 13", "section 9",
  "section 28", "section 29", "section 48", "35 u.s.c", "section 101", "section 102", "section 103",
  "section 112", "epc article 54", "epc article 56", "pmd act", "circular 429", "dshea", "21 cfr",
  "rule 158b", "schedule t", "form 25d", "form 24d", "form iii", "itra act", "ncism act",

  // Ayurveda / AYUSH / ASU Medicine
  "ayurveda", "ayurvedic", "ayush", "asu", "siddha", "unani", "sowa-rigpa", "homeopathy",
  "classical formulation", "proprietary ayurvedic", "herbal formulation", "polyherbal", "churna",
  "taila", "ghrita", "bhasma", "asava", "arishta", "kwatha", "rasayana", "decoction",
  "charaka", "sushruta", "ashtanga", "bhavaprakasha", "sharangadhara", "bhaishajya",
  "ayurvedic pharmacopoeia", "api", "ayurvedic formulary", "afi",

  // Specific Ayurvedic Herbs & Phytochemicals
  "ashwagandha", "withania somnifera", "withanolide", "curcumin", "turmeric", "curcuma longa",
  "piperine", "black pepper", "triphala", "brahmi", "bacopa monnieri", "neem", "azadirachta indica",
  "tulsi", "ocimum sanctum", "amla", "emblica officinalis", "guduchi", "tinospora cordifolia",
  "shatavari", "guggulu", "shilajit", "arjuna", "haritaki", "bibhitaki",

  // Food / Health Authority & Regulatory
  "fssai", "ayurveda aahara", "food safety and standards", "schedule a", "asu drug", "asu medicine",
  "cdsco", "state licensing authority", "e-aushadhi", "heavy metal limit", "microbial limit",
  "certificate of analysis", "good manufacturing practice", "gmp",

  // Pedagogical Life-Science / AI Concepts
  "photosynthesis", "chloroplast", "secondary metabolite", "rag", "crag",
  "retrieval augmented generation", "corrective rag"
];

// ── Verified Standalone Pedagogical Concepts ───────────────────────────────────
const VERIFIED_PEDAGOGICAL_CONCEPTS = [
  "photosynthesis",
  "how does photosynthesis work",
  "what is photosynthesis",
  "what is a patent",
  "what is a trademark",
  "what is prior art",
  "what is novelty",
  "what is inventive step",
  "what is freedom to operate",
  "what is fto",
  "what is intellectual property",
  "what is rag",
  "what is crag",
  "what is retrieval augmented generation",
  "novelty vs inventive step",
  "difference between novelty and inventive step"
];

/**
 * Validates whether a user query belongs to the AYURLEX domain.
 */
export function validateDomain(rawQuery: string): DomainValidationResult {
  const query = (rawQuery || "").trim();
  if (!query) {
    return {
      isDomainValid: false,
      reasonCode: "OUT_OF_DOMAIN",
      explanation: "Empty query provided.",
    };
  }

  const qLower = query.toLowerCase();

  // 1. Check explicit out-of-domain blocklist patterns first
  for (const block of OUT_OF_DOMAIN_PATTERNS) {
    if (block.regex.test(qLower)) {
      return {
        isDomainValid: false,
        reasonCode: block.code,
        explanation: `Insufficient data. This question is outside the scope of the available Intellectual Property, Ayurveda, and regulatory sources (${block.label}).`,
      };
    }
  }

  // 2. Check verified standalone pedagogical concepts
  for (const concept of VERIFIED_PEDAGOGICAL_CONCEPTS) {
    if (qLower === concept || qLower === `${concept}?` || qLower.startsWith(`${concept} `)) {
      return {
        isDomainValid: true,
        reasonCode: "IN_DOMAIN",
        explanation: "Verified pedagogical life-science / IP concept.",
      };
    }
  }

  // 3. Check for presence of genuine in-domain keywords
  const hasInDomainKeyword = IN_DOMAIN_KEYWORDS.some((kw) => {
    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
    return regex.test(qLower);
  });

  if (hasInDomainKeyword) {
    return {
      isDomainValid: true,
      reasonCode: "IN_DOMAIN",
      explanation: "Matched verified IP, Ayurveda, or regulatory terminology.",
    };
  }

  // 4. Reject queries with generic words lacking in-domain context
  // e.g. "what is the driving license process?", "what is a cricket act?", "what is the capital of india?"
  return {
    isDomainValid: false,
    reasonCode: "OUT_OF_DOMAIN",
    explanation: "Insufficient data. This question is outside the scope of the available Intellectual Property, Ayurveda, and regulatory sources.",
  };
}
