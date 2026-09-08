import json
from pathlib import Path

def update_benchmark():
    benchmark_path = Path("evaluation/benchmark_test_set.json")
    if not benchmark_path.exists():
        print("Benchmark file not found!")
        return

    with open(benchmark_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    data["benchmark_status"] = "DRAFT"
    data["evaluation_status"] = "DRAFT (AWAITING INDEPENDENT DOCUMENT VERIFICATION & EMBEDDINGS)"
    data["ground_truth_status"] = "DRAFT - NOT FINAL GROUND TRUTH"
    data["status_note"] = "Benchmark status is DRAFT. Expected documents have not undergone complete independent verification for ground truth certification."

    updated_queries = []
    for q in data.get("test_queries", []):
        doc_id = q.get("expected_document_id", q.get("expected_document", "UNKNOWN"))
        q["expected_document"] = doc_id
        q["expected_document_id"] = doc_id
        
        # Mark verification status
        if q.get("jurisdiction") in ["INDIA", "GERMANY", "WIPO"]:
            q["verification_status"] = "DRAFT_PENDING_DOCUMENT_VALIDATION (Referenced document quarantined/unverified)"
        else:
            q["verification_status"] = "DRAFT_PENDING_MANUAL_BENCHMARK_SIGN_OFF"
            
        updated_queries.append(q)

    data["test_queries"] = updated_queries

    with open(benchmark_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    print(f"Updated {len(updated_queries)} queries in benchmark_test_set.json with benchmark_status = DRAFT")

if __name__ == "__main__":
    update_benchmark()
