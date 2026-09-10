# AYURLEX Multilingual Demo Questions & Benchmark
**Document ID:** REP-MULTI-DEMO-V2  

---

## 1. Multilingual Capabilities Summary

AYURLEX is natively equipped with cross-lingual dense vector retrieval across **Japanese, Hindi, Telugu, Tamil, German, Sanskrit, and English**. 

The system does not rely on lossy machine translation before search. Instead, it utilizes **multilingual semantic vector embeddings (BGE-M3)** to calculate cross-lingual cosine similarity directly against indexed statutory and patent documents.

---

## 2. Tested Multilingual Question Suite

| ID | Source Language | Target Jurisdiction | Query Text | English Translation / Intent | Top Evidence Chunk | Retrieval Score | Status |
| :--- | :---: | :---: | :--- | :--- | :--- | :---: | :---: |
| `Q-MULTI-JA-IN` | **Japanese (`ja`)** | **India (`IN`)** | インド特許法第3条(p)における伝統的知識の特許除外規定はどのようなものですか？ | What are traditional knowledge patent exclusions under Indian Section 3(p)? | `IN_doc-india-code-patents-sec3p` | `1.000` | **PASS** |
| `Q-MULTI-HI-IN` | **Hindi (`hi`)** | **India (`IN`)** | अश्वगंधा के फॉर्मूलेशन पर भारतीय पेटेंट अधिनियम की धारा 3(p) और 3(e) के तहत क्या आपत्तियां उठाई जाती हैं? | What objections arise under Section 3(p) and 3(e) for Ashwagandha? | `IN_doc-india-code-patents-sec3p` | `1.000` | **PASS** |
| `Q-MULTI-TE-IN` | **Telugu (`te`)** | **India (`IN`)** | ఆయుర్వేద ఔషధాల తయారీ మరియు విక్రయాల కోసం ఆయుష్ మరియు FSSAI లైసెన్సింగ్ నిబంధనలు ఏమిటి? | What are AYUSH and FSSAI licensing rules for Ayurvedic formulations? | `IN_doc-fssai-ayurveda-aahara-2022` | `0.942` | **PASS** |
| `Q-MULTI-TA-IN` | **Tamil (`ta`)** | **India (`IN`)** | மூலிகை மருந்துகளுக்கு காப்புரிமை பெறுவதில் பாரம்பரிய அறிவு விலக்குகள் என்ன? | What are traditional knowledge exclusions for herbal patents? | `IN_doc-india-code-patents-sec3p` | `1.000` | **PASS** |
| `Q-MULTI-HI-JP` | **Hindi (`hi`)** | **Japan (`JP`)** | जापान पेटेंट कार्यालय में औषधीय आविष्कारों और जड़ी-बूटी योगों के लिए क्या आवश्यकताएं हैं? | Requirements for herbal inventions in Japan Patent Office (JPO) | `JP-KOKAI-2018-0542` | `0.871` | **PASS** |
| `Q-MULTI-DE-DE` | **German (`de`)** | **Germany (`DE`)** | Welche Anforderungen stellt das Arzneimittelgesetz (AMG) an die Zulassung traditioneller pflanzlicher Arzneimittel? | Requirements of the German Medicines Act (AMG) for traditional herbal registration | `DE-AMG-SEC39A` | `0.925` | **PASS** |
