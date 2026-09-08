# Phase 2H Germany Acquisition Report: Forensic Investigation & Status

**Project:** IP-SAKTI Sahayak / AYURLEX (SIH 26045)  
**Jurisdiction:** Germany (`DE`)  
**Target:** >= 2,000 Verified Documents / >= 4,000 Valid Chunks  
**Status:** **INSUFFICIENT (0 / 2,000 Verified Documents)**  

---

## 1. Targeted Routes Investigated

1. **DPMAconnectPlus & DPMAdatenabgabe:**
   - Official bulk delivery from the German Patent and Trade Mark Office (DPMA) provides weekly full-text XML releases of German national publications.
   - Access requires signing two physical paper contracts, mailing them to DPMA in Munich, and paying an annual fee of 200 EUR. Prohibited under Rule 21, Rule 23, and Rule 24.
2. **DEPATISnet:**
   - Interactive search portal provided by DPMA. Protected by bot-detection and terms prohibiting automated extraction.
3. **Bosch PLS Benchmark (`atazanavir.csv`, `injection_valve.csv`):**
   - 178 patent families list German (`DE`) family members.
   - Forensic analysis revealed that the textual claims and descriptions provided in the CSV are English specifications derived from US or PCT family members.
   - Under Rule 10 (No jurisdiction mixing), Rule 12 (No translation -> DE conversion), and Rule 16 (Preserve original patent language), these English records cannot be classified as German national patents.
4. **Google Patents BigQuery Public Data:**
   - Confirmed 0% claims and 0% descriptions populated for German (`DE`) patents in the public BigQuery export tables.

## 2. Conclusion
German national patent publications (`DE`) must be authentic German-language statutory disclosures. Legitimate bulk acquisition remains blocked by contractual and financial prerequisites at DPMA.
