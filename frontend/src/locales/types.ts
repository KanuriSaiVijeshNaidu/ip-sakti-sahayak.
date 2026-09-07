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
}
