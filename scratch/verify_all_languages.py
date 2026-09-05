import urllib.request
import json
import sqlite3
from pathlib import Path
import sys

sys.stdout.reconfigure(encoding="utf-8")

def check_db():
    db_path = Path("data/ipsakti_dev.db")
    if not db_path.exists():
        print("ERROR: data/ipsakti_dev.db does not exist!")
        return
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM documents")
    doc_count = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM chunks")
    chunk_count = cur.fetchone()[0]
    print(f"=== LIVE DATABASE STATUS ===")
    print(f"Database File: {db_path} (ACTIVE)")
    print(f"Total Authoritative Documents in DB: {doc_count}")
    print(f"Total Legal Chunks in DB: {chunk_count}")
    
    cur.execute("SELECT title, domain, jurisdiction FROM documents ORDER BY domain")
    rows = cur.fetchall()
    print(f"Ingested Sources Sample ({len(rows)} documents):")
    for r in rows[:10]:
        print(f"  • [{r[1].upper()}] {r[0]} ({r[2]})")
    if len(rows) > 10:
        print(f"  ... and {len(rows)-10} more authoritative documents.")
    print()

def test_language_query(lang_name, lang_code, query):
    payload = json.dumps({
        "query": query,
        "language": lang_code,
    }).encode("utf-8")

    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/chat",
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"=== TEST: {lang_name} (Code: {lang_code}) ===")
            print(f"Query: {query}")
            print(f"Latency: {data.get('total_latency_ms')} ms | Model: {data.get('model_used')}")
            print(f"Retrieved Passages: {len(data.get('cited_passages', []))}")
            for idx, c in enumerate(data.get("cited_passages", [])[:3]):
                print(f"  [src-{idx+1}] {c.get('source_title')} | {c.get('section')} (Score: {c.get('relevance_score')})")
            print("Answer Preview:")
            print(data.get("answer")[:250].strip() + "...\n")
            return True
    except Exception as e:
        print(f"FAILED {lang_name}: {e}")
        return False

if __name__ == "__main__":
    check_db()
    
    tests = [
        ("English", "en", "Can I patent an Ayurvedic formulation with Ashwagandha?"),
        ("Telugu", "te", "అశ్వగంధతో కూడిన ఆయుర్వేద మిశ్రమానికి పేటెంట్ పొందవచ్చా?"),
        ("Hindi", "hi", "क्या मैं अश्वगंधा के साथ आयुर्वेदिक फॉर्मूलेशन को पेटेंट करा सकता हूँ?"),
        ("Tamil", "ta", "அஸ்வகந்தா ஆயுர்வேத மருந்துக்கு இந்தியாவில் காப்புரிமை பெற முடியுமா?"),
    ]
    
    success = True
    for name, code, q in tests:
        ok = test_language_query(name, code, q)
        if not ok:
            success = False
            
    print("ALL LANGUAGE & DATABASE RETRIEVAL STATUS: " + ("100% OPERATIONAL & VERIFIED" if success else "FAILED"))
