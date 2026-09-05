import { DomainType, LanguageCode } from "@/types";

export interface DomainInfo {
  title: string;
  badge: string;
  statutes: string[];
  prompts: { emoji: string; text: string }[];
}

export const DOMAIN_DATA: Partial<Record<LanguageCode, Record<DomainType | "auto", DomainInfo>>> = {
  en: {
    auto: {
      title: "All Domains & Legal Registers",
      badge: "Unified Indian IP & AYUSH Corpus",
      statutes: [
        "The Patents Act, 1970 (Sections 2, 3(e), 3(p), 10(4), 48, 53)",
        "Food Safety and Standards (Ayurveda Aahara) Regulations, 2022",
        "Drugs and Cosmetics Act, 1940 (Chapter IV-A) & Rules, 1945 (Rule 158B, Schedule T)",
        "The Trade Marks Act, 1999 & The GI of Goods Act, 1999",
        "Biological Diversity Act, 2002 (Section 6 NBA Form III) & ABS Regulations, 2014"
      ],
      prompts: [
        { emoji: "💡", text: "Can I patent an Ayurvedic formulation with Ashwagandha?" },
        { emoji: "🏷️", text: "What FSSAI labelling is required for herbal supplements?" },
        { emoji: "™️", text: "How do I register a trademark for my Ayurveda brand?" },
        { emoji: "🌿", text: "How to get a GI tag for a traditional Ayurvedic product?" },
        { emoji: "⚖️", text: "What is Section 3(e) of the Indian Patents Act 1970?" },
        { emoji: "📋", text: "What are the compliance requirements for AYUSH manufacturers?" }
      ]
    },
    patents: {
      title: "Patents & Innovations in Ayurveda",
      badge: "The Patents Act, 1970 & CSIR-TKDL",
      statutes: [
        "Section 3(e): Exclusion of mere admixtures lacking synergy",
        "Section 3(p): Prohibition on patenting traditional knowledge",
        "Section 10(4)(ii)(D): Mandatory declaration of biological source & origin",
        "Section 48 & 53: 20-Year statutory monopoly rights"
      ],
      prompts: [
        { emoji: "🔬", text: "How do I prove synergistic effect under Section 3(e) to patent a polyherbal drug?" },
        { emoji: "📜", text: "What evidence overcomes a Section 3(p) Traditional Knowledge rejection from TKDL?" },
        { emoji: "🧬", text: "What biological resource disclosures are required in patent Form 2 under Section 10(4)?" },
        { emoji: "⏱️", text: "What is the 20-year patent term and annual renewal rule under Section 53?" }
      ]
    },
    trademarks: {
      title: "Trademarks & Brand Protection",
      badge: "The Trade Marks Act, 1999",
      statutes: [
        "Class 5: Ayurvedic pharmaceuticals and medicinal preparations",
        "Class 29 & 30: Ayurvedic dietary supplements and health foods",
        "Class 3: Ayurvedic cosmetics, herbal skincare, and soaps",
        "Section 9: Absolute grounds for refusal (generic plant names)"
      ],
      prompts: [
        { emoji: "™️", text: "Which trademark class applies to Ayurvedic herbal medicines (Class 5) vs health foods (Class 30)?" },
        { emoji: "🚫", text: "Can I register a trademark using common plant names like 'Ashwagandha' or 'Triphala'?" },
        { emoji: "🔍", text: "How to conduct an official trademark clearance search on ipindia.gov.in?" },
        { emoji: "🛡️", text: "What legal protection does a registered trademark give against counterfeit herbal brands?" }
      ]
    },
    gi: {
      title: "Geographical Indications (GI Tags)",
      badge: "The GI of Goods Act, 1999",
      statutes: [
        "Section 2(e): Definition of Geographical Indication",
        "Section 8: Application by association of producers",
        "Kashmir Saffron (GI Application No. 635 / Certificate No. 372)",
        "Navara Rice & Malabar Pepper registered medicinal GI plants"
      ],
      prompts: [
        { emoji: "🌿", text: "How can a grower association apply for a GI tag for a regional Ayurvedic herb?" },
        { emoji: "🌺", text: "What makes Kashmir Saffron chemically distinct under its GI registry certificate?" },
        { emoji: "⚖️", text: "What remedies exist under the GI Act against unauthorized sellers misusing a GI tag?" },
        { emoji: "🌾", text: "Can an individual company own a Geographical Indication exclusively?" }
      ]
    },
    fssai: {
      title: "FSSAI Ayurveda Aahara Regulations",
      badge: "Gazette F. No. Stds/SP-05/A-1.2022",
      statutes: [
        "Regulation 2.2: Mandatory Ayurveda Aahara designated logo and name",
        "Regulation 2.3: Strict prohibition on disease diagnosis, cure, or treatment claims",
        "Schedule II: Heavy metal limits (Lead ≤2.5 ppm, Mercury ≤0.5 ppm, Arsenic ≤1.0 ppm)",
        "Regulation 5.1: FoSCoS portal licensing requirements"
      ],
      prompts: [
        { emoji: "🏷️", text: "What mandatory statutory warning must appear on an Ayurveda Aahara food supplement label?" },
        { emoji: "🚫", text: "Can an Ayurveda Aahara product claim to cure diabetes or hypertension on its packaging?" },
        { emoji: "🧪", text: "What are the permitted heavy metal contaminant limits under Schedule II?" },
        { emoji: "📑", text: "How to obtain an Ayurveda Aahara manufacturing license through FoSCoS?" }
      ]
    },
    ayush: {
      title: "AYUSH Drug Regulations & Biodiversity (NBA)",
      badge: "Drugs & Cosmetics Act 1940 & BD Act 2002",
      statutes: [
        "Drugs & Cosmetics Act Section 33EEB: Definition of ASU Patent or Proprietary Medicine",
        "Drugs & Cosmetics Rules Rule 158B: Proof of safety and pilot clinical trials",
        "Schedule T: Mandatory Good Manufacturing Practices (GMP) and Form 26D certificate",
        "Biological Diversity Act Section 6: Mandatory NBA Form III approval before patent grant"
      ],
      prompts: [
        { emoji: "📋", text: "What safety and clinical trial data is required under Rule 158B for an ASU drug license?" },
        { emoji: "🏭", text: "What are the mandatory testing and space requirements under Schedule T GMP?" },
        { emoji: "🌳", text: "When is National Biodiversity Authority (NBA) Form III approval required before a patent grant?" },
        { emoji: "💰", text: "What are the benefit-sharing fee percentages under the 2014 ABS Regulations?" }
      ]
    }
  },
  te: {
    auto: {
      title: "అన్ని రంగాలు & చట్టపరమైన విభాగాలు",
      badge: "ధృవీకరించబడిన భారతీయ IP & ఆయుష్ నిబంధనలు",
      statutes: [
        "భారత పేటెంట్ చట్టం, 1970 (సెక్షన్లు 2, 3(e), 3(p), 10(4), 48, 53)",
        "FSSAI (ఆయుర్వేద ఆహార) నిబంధనలు, 2022",
        "డ్రగ్స్ & కాస్మెటిక్స్ చట్టం, 1940 & నిబంధనలు, 1945 (రూల్ 158B, షెడ్యూల్ T)",
        "ట్రేడ్‌మార్క్ చట్టం, 1999 & భౌగోళిక గుర్తింపు (GI) చట్టం, 1999",
        "జీవవైవిధ్య చట్టం, 2002 (సెక్షన్ 6 NBA ఫారం III) & ABS నిబంధనలు, 2014"
      ],
      prompts: [
        { emoji: "💡", text: "అశ్వగంధతో కూడిన ఆయుర్వేద మిశ్రమానికి భారతదేశంలో పేటెంట్ పొందవచ్చా?" },
        { emoji: "🏷️", text: "ఆయుర్వేద ఆహార ఉత్పత్తులకు FSSAI లేబులింగ్ నియమాలు ఏమిటి?" },
        { emoji: "™️", text: "ఆయుర్వేద బ్రాండ్ పేరు కోసం ట్రేడ్‌మార్క్ ఎలా నమోదు చేసుకోవాలి?" },
        { emoji: "🌿", text: "సాంప్రదాయ ఆయుర్వేద ఉత్పత్తులకు భౌగోళిక గుర్తింపు GI ట్యాగ్ ఎలా పొందాలి?" },
        { emoji: "⚖️", text: "భారత పేటెంట్ చట్టం 1970 లోని సెక్షన్ 3(e) అంటే ఏమిటి?" },
        { emoji: "📋", text: "ఆయుష్ ఔషధ తయారీదారులకు చట్టపరమైన అవసరాలు ఏమిటి?" }
      ]
    },
    patents: {
      title: "పేటెంట్లు & ఆయుర్వేద ఆవిష్కరణలు",
      badge: "భారత పేటెంట్ చట్టం, 1970 & CSIR-TKDL",
      statutes: [
        "సెక్షన్ 3(e): సినర్జీ లేని సాధారణ మిశ్రమాల పేటెంట్ నిషేధం",
        "సెక్షన్ 3(p): సాంప్రదాయ పరిజ్ఞానంపై పేటెంట్ నిషేధం",
        "సెక్షన్ 10(4): జీవ వనరుల మూలం మరియు భౌగోళిక ప్రాంతం ప్రకటన తప్పనిసరి",
        "సెక్షన్ 48 & 53: 20 సంవత్సరాల ప్రత్యేక చట్టపరమైన హక్కులు"
      ],
      prompts: [
        { emoji: "🔬", text: "సెక్షన్ 3(e) కింద సినర్జీ ప్రభావాన్ని నిరూపించి ఆయుర్వేద మిశ్రమానికి పేటెంట్ ఎలా పొందాలి?" },
        { emoji: "📜", text: "TKDL ఆధారంగా వచ్చే సెక్షన్ 3(p) అభ్యంతరాలను ఎలా అధిగమించాలి?" },
        { emoji: "🧬", text: "ఫారం 2 పేటెంట్ దరఖాస్తులో జీవ వనరుల మూలాన్ని ఎలా వెల్లడించాలి?" },
        { emoji: "⏱️", text: "పేటెంట్ 20 సంవత్సరాల కాలపరిమితి మరియు వార్షిక పునరుద్ధరణ నిబంధనలు ఏమిటి?" }
      ]
    },
    trademarks: {
      title: "ట్రేడ్‌మార్కులు & బ్రాండ్ రక్షణ",
      badge: "ట్రేడ్‌మార్క్ చట్టం, 1999",
      statutes: [
        "క్లాస్ 5: ఆయుర్వేద ఔషధాలు మరియు ఫార్మాస్యూటికల్ ఉత్పత్తులు",
        "క్లాస్ 29 & 30: ఆయుర్వేద ఆహార పదార్థాలు మరియు సప్లిమెంట్లు",
        "క్లాస్ 3: సౌందర్య సాధనాలు, హెర్బల్ సబ్బులు మరియు క్రీములు",
        "సెక్షన్ 9: సాధారణ మొక్కల పేర్ల రిజిస్ట్రేషన్ నిషేధం"
      ],
      prompts: [
        { emoji: "™️", text: "ఆయుర్వేద ఔషధాలకు క్లాస్ 5 మరియు ఆహార ఉత్పత్తులకు క్లాస్ 30 ఎలా వర్తిస్తాయి?" },
        { emoji: "🚫", text: "'అశ్వగంధ' లేదా 'త్రిఫల' వంటి సాధారణ మూలికల పేర్లను ట్రేడ్‌మార్క్‌గా నమోదు చేయవచ్చా?" },
        { emoji: "🔍", text: "ipindia.gov.in లో అధికారిక ట్రేడ్‌మార్క్ శోధన ఎలా నిర్వహించాలి?" },
        { emoji: "🛡️", text: "నకిలీ బ్రాండ్ల నుండి రక్షణ పొందడానికి రిజిస్టర్డ్ ట్రేడ్‌మార్క్ ఎలా ఉపయోగపడుతుంది?" }
      ]
    },
    gi: {
      title: "భౌగోళిక గుర్తింపు (GI Tags)",
      badge: "వస్తువుల భౌగోళిక గుర్తింపు చట్టం, 1999",
      statutes: [
        "సెక్షన్ 2(e): భౌగోళిక గుర్తింపు చట్టపరమైన నిర్వచనం",
        "సెక్షన్ 8: ఉత్పత్తిదారుల సంఘం ద్వారా దరఖాస్తు",
        "కాశ్మీర్ కుంకుమపువ్వు (GI దరఖాస్తు సంఖ్య 635)",
        "నవర బియ్యం & మలబార్ మిరియాలు రక్షిత GI మూలికలు"
      ],
      prompts: [
        { emoji: "🌿", text: "సాంప్రదాయ ఆయుర్వేద మూలికకు రైతుల సంఘం GI ట్యాగ్ కోసం ఎలా దరఖాస్తు చేయాలి?" },
        { emoji: "🌺", text: "కాశ్మీర్ కుంకుమపువ్వుకు GI రిజిస్ట్రీ ప్రకారం ఉన్న ప్రత్యేక రసాయన లక్షణాలు ఏమిటి?" },
        { emoji: "⚖️", text: "నకిలీ వ్యక్తులు GI పేరును దుర్వినియోగం చేస్తే తీసుకోవాల్సిన చట్టపరమైన చర్యలు ఏమిటి?" },
        { emoji: "🌾", text: "ఒకే ప్రైవేట్ కంపెనీ మాత్రమే GI ట్యాగ్‌ను తన సొంతం చేసుకోవచ్చా?" }
      ]
    },
    fssai: {
      title: "FSSAI ఆయుర్వేద ఆహార నిబంధనలు",
      badge: "గెజిట్ నోటిఫికేషన్ F. No. Stds/SP-05/A-1.2022",
      statutes: [
        "నిబంధన 2.2: అధికారిక 'ఆయుర్వేద ఆహార' లోగో మరియు వర్గ ముద్రణ తప్పనిసరి",
        "నిబంధన 2.3: వ్యాధులను నయం చేస్తుందనే దావాల కఠిన నిషేధం",
        "షెడ్యూల్ II: భార లోహాల పరిమితులు (సీసం ≤2.5 ppm, పాదరసం ≤0.5 ppm)",
        "నిబంధన 5.1: FoSCoS పోర్టల్ ద్వారా లైసెన్సింగ్ ప్రక్రియ"
      ],
      prompts: [
        { emoji: "🏷️", text: "ఆయుర్వేద ఆహార ఉత్పత్తుల లేబుల్‌పై తప్పనిసరిగా ఉండవలసిన చట్టబద్ధమైన హెచ్చరిక ఏమిటి?" },
        { emoji: "🚫", text: "ఆయుర్వేద ఆహార ఉత్పత్తి షుగర్ లేదా బీపీని నయం చేస్తుందని ప్యాకెట్‌పై ప్రచారం చేయవచ్చా?" },
        { emoji: "🧪", text: "షెడ్యూల్ II ప్రకారం అనుమతించబడిన భార లోహాల గరిష్ట పరిమితులు ఏమిటి?" },
        { emoji: "📑", text: "FoSCoS పోర్టల్ ద్వారా ఆయుర్వేద ఆహార తయారీ లైసెన్స్ ఎలా పొందాలి?" }
      ]
    },
    ayush: {
      title: "ఆయుష్ ఔషధ నిబంధనలు & జీవవైవిధ్యం (NBA)",
      badge: "డ్రగ్స్ & కాస్మెటిక్స్ చట్టం 1940 & BD చట్టం 2002",
      statutes: [
        "సెక్షన్ 33EEB: ఆయుర్వేద పేటెంట్ లేదా ప్రొప్రైటరీ ఔషధ నిర్వచనం",
        "రూల్ 158B: భద్రతా అధ్యయనాలు మరియు క్లినికల్ ట్రయల్స్ సమర్పణ",
        "షెడ్యూల్ T: తప్పనిసరి GMP ప్రమాణాలు మరియు ఫారం 26D సర్టిఫికేట్",
        "జీవవైవిధ్య చట్టం సెక్షన్ 6: పేటెంట్ మంజూరుకు ముందు NBA ఫారం III అనుమతి తప్పనిసరి"
      ],
      prompts: [
        { emoji: "📋", text: "రూల్ 158B కింద ఆయుర్వేద ఔషధ లైసెన్స్ పొందడానికి అవసరమైన భద్రతా డేటా ఏమిటి?" },
        { emoji: "🏭", text: "షెడ్యూల్ T ప్రకారం ఆయుర్వేద ఫ్యాక్టరీలో ఉండవలసిన నాణ్యతా నియంత్రణ ల్యాబ్ నిబంధనలు ఏమిటి?" },
        { emoji: "🌳", text: "భారతీయ మూలికలపై పేటెంట్ పొందేందుకు జాతీయ జీవవైవిధ్య ప్రాధికార సంస్థ (NBA) అనుమతి ఎప్పుడు తీసుకోవాలి?" },
        { emoji: "💰", text: "2014 ABS నిబంధనల ప్రకారం ఫార్మా కంపెనీలు చెల్లించాల్సిన లాభాల భాగస్వామ్య శాతం ఎంత?" }
      ]
    }
  },
  hi: {
    auto: {
      title: "सभी डोमेन और कानूनी रजिस्टर",
      badge: "सत्यापित भारतीय बौद्धिक संपदा और आयुष नियम",
      statutes: [
        "भारतीय पेटेंट अधिनियम, 1970 (धारा 2, 3(e), 3(p), 10(4), 48, 53)",
        "खाद्य सुरक्षा और मानक (आयुर्वेद आहार) विनियम, 2022",
        "ड्रग्स एंड कॉस्मेटिक्स एक्ट, 1940 और नियम, 1945 (नियम 158B, शेड्यूल T)",
        "ट्रेड मार्क्स अधिनियम, 1999 और जीआई अधिनियम, 1999",
        "जैविक विविधता अधिनियम, 2002 (धारा 6 NBA फॉर्म III) और ABS विनियम, 2014"
      ],
      prompts: [
        { emoji: "💡", text: "क्या मैं अश्वगंधा के साथ आयुर्वेदिक फॉर्मूलेशन को पेटेंट करा सकता हूँ?" },
        { emoji: "🏷️", text: "हर्बल सप्लीमेंट्स के लिए FSSAI लेबलिंग नियम क्या हैं?" },
        { emoji: "™️", text: "आयुर्वेद ब्रांड के लिए ट्रेडमार्क कैसे पंजीकृत करें?" },
        { emoji: "🌿", text: "पारंपरिक आयुर्वेदिक उत्पाद के लिए GI टैग कैसे प्राप्त करें?" },
        { emoji: "⚖️", text: "भारतीय पेटेंट अधिनियम 1970 की धारा 3(e) क्या है?" },
        { emoji: "📋", text: "AYUSH निर्माताओं के लिए वैधानिक अनुपालन आवश्यकताएं क्या हैं?" }
      ]
    },
    patents: {
      title: "पेटेंट और आयुर्वेदिक नवाचार",
      badge: "पेटेंट अधिनियम, 1970 और CSIR-TKDL",
      statutes: [
        "धारा 3(e): बिना सहक्रियाशीलता (Synergy) के मिश्रणों का पेटेंट निषेध",
        "धारा 3(p): पारंपरिक ज्ञान पर पेटेंट का पूर्ण निषेध",
        "धारा 10(4): जैविक सामग्री के स्रोत और भौगोलिक मूल का अनिवार्य प्रकटीकरण",
        "धारा 48 और 53: 20 वर्ष का कानूनी एकाधिकार अधिकार"
      ],
      prompts: [
        { emoji: "🔬", text: "धारा 3(e) के तहत औषधीय तालमेल (Synergy) साबित कर पेटेंट कैसे प्राप्त करें?" },
        { emoji: "📜", text: "TKDL द्वारा उठाई गई धारा 3(p) पारंपरिक ज्ञान आपत्ति को कैसे दूर करें?" },
        { emoji: "🧬", text: "पेटेंट फॉर्म 2 में जैविक संसाधनों के भौगोलिक स्रोत का प्रकटीकरण कैसे करें?" },
        { emoji: "⏱️", text: "पेटेंट की 20 वर्ष की अवधि और वार्षिक नवीनीकरण नियम क्या हैं?" }
      ]
    },
    trademarks: {
      title: "ट्रेडमार्क और ब्रांड सुरक्षा",
      badge: "ट्रेड मार्क्स अधिनियम, 1999",
      statutes: [
        "वर्ग 5: आयुर्वेदिक औषधियां और चिकित्सीय उत्पाद",
        "वर्ग 29 और 30: आयुर्वेदिक आहार उत्पाद और सप्लीमेंट्स",
        "वर्ग 3: हर्बल सौंदर्य प्रसाधन, साबुन और तेल",
        "धारा 9: सामान्य पौधों के नामों के पंजीकरण पर प्रतिबंध"
      ],
      prompts: [
        { emoji: "™️", text: "आयुर्वेदिक दवाओं के लिए क्लास 5 और खाद्य उत्पादों के लिए क्लास 30 कैसे लागू होता है?" },
        { emoji: "🚫", text: "क्या 'अश्वगंधा' या 'त्रिफला' जैसे सामान्य पौधों के नाम पर ट्रेडमार्क मिल सकता है?" },
        { emoji: "🔍", text: "ipindia.gov.in पर आधिकारिक ट्रेडमार्क खोज कैसे करें?" },
        { emoji: "🛡️", text: "नकली ब्रांडों से बचाव के लिए पंजीकृत ट्रेडमार्क के क्या अधिकार हैं?" }
      ]
    },
    gi: {
      title: "भौगोलिक संकेत (GI Tags)",
      badge: "वस्तुओं का भौगोलिक उपदर्शन अधिनियम, 1999",
      statutes: [
        "धारा 2(e): भौगोलिक संकेत की कानूनी परिभाषा",
        "धारा 8: उत्पादकों के संघ द्वारा आवेदन",
        "कश्मीर केसर (GI आवेदन संख्या 635)",
        "नवरा चावल और मालाबार काली मिर्च पंजीकृत जीआई उत्पाद"
      ],
      prompts: [
        { emoji: "🌿", text: "पारंपरिक आयुर्वेदिक औषधीय पौधे के लिए जीआई टैग कैसे प्राप्त करें?" },
        { emoji: "🌺", text: "कश्मीर केसर को जीआई रजिस्ट्री के तहत कौन से अद्वितीय रासायनिक गुण प्राप्त हैं?" },
        { emoji: "⚖️", text: "जीआई नाम का दुरुपयोग करने वालों के विरुद्ध क्या कानूनी कार्रवाई की जा सकती है?" },
        { emoji: "🌾", text: "क्या कोई व्यक्तिगत कंपनी जीआई टैग की एकमात्र मालिक हो सकती है?" }
      ]
    },
    fssai: {
      title: "FSSAI आयुर्वेद आहार नियम",
      badge: "राजपत्र अधिसूचना F. No. Stds/SP-05/A-1.2022",
      statutes: [
        "विनियम 2.2: आधिकारिक 'आयुर्वेद आहार' लोगो और नाम अनिवार्य",
        "विनियम 2.3: बीमारी ठीक करने या रोकने के दावों पर पूर्ण प्रतिबंध",
        "अनुसूची II: भारी धातु सीमाएं (सीसा ≤2.5 ppm, पारा ≤0.5 ppm)",
        "विनियम 5.1: FoSCoS पोर्टल के माध्यम से विनिर्माण लाइसेंस"
      ],
      prompts: [
        { emoji: "🏷️", text: "आयुर्वेद आहार उत्पाद के लेबल पर कौन सी अनिवार्य वैधानिक चेतावनी होनी चाहिए?" },
        { emoji: "🚫", text: "क्या आयुर्वेद आहार उत्पाद पैकेजिंग पर मधुमेह या रक्तचाप ठीक करने का दावा कर सकता है?" },
        { emoji: "🧪", text: "अनुसूची II के तहत भारी धातुओं की अधिकतम अनुमेय सीमाएं क्या हैं?" },
        { emoji: "📑", text: "FoSCoS पोर्टल के माध्यम से आयुर्वेद आहार लाइसेंस के लिए आवेदन कैसे करें?" }
      ]
    },
    ayush: {
      title: "आयुष दवा नियम और जैव विविधता (NBA)",
      badge: "ड्रग्स एंड कॉस्मेटिक्स एक्ट 1940 और BD एक्ट 2002",
      statutes: [
        "धारा 33EEB: आयुर्वेदिक पेटेंट या मालिकाना दवा की परिभाषा",
        "नियम 158B: सुरक्षा अध्ययन और पायलट क्लिनिकल परीक्षण",
        "अनुसूची T: अनिवार्य जीएमपी मानक और फॉर्म 26D प्रमाण पत्र",
        "जैव विविधता अधिनियम धारा 6: पेटेंट से पहले अनिवार्य NBA फॉर्म III अनुमोदन"
      ],
      prompts: [
        { emoji: "📋", text: "नियम 158B के तहत आयुष दवा लाइसेंस के लिए कौन से सुरक्षा डेटा आवश्यक हैं?" },
        { emoji: "🏭", text: "शेड्यूल T जीएमपी के तहत आयुर्वेदिक कारखाने के लिए क्या आवश्यकताएं हैं?" },
        { emoji: "🌳", text: "भारतीय जड़ी-बूटियों पर पेटेंट प्राप्त करने के लिए NBA फॉर्म III अनुमोदन कब आवश्यक है?" },
        { emoji: "💰", text: "2014 ABS नियमों के तहत फार्मा कंपनियों को कितना लाभ साझा करना होगा?" }
      ]
    }
  },
  ta: {
    auto: {
      title: "அனைத்து களங்கள் & சட்டப் பதிவேடுகள்",
      badge: "சரிபார்க்கப்பட்ட இந்திய IP & ஆயுஷ் விதிகள்",
      statutes: [
        "இந்திய காப்புரிமைச் சட்டம், 1970 (பிரிவுகள் 2, 3(e), 3(p), 10(4), 48, 53)",
        "உணவு பாதுகாப்பு மற்றும் தரநிலைகள் (ஆயுர்வேத ஆஹாரா) ஒழுங்குமுறைகள், 2022",
        "மருந்துகள் மற்றும் அழகுசாதனப் பொருட்கள் சட்டம், 1940 & விதிகள், 1945 (விதி 158B, அட்டவணை T)",
        "வர்த்தக முத்திரைகள் சட்டம், 1999 & புவிசார் குறியீடு சட்டம், 1999",
        "உயிரியல் பன்முகத்தன்மை சட்டம், 2002 (பிரிவு 6 NBA படிவம் III) & ABS விதிகள், 2014"
      ],
      prompts: [
        { emoji: "💡", text: "அஸ்வகந்தா ஆயுர்வேத மருந்துக்கு இந்தியாவில் காப்புரிமை பெற முடியுமா?" },
        { emoji: "🏷️", text: "ஆயுர்வேத உணவுப் பொருட்களுக்கான FSSAI லேபிளிங் விதிகள் என்ன?" },
        { emoji: "™️", text: "ஆயுர்வேத பிராண்ட் பெயருக்கு வர்த்தக முத்திரையை எவ்வாறு பதிவு செய்வது?" },
        { emoji: "🌿", text: "பாரம்பரிய ஆயுர்வேத தயாரிப்புகளுக்கு GI குறிச்சொல்லை எவ்வாறு பெறுவது?" },
        { emoji: "⚖️", text: "இந்திய காப்புரிமைச் சட்டம் 1970 இன் பிரிவு 3(e) என்றால் என்ன?" },
        { emoji: "📋", text: "ஆயுஷ் உற்பத்தியாளர்களுக்கான சட்டத் தேவைகள் என்ன?" }
      ]
    },
    patents: {
      title: "காப்புரிமைகள் & ஆயுர்வேத கண்டுபிடிப்புகள்",
      badge: "காப்புரிமைச் சட்டம், 1970 & CSIR-TKDL",
      statutes: [
        "பிரிவு 3(e): ஒருங்கிணைந்த விளைவு இல்லாத எளிய கலவைகளுக்கு காப்புரிமை மறுப்பு",
        "பிரிவு 3(p): பாரம்பரிய அறிவு சார்ந்த கண்டுபிடிப்புகளுக்கு காப்புரிமை விலக்கு",
        "பிரிவு 10(4): உயிரியல் வளங்களின் மூலத்தை கட்டாயம் அறிவித்தல்",
        "பிரிவு 48 & 53: 20 ஆண்டுகள் சட்டப்பூர்வ பிரத்யேக உரிமை"
      ],
      prompts: [
        { emoji: "🔬", text: "பிரிவு 3(e) இன் கீழ் ஒருங்கிணைந்த விளைவை (Synergy) நிரூபித்து காப்புரிமை பெறுவது எப்படி?" },
        { emoji: "📜", text: "TKDL தரவுகளின் அடிப்படையிலான பிரிவு 3(p) மறுப்பை எவ்வாறு கடப்பது?" },
        { emoji: "🧬", text: "காப்புரிமை படிவம் 2 இல் உயிரியல் வளங்களின் புவியியல் மூலத்தை எவ்வாறு அறிவிப்பது?" },
        { emoji: "⏱️", text: "காப்புரிமையின் 20 ஆண்டு கால வரம்பு மற்றும் புதுப்பித்தல் விதிகள் என்ன?" }
      ]
    },
    trademarks: {
      title: "வர்த்தக முத்திரைகள் & பிராண்ட் பாதுகாப்பு",
      badge: "வர்த்தக முத்திரைகள் சட்டம், 1999",
      statutes: [
        "வகுப்பு 5: ஆயுர்வேத மருந்துகள் மற்றும் மருத்துவப் பொருட்கள்",
        "வகுப்பு 29 & 30: ஆயுர்வேத உணவுப் பொருட்கள் மற்றும் சப்ளிமெண்ட்ஸ்",
        "வகுப்பு 3: மூலிகை அழகுசாதனப் பொருட்கள், சோப்புகள் மற்றும் தைலங்கள்",
        "பிரிவு 9: பொதுவான தாவரப் பெயர்களைப் பதிவு செய்வதற்குத் தடை"
      ],
      prompts: [
        { emoji: "™️", text: "ஆயுர்வேத மருந்துகளுக்கு வகுப்பு 5 மற்றும் உணவுப் பொருட்களுக்கு வகுப்பு 30 எவ்வாறு பொருந்தும்?" },
        { emoji: "🚫", text: "'அமுக்கராகிழங்கு' போன்ற பொதுவான தாவரப் பெயர்களுக்கு வர்த்தக முத்திரை பெற முடியுமா?" },
        { emoji: "🔍", text: "ipindia.gov.in இல் அதிகாரப்பூர்வ வர்த்தக முத்திரை தேடலை எவ்வாறு மேற்கொள்வது?" },
        { emoji: "🛡️", text: "போலி தயாரிப்புகளுக்கு எதிராக பதிவுசெய்யப்பட்ட வர்த்தக முத்திரையின் சட்டப் பாதுகாப்பு என்ன?" }
      ]
    },
    gi: {
      title: "புவிசார் குறியீடு (GI Tags)",
      badge: "பொருட்களின் புவிசார் குறியீடு சட்டம், 1999",
      statutes: [
        "பிரிவு 2(e): புவிசார் குறியீட்டின் சட்டப்பூர்வ வரையறை",
        "பிரிவு 8: உற்பத்தியாளர்கள் சங்கம் மூலம் விண்ணப்பித்தல்",
        "காஷ்மீர் குங்குமப்பூ (GI விண்ணப்ப எண் 635)",
        "ஞவரா அரிசி மற்றும் மலபார் மிளகு பதிவு செய்யப்பட்ட GI மூலிகைகள்"
      ],
      prompts: [
        { emoji: "🌿", text: "பாரம்பரிய மூலிகைப் பயிர்களுக்கு விவசாயிகள் சங்கம் எவ்வாறு GI குறியீட்டைப் பெறலாம்?" },
        { emoji: "🌺", text: "காஷ்மீர் குங்குமப்பூவின் தனித்துவமான வேதியியல் குணங்கள் என்ன?" },
        { emoji: "⚖️", text: "GI பெயரை தவறாகப் பயன்படுத்துபவர்களுக்கு எதிரான சட்ட நடவடிக்கைகள் என்ன?" },
        { emoji: "🌾", text: "ஒரு தனிப்பட்ட நிறுவனம் மட்டுமே GI குறியீட்டின் உரிமையாளராக முடியுமா?" }
      ]
    },
    fssai: {
      title: "FSSAI ஆயுர்வேத ஆஹாரா விதிகள்",
      badge: "அரசிதழ் அறிவிப்பு F. No. Stds/SP-05/A-1.2022",
      statutes: [
        "விதி 2.2: அதிகாரப்பூர்வ 'ஆயுர்வேத ஆஹாரா' லோகோ கட்டாயம்",
        "விதி 2.3: நோயைக் குணப்படுத்தும் கூற்றுகளுக்கு கடுமையான தடை",
        "அட்டவணை II: கன உலோக வரம்புகள் (ஈயம் ≤2.5 ppm, பாதரசம் ≤0.5 ppm)",
        "விதி 5.1: FoSCoS போர்ட்டல் மூலம் உற்பத்தி உரிமம்"
      ],
      prompts: [
        { emoji: "🏷️", text: "ஆயுர்வேத ஆஹாரா லேபிளில் இருக்க வேண்டிய கட்டாய எச்சரிக்கை வாசகம் என்ன?" },
        { emoji: "🚫", text: "ஆயுர்வேத ஆஹாரா தயாரிப்பு சர்க்கரை அல்லது ரத்த அழுத்தத்தைக் குணப்படுத்தும் என்று கூறலாமா?" },
        { emoji: "🧪", text: "அட்டவணை II இன் கீழ் அனுமதிக்கப்பட்ட கன உலோகங்களின் வரம்புகள் என்ன?" },
        { emoji: "📑", text: "FoSCoS போர்ட்டல் மூலம் ஆயுர்வேத உணவு உரிமத்திற்கு எவ்வாறு விண்ணப்பிப்பது?" }
      ]
    },
    ayush: {
      title: "ஆயுஷ் மருந்து விதிகள் & பல்லுயிர் ஆணையம் (NBA)",
      badge: "மருந்துகள் சட்டம் 1940 & BD சட்டம் 2002",
      statutes: [
        "பிரிவு 33EEB: ஆயுர்வேத காப்புரிமை அல்லது தனியுரிம மருந்தின் வரையறை",
        "விதி 158B: பாதுகாப்பு ஆய்வுகள் மற்றும் மருத்துவ பரிசோதனைகள்",
        "அட்டவணை T: கட்டாய GMP தரநிலைகள் மற்றும் படிவம் 26D சான்றிதழ்",
        "உயிரியல் பன்முகத்தன்மை சட்டம் பிரிவு 6: காப்புரிமைக்கு முன் NBA படிவம் III ஒப்புதல்"
      ],
      prompts: [
        { emoji: "📋", text: "விதி 158B இன் கீழ் மருந்து உரிமம் பெற தேவையான பாதுகாப்புத் தரவுகள் என்ன?" },
        { emoji: "🏭", text: "அட்டவணை T GMP இன் கீழ் ஆயுர்வேத தொழிற்சாலைக்கான தேவைகள் என்ன?" },
        { emoji: "🌳", text: "இந்திய மூலிகைகள் மீதான காப்புரிமைக்கு முன் தேசிய பல்லுயிர் ஆணையத்தின் (NBA) ஒப்புதல் எப்போது தேவை?" },
        { emoji: "💰", text: "2014 ABS விதிகளின் கீழ் மருந்து நிறுவனங்கள் செலுத்த வேண்டிய பயன் பகிர்வு சதவீதம் என்ன?" }
      ]
    }
  }
};
