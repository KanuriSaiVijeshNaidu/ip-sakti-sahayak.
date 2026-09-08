import { DomainType } from "@/types";

export interface TranslationSchema {
  title: string;
  subtitle: string;
  tagline: string;
  welcomeDesc: string;
  inputPlaceholder: string;
  legalDisclaimer: string;
  domains: Record<DomainType | "auto", string>;
  referredSources: string;
  viewQuoted: string;
  hideQuoted: string;
  sourceDoc: string;
  genTime: string;
  searchingCorpus: string;
  suggestions: { emoji: string; text: string }[];
  jurisdictionSuggestions: Record<string, { emoji: string; text: string }[]>;
  nav: {
    home: string;
    history: string;
    formulations: string;
    patentability: string;
    tkRisk: string;
    compare: string;
    signIn: string;
    profile: string;
    signOut: string;
    selectLanguage: string;
    changeMarket: string;
    specializedEngines: string;
    activeMarket: string;
    chatWorkspace: string;
    consultationHistory: string;
  };
  citations: {
    sourcesReferenced: string;
    matchScore: string;
    passageUnavailable: string;
    source: string;
    viewOriginalSource: string;
    originalSourceModalTitle: string;
    authenticText: string;
    close: string;
    sha256Proof: string;
    ledgerReceipt: string;
    consensusValidator: string;
    block: string;
    zeroHallucination: string;
    hideLedger: string;
    viewProof: string;
    copyHash: string;
    copied: string;
  };
  locationPage: {
    title: string;
    subtitle: string;
    currentActiveMarket: string;
    selectPrompt: string;
    setActiveButton: string;
    activeBadge: string;
    backToChat: string;
    strictIsolation: string;
    markets: Record<
      string,
      {
        country: string;
        authority: string;
        tagline: string;
        isolationNotice: string;
        statutes: string[];
      }
    >;
  };
  chat: {
    newChat: string;
    clearChat: string;
    emptyWelcome: string;
    emptySub: string;
    send: string;
    thinking: string;
    errorGeneric: string;
    insufficientEvidence: string;
  };
  profilePage: {
    title: string;
    settings: string;
    targetMarketCardTitle: string;
    changeMarketButton: string;
    jurisdictionNote: string;
  };
  crag: {
    good: string;
    partial: string;
    insufficient: string;
    invalid: string;
    confidenceLabel: string;
    evidenceCountLabel: string;
    legalCaveatNotice: string;
  };
  evidenceViewer: {
    drawerTitle: string;
    pubNumber: string;
    jurisdiction: string;
    section: string;
    filingDate: string;
    pubDate: string;
    relevanceScore: string;
    sourceUrl: string;
    viewOnGooglePatents: string;
    originalTextNotice: string;
    authenticChunkText: string;
    close: string;
  };
  international: {
    pageTitle: string;
    pageSubtitle: string;
    ragTab: string;
    retrievalTab: string;
    familyTab: string;
    searchPlaceholder: string;
    searchAndGenerateBtn: string;
    retrievalOnlyBtn: string;
    generatingAnswer: string;
    retrievingEvidence: string;
    jurisdictionFilter: string;
    autoDetect: string;
    topKLabel: string;
    auditedAnswerTitle: string;
    claimValidationTitle: string;
    totalClaims: string;
    supportedClaims: string;
    unsupportedClaims: string;
    disclaimerTitle: string;
    evidenceSelectedTitle: string;
    clickToInspect: string;
    noResultsFound: string;
  };
}
