import { LanguageCode, DomainType } from "@/types";

export interface TranslationStrings {
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
}

export const I18N: Record<string, TranslationStrings> = {
  en: {
    title: "AYURLEX",
    subtitle: "SIH26045 · Ministry of Ayush",
    tagline: "Multilingual Legal RAG",
    welcomeDesc: "Your AI assistant for Indian IP law and AYUSH / FSSAI regulatory guidance. All answers cite the exact legal source.",
    inputPlaceholder: "Ask about patents, trademarks, GI tags, FSSAI / AYUSH compliance...",
    legalDisclaimer: "Answers cite verified Indian legal sources. Not a substitute for professional legal advice.",
    domains: {
      auto: "All Domains",
      patents: "Patents",
      trademarks: "Trademarks",
      gi: "GI Tags",
      fssai: "FSSAI",
      ayush: "AYUSH",
    },
    referredSources: "Referred Legal Documents & Provisions:",
    viewQuoted: "View Quoted Texts",
    hideQuoted: "Hide Text",
    sourceDoc: "Official Document",
    genTime: "Answer generated in",
    searchingCorpus: "Searching legal corpus and generating answer...",
    suggestions: [
      { emoji: "💡", text: "Can I patent an Ayurvedic formulation with Ashwagandha?" },
      { emoji: "🏷️", text: "What FSSAI labelling is required for herbal supplements?" },
      { emoji: "™️", text: "How do I register a trademark for my Ayurveda brand?" },
      { emoji: "🌿", text: "How to get a GI tag for a traditional Ayurvedic product?" },
      { emoji: "⚖️", text: "What is Section 3(e) of the Indian Patents Act 1970?" },
      { emoji: "📋", text: "What are the compliance requirements for AYUSH manufacturers?" },
    ],
  },
  te: {
    title: "ఆయుర్‌లెక్స్ (AYURLEX)",
    subtitle: "SIH26045 · ఆయుష్ మంత్రిత్వ శాఖ",
    tagline: "బహుభాషా చట్టపరమైన RAG సహాయకుడు",
    welcomeDesc: "భారతీయ మేధో సంపత్తి (IP) చట్టాలు మరియు ఆయుష్/FSSAI నిబంధనల మార్గదర్శకత్వం కోసం మీ AI సహాయకుడు. అన్ని సమాధానాలు అధికారిక చట్టాలను ఉదహరిస్తాయి.",
    inputPlaceholder: "పేటెంట్లు, ట్రేడ్‌మార్కులు, GI ట్యాగ్‌లు, FSSAI లేదా ఆయుష్ నిబంధనల గురించి అడగండి...",
    legalDisclaimer: "సమాధానాలు ధృవీకరించబడిన భారతీయ చట్టాలను సూచిస్తాయి. ఇది వృత్తిపరమైన న్యాయ సలహాకు ప్రత్యామ్నాయం కాదు.",
    domains: {
      auto: "అన్ని రంగాలు (All Domains)",
      patents: "పేటెంట్లు (Patents)",
      trademarks: "ట్రేడ్‌మార్కులు (Trademarks)",
      gi: "భౌగోళిక గుర్తింపు (GI Tags)",
      fssai: "ఎఫ్.ఎస్.ఎస్.ఎ.ఐ (FSSAI)",
      ayush: "ఆయుష్ (AYUSH)",
    },
    referredSources: "సూచించబడిన చట్టపరమైన పత్రాలు & విభాగాలు:",
    viewQuoted: "ఉదహరించిన గ్రంథాలను వీక్షించండి",
    hideQuoted: "దాచు",
    sourceDoc: "అధికారిక చట్టం",
    genTime: "సమాధానం రూపొందించబడింది",
    searchingCorpus: "చట్టపరమైన పత్రాలను శోధిస్తోంది మరియు సమాధానాన్ని రూపొందిస్తోంది...",
    suggestions: [
      { emoji: "💡", text: "అశ్వగంధతో కూడిన ఆయుర్వేద మిశ్రమానికి భారతదేశంలో పేటెంట్ పొందవచ్చా?" },
      { emoji: "🏷️", text: "ఆయుర్వేద ఆహార ఉత్పత్తులకు FSSAI లేబులింగ్ నియమాలు ఏమిటి?" },
      { emoji: "™️", text: "ఆయుర్వేద బ్రాండ్ పేరు కోసం ట్రేడ్‌మార్క్ ఎలా నమోదు చేసుకోవాలి?" },
      { emoji: "🌿", text: "సాంప్రదాయ ఆయుర్వేద ఉత్పత్తులకు భౌగోళిక గుర్తింపు GI ట్యాగ్ ఎలా పొందాలి?" },
      { emoji: "⚖️", text: "భారత పేటెంట్ చట్టం 1970 లోని సెక్షన్ 3(e) అంటే ఏమిటి?" },
      { emoji: "📋", text: "ఆయుష్ ఔషధ తయారీదారులకు చట్టపరమైన అవసరాలు ఏమిటి?" },
    ],
  },
  hi: {
    title: "आयुर्लेक्स (AYURLEX)",
    subtitle: "SIH26045 · आयुष मंत्रालय",
    tagline: "बहुभाषी कानूनी RAG सहायक",
    welcomeDesc: "भारतीय बौद्धिक संपदा कानून और आयुष/FSSAI नियामक मार्गदर्शन के लिए आपका AI सहायक। सभी उत्तर सटीक कानूनी स्रोतों को उद्धृत करते हैं।",
    inputPlaceholder: "पेटेंट, ट्रेडमार्क, जीआई टैग, एफएसएसएआई या आयुष नियमों के बारे में पूछें...",
    legalDisclaimer: "उत्तर सत्यापित भारतीय कानूनी स्रोतों का हवाला देते हैं। यह पेशेवर कानूनी सलाह का विकल्प नहीं है।",
    domains: {
      auto: "सभी डोमेन",
      patents: "पेटेंट",
      trademarks: "ट्रेडमार्क",
      gi: "जीआई टैग",
      fssai: "एफएसएसएआई",
      ayush: "आयुष",
    },
    referredSources: "संदर्भित कानूनी दस्तावेज और धाराएं:",
    viewQuoted: "उद्धृत पाठ देखें",
    hideQuoted: "छिपाएं",
    sourceDoc: "आधिकारिक दस्तावेज",
    genTime: "उत्तर तैयार हुआ",
    searchingCorpus: "कानूनी दस्तावेजों में खोज और उत्तर तैयार किया जा रहा है...",
    suggestions: [
      { emoji: "💡", text: "क्या मैं अश्वगंधा के साथ आयुर्वेदिक फॉर्मूलेशन को पेटेंट करा सकता हूँ?" },
      { emoji: "🏷️", text: "हर्बल सप्लीमेंट्स के लिए FSSAI लेबलिंग नियम क्या हैं?" },
      { emoji: "™️", text: "आयुर्वेद ब्रांड के लिए ट्रेडमार्क कैसे पंजीकृत करें?" },
      { emoji: "🌿", text: "पारंपरिक आयुर्वेदिक उत्पाद के लिए GI टैग कैसे प्राप्त करें?" },
      { emoji: "⚖️", text: "भारतीय पेटेंट अधिनियम 1970 की धारा 3(e) क्या है?" },
      { emoji: "📋", text: "AYUSH निर्माताओं के लिए वैधानिक अनुपालन आवश्यकताएं क्या हैं?" },
    ],
  },
  ta: {
    title: "ஆயுர்லெக்ஸ் (AYURLEX)",
    subtitle: "SIH26045 · ஆயுஷ் அமைச்சகம்",
    tagline: "பன்மொழி சட்ட RAG உதவியாளர்",
    welcomeDesc: "இந்திய அறிவுசார் சொத்துரிமை சட்டம் மற்றும் ஆயுஷ்/FSSAI வழிகாட்டுதலுக்கான AI உதவியாளர். அனைத்து பதில்களும் சட்ட மூலங்களை மேற்கோள் காட்டுகின்றன.",
    inputPlaceholder: "காப்புரிமை, வர்த்தக முத்திரை, GI குறிச்சொல், FSSAI / ஆயுஷ் பற்றி கேட்கவும்...",
    legalDisclaimer: "பதில்கள் சரிபார்க்கப்பட்ட இந்திய சட்ட மூலங்களை மேற்கோள் காட்டுகின்றன. இது தொழில்முறை சட்ட ஆலோசனையல்ல.",
    domains: {
      auto: "அனைத்து களங்கள்",
      patents: "காப்புரிமைகள்",
      trademarks: "வர்த்தக முத்திரைகள்",
      gi: "புவிசார் குறியீடு",
      fssai: "FSSAI",
      ayush: "ஆயுஷ்",
    },
    referredSources: "குறிப்பிடப்பட்ட சட்ட ஆவணங்கள் மற்றும் பிரிவுகள்:",
    viewQuoted: "மேற்கோள் நூல்களைக் காண்க",
    hideQuoted: "மறைக்க",
    sourceDoc: "அதிகாரப்பூர்வ சட்டம்",
    genTime: "பதில் உருவாக்கப்பட்டது",
    searchingCorpus: "சட்ட ஆவணங்களைத் தேடி பதில் உருவாக்கப்படுகிறது...",
    suggestions: [
      { emoji: "💡", text: "அஸ்வகந்தா ஆயுர்வேத மருந்துக்கு இந்தியாவில் காப்புரிமை பெற முடியுமா?" },
      { emoji: "🏷️", text: "ஆயுர்வேத உணவுப் பொருட்களுக்கான FSSAI லேபிளிங் விதிகள் என்ன?" },
      { emoji: "™️", text: "ஆயுர்வேத பிராண்ட் பெயருக்கு வர்த்தக முத்திரையை எவ்வாறு பதிவு செய்வது?" },
      { emoji: "🌿", text: "பாரம்பரிய ஆயுர்வேத தயாரிப்புகளுக்கு GI குறிச்சொல்லை எவ்வாறு பெறுவது?" },
      { emoji: "⚖️", text: "இந்திய காப்புரிமைச் சட்டம் 1970 இன் பிரிவு 3(e) என்றால் என்ன?" },
      { emoji: "📋", text: "ஆயுஷ் உற்பத்தியாளர்களுக்கான சட்டத் தேவைகள் என்ன?" },
    ],
  },
};

export function getTranslation(lang: LanguageCode | string): TranslationStrings {
  return I18N[lang] || I18N.en;
}
