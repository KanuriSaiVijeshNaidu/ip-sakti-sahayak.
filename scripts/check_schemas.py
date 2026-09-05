path = "backend/app/models/schemas.py"
content = open(path, encoding="utf-8").read()

# Check for missing fields
missing = []
if "model_used" not in content:
    missing.append("model_used in ChatResponse")
if "retrieval_latency_ms" not in content:
    missing.append("retrieval_latency_ms in ChatResponse")
if "total_latency_ms" not in content:
    missing.append("total_latency_ms in ChatResponse")
if "grounding_score" not in content:
    missing.append("grounding_score in RetrievalCandidate")
if "ProductGuidanceResponse" not in content:
    missing.append("ProductGuidanceResponse")
if "applicable_regulations" not in content:
    missing.append("applicable_regulations in ProductGuidanceResponse")
if "AdminTraceResponse" not in content:
    missing.append("AdminTraceResponse")

print("Missing schema fields/classes:", missing if missing else "NONE")
