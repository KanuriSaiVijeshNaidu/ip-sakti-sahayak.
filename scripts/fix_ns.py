path = "backend/app/models/schemas.py"
content = open(path, encoding="utf-8").read()
# Add model_config to suppress protected namespace warning for model_used field
old = "class ChatResponse(BaseModel):"
new = 'class ChatResponse(BaseModel):\n    model_config = {"protected_namespaces": ()}'
if old in content and 'protected_namespaces' not in content:
    content = content.replace(old, new, 1)
    # Also for ProductGuidanceResponse
    old2 = "class ProductGuidanceResponse(BaseModel):"
    new2 = 'class ProductGuidanceResponse(BaseModel):\n    model_config = {"protected_namespaces": ()}'
    content = content.replace(old2, new2, 1)
    open(path, "w", encoding="utf-8").write(content)
    print("Fixed protected_namespaces")
else:
    print("Already fixed or pattern not found")
